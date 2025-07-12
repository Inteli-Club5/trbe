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

// Get all badges
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      rarity, 
      search, 
      isActive,
      isHidden
    } = req.query;
    const skip = (page - 1) * limit;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (rarity) {
      where.rarity = rarity;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (isHidden !== undefined) {
      where.isHidden = isHidden === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [badges, total] = await Promise.all([
      prisma.badge.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          rarity: true,
          icon: true,
          iconComponent: true,
          requirement: true,
          maxProgress: true,
          tokens: true,
          experience: true,
          isActive: true,
          isHidden: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              userBadges: true
            }
          }
        }
      }),
      prisma.badge.count({ where })
    ]);

    res.json({
      success: true,
      data: badges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get badge by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const badge = await prisma.badge.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        rarity: true,
        icon: true,
        iconComponent: true,
        requirement: true,
        maxProgress: true,
        tokens: true,
        experience: true,
        isActive: true,
        isHidden: true,
        createdAt: true,
        updatedAt: true,
        userBadges: {
          select: {
            progress: true,
            earnedAt: true,
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
        },
        _count: {
          select: {
            userBadges: true
          }
        }
      }
    });

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.json({
      success: true,
      data: badge
    });
  } catch (error) {
    console.error('Get badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new badge (Admin only)
router.post('/', [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('category').isIn(['ATTENDANCE', 'SOCIAL', 'SHOPPING', 'ENGAGEMENT', 'SPECIAL', 'COMMUNITY', 'REPUTATION', 'LEADERSHIP']),
  body('rarity').isIn(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'LEGENDARY', 'MYTHIC']),
  body('icon').optional().trim(),
  body('iconComponent').optional().trim(),
  body('requirement').optional().trim(),
  body('maxProgress').optional().isInt({ min: 1 }),
  body('tokens').optional().isInt({ min: 0 }),
  body('experience').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isHidden').optional().isBoolean(),
  handleValidationErrors
], async (req, res) => {
  try {
    const badgeData = req.body;

    // Check if badge with same name already exists
    const existingBadge = await prisma.badge.findUnique({
      where: { name: badgeData.name }
    });

    if (existingBadge) {
      return res.status(400).json({
        success: false,
        message: 'Badge with this name already exists'
      });
    }

    const badge = await prisma.badge.create({
      data: badgeData,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        rarity: true,
        icon: true,
        iconComponent: true,
        requirement: true,
        maxProgress: true,
        tokens: true,
        experience: true,
        isActive: true,
        isHidden: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      data: badge
    });
  } catch (error) {
    console.error('Create badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update badge (Admin only)
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('category').optional().isIn(['ATTENDANCE', 'SOCIAL', 'SHOPPING', 'ENGAGEMENT', 'SPECIAL', 'COMMUNITY', 'REPUTATION', 'LEADERSHIP']),
  body('rarity').optional().isIn(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'LEGENDARY', 'MYTHIC']),
  body('icon').optional().trim(),
  body('iconComponent').optional().trim(),
  body('requirement').optional().trim(),
  body('maxProgress').optional().isInt({ min: 1 }),
  body('tokens').optional().isInt({ min: 0 }),
  body('experience').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isHidden').optional().isBoolean(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if name is being changed and if it conflicts
    if (updateData.name) {
      const existingBadge = await prisma.badge.findUnique({
        where: { name: updateData.name }
      });

      if (existingBadge && existingBadge.id !== id) {
        return res.status(400).json({
          success: false,
          message: 'Badge with this name already exists'
        });
      }
    }

    const badge = await prisma.badge.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        rarity: true,
        icon: true,
        iconComponent: true,
        requirement: true,
        maxProgress: true,
        tokens: true,
        experience: true,
        isActive: true,
        isHidden: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Badge updated successfully',
      data: badge
    });
  } catch (error) {
    console.error('Update badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete badge (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.badge.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Badge deleted successfully'
    });
  } catch (error) {
    console.error('Delete badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's badges
router.get('/user/badges', async (req, res) => {
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

    const { page = 1, limit = 20, category, rarity } = req.query;
    const skip = (page - 1) * limit;

    const where = { userId: decoded.userId };

    if (category) {
      where.badge = { category };
    }

    if (rarity) {
      where.badge = { ...where.badge, rarity };
    }

    const [userBadges, total] = await Promise.all([
      prisma.userBadge.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { earnedAt: 'desc' },
        select: {
          id: true,
          progress: true,
          earnedAt: true,
          badge: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              rarity: true,
              icon: true,
              iconComponent: true,
              requirement: true,
              maxProgress: true,
              tokens: true,
              experience: true
            }
          }
        }
      }),
      prisma.userBadge.count({ where })
    ]);

    res.json({
      success: true,
      data: userBadges,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's available badges
router.get('/user/available', async (req, res) => {
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

    // Get user's earned badges
    const earnedBadges = await prisma.userBadge.findMany({
      where: { userId: decoded.userId },
      select: { badgeId: true }
    });

    const earnedBadgeIds = earnedBadges.map(ub => ub.badgeId);

    // Find available badges (not earned yet)
    const availableBadges = await prisma.badge.findMany({
      where: {
        isActive: true,
        isHidden: false,
        id: {
          notIn: earnedBadgeIds
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        rarity: true,
        icon: true,
        iconComponent: true,
        requirement: true,
        maxProgress: true,
        tokens: true,
        experience: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: availableBadges
    });
  } catch (error) {
    console.error('Get available badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Award badge to user (Admin only)
router.post('/:id/award', [
  body('userId').notEmpty().isString(),
  body('progress').optional().isInt({ min: 0 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, progress = 1 } = req.body;

    // Check if badge exists
    const badge = await prisma.badge.findUnique({
      where: { id }
    });

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user already has this badge
    const existingUserBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: id
        }
      }
    });

    if (existingUserBadge) {
      return res.status(400).json({
        success: false,
        message: 'User already has this badge'
      });
    }

    // Create user badge
    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId: id,
        progress
      },
      select: {
        id: true,
        progress: true,
        earnedAt: true,
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            rarity: true,
            icon: true,
            iconComponent: true,
            tokens: true,
            experience: true
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true
          }
        }
      }
    });

    // Award rewards
    if (badge.tokens > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          tokens: { increment: badge.tokens }
        }
      });
    }

    if (badge.experience > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          experience: { increment: badge.experience }
        }
      });
    }

    // Update user stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalBadges: { increment: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Badge awarded successfully',
      data: userBadge
    });
  } catch (error) {
    console.error('Award badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update badge progress
router.put('/:id/progress', [
  body('progress').isInt({ min: 0 }),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Get user badge
    const userBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId: decoded.userId,
          badgeId: id
        }
      },
      include: {
        badge: true
      }
    });

    if (!userBadge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found for user'
      });
    }

    // Check if progress exceeds max progress
    if (progress > userBadge.badge.maxProgress) {
      return res.status(400).json({
        success: false,
        message: 'Progress cannot exceed maximum progress'
      });
    }

    // Update progress
    const updatedUserBadge = await prisma.userBadge.update({
      where: {
        userId_badgeId: {
          userId: decoded.userId,
          badgeId: id
        }
      },
      data: { progress },
      select: {
        id: true,
        progress: true,
        earnedAt: true,
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            rarity: true,
            icon: true,
            iconComponent: true,
            maxProgress: true,
            tokens: true,
            experience: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Badge progress updated successfully',
      data: updatedUserBadge
    });
  } catch (error) {
    console.error('Update badge progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's badge statistics
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
      totalBadges,
      badgesByCategory,
      badgesByRarity,
      totalTokensEarned,
      totalExperienceEarned
    ] = await Promise.all([
      prisma.userBadge.count({
        where: { userId: decoded.userId }
      }),
      prisma.userBadge.groupBy({
        by: ['badge'],
        where: { userId: decoded.userId },
        _count: true
      }),
      prisma.userBadge.groupBy({
        by: ['badge'],
        where: { userId: decoded.userId },
        _count: true
      }),
      prisma.userBadge.aggregate({
        where: { userId: decoded.userId },
        _sum: {
          badge: {
            select: {
              tokens: true
            }
          }
        }
      }),
      prisma.userBadge.aggregate({
        where: { userId: decoded.userId },
        _sum: {
          badge: {
            select: {
              experience: true
            }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalBadges,
        totalTokensEarned: totalTokensEarned._sum.badge?.tokens || 0,
        totalExperienceEarned: totalExperienceEarned._sum.badge?.experience || 0
      }
    });
  } catch (error) {
    console.error('Get badge stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get most popular badges
router.get('/popular/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;

    const popularBadges = await prisma.badge.findMany({
      where: { isActive: true },
      orderBy: {
        userBadges: {
          _count: 'desc'
        }
      },
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        rarity: true,
        icon: true,
        iconComponent: true,
        _count: {
          select: {
            userBadges: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: popularBadges
    });
  } catch (error) {
    console.error('Get popular badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get rarest badges
router.get('/rarest/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;

    const rarestBadges = await prisma.badge.findMany({
      where: { isActive: true },
      orderBy: {
        userBadges: {
          _count: 'asc'
        }
      },
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        rarity: true,
        icon: true,
        iconComponent: true,
        _count: {
          select: {
            userBadges: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: rarestBadges
    });
  } catch (error) {
    console.error('Get rarest badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 