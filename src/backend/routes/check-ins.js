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

// Get all check-ins (Admin only)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      status, 
      userId,
      gameId,
      dateFrom,
      dateTo
    } = req.query;
    const skip = (page - 1) * limit;

    const where = {};

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (gameId) {
      where.gameId = gameId;
    }

    if (dateFrom || dateTo) {
      where.checkedInAt = {};
      if (dateFrom) {
        where.checkedInAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.checkedInAt.lte = new Date(dateTo);
      }
    }

    const [checkIns, total] = await Promise.all([
      prisma.checkIn.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { checkedInAt: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          latitude: true,
          longitude: true,
          location: true,
          isVerified: true,
          photo: true,
          comment: true,
          prediction: true,
          baseTokens: true,
          bonusTokens: true,
          totalTokens: true,
          checkedInAt: true,
          verifiedAt: true,
          rejectedAt: true,
          rejectedReason: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          },
          game: {
            select: {
              id: true,
              homeTeam: true,
              awayTeam: true,
              date: true,
              championship: true
            }
          }
        }
      }),
      prisma.checkIn.count({ where })
    ]);

    res.json({
      success: true,
      data: checkIns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get check-ins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get check-in by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        status: true,
        latitude: true,
        longitude: true,
        location: true,
        isVerified: true,
        photo: true,
        comment: true,
        prediction: true,
        baseTokens: true,
        bonusTokens: true,
        totalTokens: true,
        checkedInAt: true,
        verifiedAt: true,
        rejectedAt: true,
        rejectedReason: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            level: true,
            reputationScore: true
          }
        },
        game: {
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
            status: true
          }
        }
      }
    });

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    res.json({
      success: true,
      data: checkIn
    });
  } catch (error) {
    console.error('Get check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create check-in
router.post('/', [
  body('type').isIn(['STADIUM', 'HOME', 'AWAY']),
  body('gameId').optional().isString(),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
  body('location').optional().trim(),
  body('photo').optional().isURL(),
  body('comment').optional().trim(),
  body('prediction').optional().isObject(),
  handleValidationErrors
], async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const checkInData = req.body;

    // Check if game exists if gameId is provided
    if (checkInData.gameId) {
      const game = await prisma.game.findUnique({
        where: { id: checkInData.gameId }
      });

      if (!game) {
        return res.status(404).json({
          success: false,
          message: 'Game not found'
        });
      }
    }

    // Calculate tokens based on type and other factors
    let baseTokens = 10; // Default base tokens
    let bonusTokens = 0;

    if (checkInData.type === 'STADIUM') {
      baseTokens = 50;
      bonusTokens = 25; // Bonus for stadium check-in
    } else if (checkInData.type === 'AWAY') {
      baseTokens = 30;
      bonusTokens = 15; // Bonus for away check-in
    }

    // Add bonus for photo
    if (checkInData.photo) {
      bonusTokens += 10;
    }

    // Add bonus for comment
    if (checkInData.comment) {
      bonusTokens += 5;
    }

    const totalTokens = baseTokens + bonusTokens;

    const checkIn = await prisma.checkIn.create({
      data: {
        ...checkInData,
        userId: decoded.userId,
        baseTokens,
        bonusTokens,
        totalTokens,
        status: 'PENDING'
      },
      select: {
        id: true,
        type: true,
        status: true,
        latitude: true,
        longitude: true,
        location: true,
        isVerified: true,
        photo: true,
        comment: true,
        prediction: true,
        baseTokens: true,
        bonusTokens: true,
        totalTokens: true,
        checkedInAt: true,
        game: {
          select: {
            id: true,
            homeTeam: true,
            awayTeam: true,
            date: true,
            championship: true
          }
        }
      }
    });

    // Update user stats
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        totalCheckIns: { increment: 1 },
        lastActivityDate: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Check-in created successfully',
      data: checkIn
    });
  } catch (error) {
    console.error('Create check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update check-in (Admin only)
router.put('/:id', [
  body('status').optional().isIn(['PENDING', 'CONFIRMED', 'REJECTED']),
  body('isVerified').optional().isBoolean(),
  body('rejectedReason').optional().trim(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if check-in exists
    const existingCheckIn = await prisma.checkIn.findUnique({
      where: { id }
    });

    if (!existingCheckIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    // Add timestamps based on status change
    if (updateData.status === 'CONFIRMED' && existingCheckIn.status !== 'CONFIRMED') {
      updateData.verifiedAt = new Date();
      
      // Award tokens to user
      await prisma.user.update({
        where: { id: existingCheckIn.userId },
        data: {
          tokens: { increment: existingCheckIn.totalTokens }
        }
      });
    }

    if (updateData.status === 'REJECTED' && existingCheckIn.status !== 'REJECTED') {
      updateData.rejectedAt = new Date();
    }

    const checkIn = await prisma.checkIn.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        type: true,
        status: true,
        latitude: true,
        longitude: true,
        location: true,
        isVerified: true,
        photo: true,
        comment: true,
        prediction: true,
        baseTokens: true,
        bonusTokens: true,
        totalTokens: true,
        checkedInAt: true,
        verifiedAt: true,
        rejectedAt: true,
        rejectedReason: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        },
        game: {
          select: {
            id: true,
            homeTeam: true,
            awayTeam: true,
            date: true,
            championship: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Check-in updated successfully',
      data: checkIn
    });
  } catch (error) {
    console.error('Update check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete check-in
router.delete('/:id', async (req, res) => {
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

    // Check if check-in exists and belongs to user
    const checkIn = await prisma.checkIn.findUnique({
      where: { id }
    });

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    if (checkIn.userId !== decoded.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own check-ins'
      });
    }

    await prisma.checkIn.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Check-in deleted successfully'
    });
  } catch (error) {
    console.error('Delete check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's check-ins
router.get('/user/check-ins', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const { page = 1, limit = 20, type, status, gameId } = req.query;
    const skip = (page - 1) * limit;

    const where = { userId: decoded.userId };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (gameId) {
      where.gameId = gameId;
    }

    const [checkIns, total] = await Promise.all([
      prisma.checkIn.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { checkedInAt: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          latitude: true,
          longitude: true,
          location: true,
          isVerified: true,
          photo: true,
          comment: true,
          prediction: true,
          baseTokens: true,
          bonusTokens: true,
          totalTokens: true,
          checkedInAt: true,
          verifiedAt: true,
          rejectedAt: true,
          rejectedReason: true,
          game: {
            select: {
              id: true,
              homeTeam: true,
              awayTeam: true,
              date: true,
              championship: true,
              type: true,
              status: true
            }
          }
        }
      }),
      prisma.checkIn.count({ where })
    ]);

    res.json({
      success: true,
      data: checkIns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user check-ins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's check-in statistics
router.get('/user/stats', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const [
      totalCheckIns,
      confirmedCheckIns,
      pendingCheckIns,
      rejectedCheckIns,
      totalTokensEarned,
      checkInsByType,
      checkInsByStatus
    ] = await Promise.all([
      prisma.checkIn.count({
        where: { userId: decoded.userId }
      }),
      prisma.checkIn.count({
        where: {
          userId: decoded.userId,
          status: 'CONFIRMED'
        }
      }),
      prisma.checkIn.count({
        where: {
          userId: decoded.userId,
          status: 'PENDING'
        }
      }),
      prisma.checkIn.count({
        where: {
          userId: decoded.userId,
          status: 'REJECTED'
        }
      }),
      prisma.checkIn.aggregate({
        where: {
          userId: decoded.userId,
          status: 'CONFIRMED'
        },
        _sum: {
          totalTokens: true
        }
      }),
      prisma.checkIn.groupBy({
        by: ['type'],
        where: { userId: decoded.userId },
        _count: true
      }),
      prisma.checkIn.groupBy({
        by: ['status'],
        where: { userId: decoded.userId },
        _count: true
      })
    ]);

    res.json({
      success: true,
      data: {
        totalCheckIns,
        confirmedCheckIns,
        pendingCheckIns,
        rejectedCheckIns,
        confirmationRate: totalCheckIns > 0 ? (confirmedCheckIns / totalCheckIns) * 100 : 0,
        totalTokensEarned: totalTokensEarned._sum.totalTokens || 0,
        checkInsByType,
        checkInsByStatus
      }
    });
  } catch (error) {
    console.error('Get check-in stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get game check-ins
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    const where = { gameId };

    if (status) {
      where.status = status;
    }

    const [checkIns, total] = await Promise.all([
      prisma.checkIn.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { checkedInAt: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          latitude: true,
          longitude: true,
          location: true,
          isVerified: true,
          photo: true,
          comment: true,
          prediction: true,
          baseTokens: true,
          bonusTokens: true,
          totalTokens: true,
          checkedInAt: true,
          verifiedAt: true,
          rejectedAt: true,
          rejectedReason: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              level: true,
              reputationScore: true
            }
          }
        }
      }),
      prisma.checkIn.count({ where })
    ]);

    res.json({
      success: true,
      data: checkIns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get game check-ins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 