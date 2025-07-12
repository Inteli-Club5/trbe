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

// Get all fan groups
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, level, search, isPublic } = req.query;
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

    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [fanGroups, total] = await Promise.all([
      prisma.fanGroup.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          banner: true,
          founded: true,
          location: true,
          country: true,
          city: true,
          headquarters: true,
          category: true,
          level: true,
          totalMembers: true,
          activeMembers: true,
          totalEvents: true,
          totalPoints: true,
          rankingPosition: true,
          isPublic: true,
          requiresApproval: true,
          maxMembers: true,
          website: true,
          socialLinks: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.fanGroup.count({ where })
    ]);

    res.json({
      success: true,
      data: fanGroups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get fan groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get fan group by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const fanGroup = await prisma.fanGroup.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        banner: true,
        founded: true,
        location: true,
        country: true,
        city: true,
        headquarters: true,
        category: true,
        level: true,
        totalMembers: true,
        activeMembers: true,
        totalEvents: true,
        totalPoints: true,
        rankingPosition: true,
        isPublic: true,
        requiresApproval: true,
        maxMembers: true,
        website: true,
        socialLinks: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        memberships: {
          where: { status: 'ACTIVE' },
          select: {
            status: true,
            role: true,
            joinedAt: true,
            approvedAt: true,
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
            earnedAt: true
          }
        }
      }
    });

    if (!fanGroup) {
      return res.status(404).json({
        success: false,
        message: 'Fan group not found'
      });
    }

    res.json({
      success: true,
      data: fanGroup
    });
  } catch (error) {
    console.error('Get fan group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new fan group
router.post('/', [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('logo').optional().isURL(),
  body('banner').optional().isURL(),
  body('founded').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('location').optional().trim(),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('headquarters').optional().trim(),
  body('category').optional().isIn(['OFFICIAL', 'UNOFFICIAL', 'COMMUNITY', 'REGIONAL', 'INTERNATIONAL']),
  body('level').optional().isIn(['EXEMPLARY', 'COMMENDABLE', 'RESPECTABLE', 'NEEDS_WORK', 'DISHONORABLE']),
  body('isPublic').optional().isBoolean(),
  body('requiresApproval').optional().isBoolean(),
  body('maxMembers').optional().isInt({ min: 1 }),
  body('website').optional().isURL(),
  body('socialLinks').optional().isObject(),
  body('tags').optional().isArray(),
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

    const fanGroupData = req.body;

    // Check if fan group with same name already exists
    const existingFanGroup = await prisma.fanGroup.findUnique({
      where: { name: fanGroupData.name }
    });

    if (existingFanGroup) {
      return res.status(400).json({
        success: false,
        message: 'Fan group with this name already exists'
      });
    }

    const fanGroup = await prisma.fanGroup.create({
      data: fanGroupData,
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        banner: true,
        founded: true,
        location: true,
        country: true,
        city: true,
        headquarters: true,
        category: true,
        level: true,
        totalMembers: true,
        activeMembers: true,
        totalEvents: true,
        totalPoints: true,
        rankingPosition: true,
        isPublic: true,
        requiresApproval: true,
        maxMembers: true,
        website: true,
        socialLinks: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Add creator as founder
    await prisma.fanGroupMembership.create({
      data: {
        userId: decoded.userId,
        fanGroupId: fanGroup.id,
        status: 'ACTIVE',
        role: 'FOUNDER',
        approvedAt: new Date()
      }
    });

    // Update member count
    await prisma.fanGroup.update({
      where: { id: fanGroup.id },
      data: {
        totalMembers: { increment: 1 },
        activeMembers: { increment: 1 }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Fan group created successfully',
      data: fanGroup
    });
  } catch (error) {
    console.error('Create fan group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update fan group
router.put('/:id', [
  body('name').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('logo').optional().isURL(),
  body('banner').optional().isURL(),
  body('founded').optional().isInt({ min: 1800, max: new Date().getFullYear() }),
  body('location').optional().trim(),
  body('country').optional().trim(),
  body('city').optional().trim(),
  body('headquarters').optional().trim(),
  body('category').optional().isIn(['OFFICIAL', 'UNOFFICIAL', 'COMMUNITY', 'REGIONAL', 'INTERNATIONAL']),
  body('level').optional().isIn(['EXEMPLARY', 'COMMENDABLE', 'RESPECTABLE', 'NEEDS_WORK', 'DISHONORABLE']),
  body('isPublic').optional().isBoolean(),
  body('requiresApproval').optional().isBoolean(),
  body('maxMembers').optional().isInt({ min: 1 }),
  body('website').optional().isURL(),
  body('socialLinks').optional().isObject(),
  body('tags').optional().isArray(),
  handleValidationErrors
], async (req, res) => {
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

    // Check if user is leader or founder of this fan group
    const membership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId: decoded.userId,
        fanGroupId: id,
        status: 'ACTIVE',
        role: { in: ['LEADER', 'FOUNDER'] }
      }
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Only leaders and founders can update fan group'
      });
    }

    const updateData = req.body;

    // Check if name is being changed and if it conflicts
    if (updateData.name) {
      const existingFanGroup = await prisma.fanGroup.findUnique({
        where: { name: updateData.name }
      });

      if (existingFanGroup && existingFanGroup.id !== id) {
        return res.status(400).json({
          success: false,
          message: 'Fan group with this name already exists'
        });
      }
    }

    const fanGroup = await prisma.fanGroup.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        banner: true,
        founded: true,
        location: true,
        country: true,
        city: true,
        headquarters: true,
        category: true,
        level: true,
        totalMembers: true,
        activeMembers: true,
        totalEvents: true,
        totalPoints: true,
        rankingPosition: true,
        isPublic: true,
        requiresApproval: true,
        maxMembers: true,
        website: true,
        socialLinks: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Fan group updated successfully',
      data: fanGroup
    });
  } catch (error) {
    console.error('Update fan group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete fan group
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

    // Check if user is founder of this fan group
    const membership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId: decoded.userId,
        fanGroupId: id,
        status: 'ACTIVE',
        role: 'FOUNDER'
      }
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Only founders can delete fan group'
      });
    }

    // Soft delete
    await prisma.fanGroup.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Fan group deleted successfully'
    });
  } catch (error) {
    console.error('Delete fan group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Join fan group
router.post('/:id/join', async (req, res) => {
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

    // Check if fan group exists
    const fanGroup = await prisma.fanGroup.findUnique({
      where: { id }
    });

    if (!fanGroup) {
      return res.status(404).json({
        success: false,
        message: 'Fan group not found'
      });
    }

    // Check if user is already a member
    const existingMembership = await prisma.fanGroupMembership.findUnique({
      where: { userId: decoded.userId }
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of a fan group'
      });
    }

    // Check if fan group is full
    if (fanGroup.maxMembers && fanGroup.totalMembers >= fanGroup.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Fan group is full'
      });
    }

    // Create membership
    const membership = await prisma.fanGroupMembership.create({
      data: {
        userId: decoded.userId,
        fanGroupId: id,
        status: fanGroup.requiresApproval ? 'PENDING' : 'ACTIVE',
        role: 'MEMBER',
        approvedAt: fanGroup.requiresApproval ? null : new Date()
      }
    });

    // Update member count if approved
    if (!fanGroup.requiresApproval) {
      await prisma.fanGroup.update({
        where: { id },
        data: {
          totalMembers: { increment: 1 },
          activeMembers: { increment: 1 }
        }
      });
    }

    res.json({
      success: true,
      message: fanGroup.requiresApproval ? 'Join request sent successfully' : 'Joined fan group successfully',
      data: membership
    });
  } catch (error) {
    console.error('Join fan group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Leave fan group
router.delete('/:id/leave', async (req, res) => {
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

    // Check if user is a member of this fan group
    const membership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId: decoded.userId,
        fanGroupId: id,
        status: { in: ['ACTIVE', 'PENDING'] }
      }
    });

    if (!membership) {
      return res.status(400).json({
        success: false,
        message: 'User is not a member of this fan group'
      });
    }

    // Delete membership
    await prisma.fanGroupMembership.delete({
      where: { userId: decoded.userId }
    });

    // Update member count if was active
    if (membership.status === 'ACTIVE') {
      await prisma.fanGroup.update({
        where: { id },
        data: {
          totalMembers: { decrement: 1 },
          activeMembers: { decrement: 1 }
        }
      });
    }

    res.json({
      success: true,
      message: 'Left fan group successfully'
    });
  } catch (error) {
    console.error('Leave fan group error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get fan group members
router.get('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, status, role } = req.query;
    const skip = (page - 1) * limit;

    // Check if fan group exists
    const fanGroup = await prisma.fanGroup.findUnique({
      where: { id }
    });

    if (!fanGroup) {
      return res.status(404).json({
        success: false,
        message: 'Fan group not found'
      });
    }

    const where = { fanGroupId: id };

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = role;
    }

    const [members, total] = await Promise.all([
      prisma.fanGroupMembership.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { joinedAt: 'asc' },
        select: {
          status: true,
          role: true,
          joinedAt: true,
          approvedAt: true,
          approvedBy: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              level: true,
              reputationScore: true,
              totalCheckIns: true,
              totalEvents: true,
              totalTasks: true,
              totalBadges: true
            }
          }
        }
      }),
      prisma.fanGroupMembership.count({ where })
    ]);

    res.json({
      success: true,
      data: members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get fan group members error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Approve member
router.post('/:id/members/:userId/approve', async (req, res) => {
  try {
    const { id, userId } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user is leader or founder of this fan group
    const membership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId: decoded.userId,
        fanGroupId: id,
        status: 'ACTIVE',
        role: { in: ['LEADER', 'FOUNDER'] }
      }
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Only leaders and founders can approve members'
      });
    }

    // Check if target user has pending membership
    const targetMembership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId,
        fanGroupId: id,
        status: 'PENDING'
      }
    });

    if (!targetMembership) {
      return res.status(404).json({
        success: false,
        message: 'Pending membership not found'
      });
    }

    // Approve membership
    await prisma.fanGroupMembership.update({
      where: { userId },
      data: {
        status: 'ACTIVE',
        approvedAt: new Date(),
        approvedBy: decoded.userId
      }
    });

    // Update member count
    await prisma.fanGroup.update({
      where: { id },
      data: {
        totalMembers: { increment: 1 },
        activeMembers: { increment: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Member approved successfully'
    });
  } catch (error) {
    console.error('Approve member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reject member
router.post('/:id/members/:userId/reject', [
  body('reason').optional().trim(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { reason } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user is leader or founder of this fan group
    const membership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId: decoded.userId,
        fanGroupId: id,
        status: 'ACTIVE',
        role: { in: ['LEADER', 'FOUNDER'] }
      }
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Only leaders and founders can reject members'
      });
    }

    // Check if target user has pending membership
    const targetMembership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId,
        fanGroupId: id,
        status: 'PENDING'
      }
    });

    if (!targetMembership) {
      return res.status(404).json({
        success: false,
        message: 'Pending membership not found'
      });
    }

    // Delete membership
    await prisma.fanGroupMembership.delete({
      where: { userId }
    });

    res.json({
      success: true,
      message: 'Member rejected successfully'
    });
  } catch (error) {
    console.error('Reject member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update member role
router.put('/:id/members/:userId/role', [
  body('role').isIn(['MEMBER', 'MODERATOR', 'LEADER']),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { role } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Check if user is founder of this fan group
    const membership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId: decoded.userId,
        fanGroupId: id,
        status: 'ACTIVE',
        role: 'FOUNDER'
      }
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Only founders can update member roles'
      });
    }

    // Check if target user is an active member
    const targetMembership = await prisma.fanGroupMembership.findFirst({
      where: {
        userId,
        fanGroupId: id,
        status: 'ACTIVE'
      }
    });

    if (!targetMembership) {
      return res.status(404).json({
        success: false,
        message: 'Active membership not found'
      });
    }

    // Update role
    await prisma.fanGroupMembership.update({
      where: { userId },
      data: { role }
    });

    res.json({
      success: true,
      message: 'Member role updated successfully'
    });
  } catch (error) {
    console.error('Update member role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get fan group events
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status, category, type } = req.query;
    const skip = (page - 1) * limit;

    // Check if fan group exists
    const fanGroup = await prisma.fanGroup.findUnique({
      where: { id }
    });

    if (!fanGroup) {
      return res.status(404).json({
        success: false,
        message: 'Fan group not found'
      });
    }

    const where = { fanGroupId: id };

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
    console.error('Get fan group events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get fan group achievements
router.get('/:id/achievements', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, category, year } = req.query;
    const skip = (page - 1) * limit;

    // Check if fan group exists
    const fanGroup = await prisma.fanGroup.findUnique({
      where: { id }
    });

    if (!fanGroup) {
      return res.status(404).json({
        success: false,
        message: 'Fan group not found'
      });
    }

    const where = { fanGroupId: id };

    if (category) {
      where.category = category;
    }

    if (year) {
      where.year = parseInt(year);
    }

    const [achievements, total] = await Promise.all([
      prisma.fanGroupAchievement.findMany({
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
          earnedAt: true
        }
      }),
      prisma.fanGroupAchievement.count({ where })
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
    console.error('Get fan group achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 