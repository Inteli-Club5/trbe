const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

// Get all games with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      clubId,
      status,
      type,
      championship,
      dateFrom,
      dateTo,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {};
    
    if (clubId) where.clubId = clubId;
    if (status) where.status = status;
    if (type) where.type = type;
    if (championship) where.championship = championship;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { homeTeam: { contains: search, mode: 'insensitive' } },
        { awayTeam: { contains: search, mode: 'insensitive' } },
        { stadium: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        include: {
          club: {
            select: {
              id: true,
              name: true,
              shortName: true,
              logo: true
            }
          },
          checkIns: {
            select: {
              id: true,
              userId: true,
              status: true
            }
          },
          events: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.game.count({ where })
    ]);

    res.json({
      success: true,
      data: games,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get game by ID with related data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logo: true,
            banner: true
          }
        },
        checkIns: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true
              }
            }
          },
          orderBy: { checkedInAt: 'desc' }
        },
        events: {
          include: {
            participants: {
              select: {
                id: true,
                status: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new game
router.post('/', [
  body('clubId').notEmpty(),
  body('homeTeam').notEmpty().trim(),
  body('awayTeam').notEmpty().trim(),
  body('date').isISO8601(),
  body('championship').isIn(['PREMIER_LEAGUE', 'FA_CUP', 'CARABAO_CUP', 'CHAMPIONS_LEAGUE', 'EUROPA_LEAGUE', 'FRIENDLY', 'OTHER']),
  body('type').optional().isIn(['HOME', 'AWAY', 'NEUTRAL']),
  body('status').optional().isIn(['SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED', 'POSTPONED']),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      clubId,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      date,
      time,
      stadium,
      championship,
      type = 'HOME',
      status = 'SCHEDULED',
      description,
      highlights,
      attendance,
      weather
    } = req.body;

    // Verify club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId }
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    const game = await prisma.game.create({
      data: {
        clubId,
        homeTeam,
        awayTeam,
        homeScore: homeScore ? parseInt(homeScore) : null,
        awayScore: awayScore ? parseInt(awayScore) : null,
        date: new Date(date),
        time,
        stadium,
        championship,
        type,
        status,
        description,
        highlights,
        attendance: attendance ? parseInt(attendance) : null,
        weather
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logo: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update game
router.put('/:id', [
  body('homeTeam').optional().notEmpty().trim(),
  body('awayTeam').optional().notEmpty().trim(),
  body('date').optional().isISO8601(),
  body('championship').optional().isIn(['PREMIER_LEAGUE', 'FA_CUP', 'CARABAO_CUP', 'CHAMPIONS_LEAGUE', 'EUROPA_LEAGUE', 'FRIENDLY', 'OTHER']),
  body('type').optional().isIn(['HOME', 'AWAY', 'NEUTRAL']),
  body('status').optional().isIn(['SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED', 'POSTPONED']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert numeric fields
    if (updateData.homeScore !== undefined) {
      updateData.homeScore = updateData.homeScore ? parseInt(updateData.homeScore) : null;
    }
    if (updateData.awayScore !== undefined) {
      updateData.awayScore = updateData.awayScore ? parseInt(updateData.awayScore) : null;
    }
    if (updateData.attendance !== undefined) {
      updateData.attendance = updateData.attendance ? parseInt(updateData.attendance) : null;
    }
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const game = await prisma.game.update({
      where: { id },
      data: updateData,
      include: {
        club: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logo: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Game updated successfully',
      data: game
    });
  } catch (error) {
    console.error('Error updating game:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete game
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.game.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Game deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting game:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get games by club
router.get('/club/:clubId', async (req, res) => {
  try {
    const { clubId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = { clubId };
    if (status) where.status = status;

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.game.count({ where })
    ]);

    res.json({
      success: true,
      data: games,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching club games:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get upcoming games
router.get('/upcoming/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;

    const games = await prisma.game.findMany({
      where: {
        date: {
          gte: new Date()
        },
        status: {
          in: ['SCHEDULED', 'LIVE']
        }
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logo: true
          }
        }
      },
      orderBy: { date: 'asc' },
      take: limit
    });

    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get recent games
router.get('/recent/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;

    const games = await prisma.game.findMany({
      where: {
        status: 'FINISHED'
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            shortName: true,
            logo: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: limit
    });

    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    console.error('Error fetching recent games:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 