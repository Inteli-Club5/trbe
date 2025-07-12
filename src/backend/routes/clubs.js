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

// Get all clubs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, level, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null
    };

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortName: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [clubs, total] = await Promise.all([
      prisma.club.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          shortName: true,
          nickname: true,
          description: true,
          logo: true,
          banner: true,
          founded: true,
          location: true,
          country: true,
          city: true,
          stadium: true,
          capacity: true,
          category: true,
          level: true,
          totalFans: true,
          activeFans: true,
          totalTrophies: true,
          totalMatches: true,
          website: true,
          socialLinks: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.club.count({ where })
    ]);

    res.json({
      success: true,
      data: clubs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get clubs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get club by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const club = await prisma.club.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        shortName: true,
        nickname: true,
        description: true,
        logo: true,
        banner: true,
        founded: true,
        location: true,
        country: true,
        city: true,
        stadium: true,
        capacity: true,
        category: true,
        level: true,
        totalFans: true,
        activeFans: true,
        totalTrophies: true,
        totalMatches: true,
        website: true,
        socialLinks: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        follows: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true
              }
            },
            followedAt: true
          }
        },
        games: {
          where: { status: { not: 'CANCELLED' } },
          orderBy: { date: 'desc' },
          take: 5,
          select: {
            id: true,
            homeTeam: true,
            awayTeam: true,
            homeScore: true,
            awayScore: true,
            date: true,
            championship: true,
            type: true,
            status: true
          }
        },
        events: {
          where: { status: { in: ['PUBLISHED', 'OPEN'] } },
          orderBy: { date: 'asc' },
          take: 5,
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            category: true,
            type: true,
            maxParticipants: true,
            currentParticipants: true
          }
        },
        achievements: {
          orderBy: { earnedAt: 'desc' },
          take: 10,
          select: {
            id: true,
            title: true,
            description: true,
            icon: true,
            category: true,
            year: true,
            competition: true,
            earnedAt: true
          }
        }
      }
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    res.json({
      success: true,
      data: club
    });
  } catch (error) {
    console.error('Get club error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new club (Admin only)
router.post('/', [
  body('name').notEmpty().trim(),
  body('shortName').optional().trim(),
  body('nickname').optional().trim(),
  body('description').optional().trim(),
  body('logo').optional().isURL(),
  body('banner').optional().isURL(),
  body('founded').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('location').optional().trim(),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('stadium').optional().trim(),
  body('capacity').optional().isInt({ min: 1 }),
  body('category').optional().isIn(['ELITE', 'PREMIUM', 'STANDARD', 'DEVELOPING']),
  body('level').optional().isIn(['EXEMPLARY', 'COMMENDABLE', 'RESPECTABLE', 'NEEDS_WORK', 'DISHONORABLE']),
  body('website').optional().isURL(),
  body('socialLinks').optional().isObject(),
  body('tags').optional().isArray(),
  handleValidationErrors
], async (req, res) => {
  try {
    const clubData = req.body;

    // Check if club with same name already exists
    const existingClub = await prisma.club.findUnique({
      where: { name: clubData.name }
    });

    if (existingClub) {
      return res.status(400).json({
        success: false,
        message: 'Club with this name already exists'
      });
    }

    const club = await prisma.club.create({
      data: clubData,
      select: {
        id: true,
        name: true,
        shortName: true,
        nickname: true,
        description: true,
        logo: true,
        banner: true,
        founded: true,
        location: true,
        country: true,
        city: true,
        stadium: true,
        capacity: true,
        category: true,
        level: true,
        totalFans: true,
        activeFans: true,
        totalTrophies: true,
        totalMatches: true,
        website: true,
        socialLinks: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: club
    });
  } catch (error) {
    console.error('Create club error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update club (Admin only)
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('shortName').optional().trim(),
  body('nickname').optional().trim(),
  body('description').optional().trim(),
  body('logo').optional().isURL(),
  body('banner').optional().isURL(),
  body('founded').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('location').optional().trim(),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('stadium').optional().trim(),
  body('capacity').optional().isInt({ min: 1 }),
  body('category').optional().isIn(['ELITE', 'PREMIUM', 'STANDARD', 'DEVELOPING']),
  body('level').optional().isIn(['EXEMPLARY', 'COMMENDABLE', 'RESPECTABLE', 'NEEDS_WORK', 'DISHONORABLE']),
  body('website').optional().isURL(),
  body('socialLinks').optional().isObject(),
  body('tags').optional().isArray(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if club exists
    const existingClub = await prisma.club.findUnique({
      where: { id }
    });

    if (!existingClub) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check if name is being changed and if it conflicts
    if (updateData.name && updateData.name !== existingClub.name) {
      const nameConflict = await prisma.club.findUnique({
        where: { name: updateData.name }
      });

      if (nameConflict) {
        return res.status(400).json({
          success: false,
          message: 'Club with this name already exists'
        });
      }
    }

    const club = await prisma.club.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        shortName: true,
        nickname: true,
        description: true,
        logo: true,
        banner: true,
        founded: true,
        location: true,
        country: true,
        city: true,
        stadium: true,
        capacity: true,
        category: true,
        level: true,
        totalFans: true,
        activeFans: true,
        totalTrophies: true,
        totalMatches: true,
        website: true,
        socialLinks: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Club updated successfully',
      data: club
    });
  } catch (error) {
    console.error('Update club error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete club (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if club exists
    const existingClub = await prisma.club.findUnique({
      where: { id }
    });

    if (!existingClub) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Soft delete
    await prisma.club.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Club deleted successfully'
    });
  } catch (error) {
    console.error('Delete club error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Follow club
router.post('/:id/follow', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id }
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    // Check if user already follows this club
    const existingFollow = await prisma.clubFollow.findUnique({
      where: { userId: decoded.userId }
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'User already follows a club'
      });
    }

    // Create follow relationship
    await prisma.clubFollow.create({
      data: {
        userId: decoded.userId,
        clubId: id
      }
    });

    // Update club fan count
    await prisma.club.update({
      where: { id },
      data: {
        totalFans: { increment: 1 },
        activeFans: { increment: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Club followed successfully'
    });
  } catch (error) {
    console.error('Follow club error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Unfollow club
router.delete('/:id/follow', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user follows this club
    const existingFollow = await prisma.clubFollow.findUnique({
      where: { userId: decoded.userId }
    });

    if (!existingFollow || existingFollow.clubId !== id) {
      return res.status(400).json({
        success: false,
        message: 'User does not follow this club'
      });
    }

    // Remove follow relationship
    await prisma.clubFollow.delete({
      where: { userId: decoded.userId }
    });

    // Update club fan count
    await prisma.club.update({
      where: { id },
      data: {
        totalFans: { decrement: 1 },
        activeFans: { decrement: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Club unfollowed successfully'
    });
  } catch (error) {
    console.error('Unfollow club error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get club followers
router.get('/:id/followers', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id }
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    const [followers, total] = await Promise.all([
      prisma.clubFollow.findMany({
        where: { clubId: id },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { followedAt: 'desc' },
        select: {
          followedAt: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              level: true,
              reputationScore: true,
              totalCheckIns: true,
              totalEvents: true
            }
          }
        }
      }),
      prisma.clubFollow.count({
        where: { clubId: id }
      })
    ]);

    res.json({
      success: true,
      data: followers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get club followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get club games
router.get('/:id/games', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status, championship, type } = req.query;
    const skip = (page - 1) * limit;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id }
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    const where = { clubId: id };

    if (status) {
      where.status = status;
    }

    if (championship) {
      where.championship = championship;
    }

    if (type) {
      where.type = type;
    }

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        select: {
          id: true,
          homeTeam: true,
          awayTeam: true,
          homeScore: true,
          awayScore: true,
          date: true,
          time: true,
          stadium: true,
          championship: true,
          type: true,
          status: true,
          description: true,
          highlights: true,
          attendance: true,
          weather: true,
          createdAt: true,
          updatedAt: true
        }
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
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get club games error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get club events
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status, category, type } = req.query;
    const skip = (page - 1) * limit;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id }
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    const where = { clubId: id };

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { date: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          type: true,
          date: true,
          time: true,
          location: true,
          latitude: true,
          longitude: true,
          maxParticipants: true,
          currentParticipants: true,
          price: true,
          currency: true,
          status: true,
          isPublic: true,
          image: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get club events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get club achievements
router.get('/:id/achievements', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, category, year } = req.query;
    const skip = (page - 1) * limit;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id }
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      });
    }

    const where = { clubId: id };

    if (category) {
      where.category = category;
    }

    if (year) {
      where.year = parseInt(year);
    }

    const [achievements, total] = await Promise.all([
      prisma.clubAchievement.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { earnedAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          icon: true,
          category: true,
          year: true,
          competition: true,
          earnedAt: true
        }
      }),
      prisma.clubAchievement.count({ where })
    ]);

    res.json({
      success: true,
      data: achievements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get club achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 