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

// Get all events
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      type, 
      status, 
      search, 
      dateFrom, 
      dateTo,
      isPublic,
      clubId,
      fanGroupId
    } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null
    };

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }

    if (clubId) {
      where.clubId = clubId;
    }

    if (fanGroupId) {
      where.fanGroupId = fanGroupId;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
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
          organizerId: true,
          organizerType: true,
          clubId: true,
          fanGroupId: true,
          gameId: true,
          maxParticipants: true,
          currentParticipants: true,
          price: true,
          currency: true,
          status: true,
          isPublic: true,
          image: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
          club: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          },
          fanGroup: {
            select: {
              id: true,
              name: true,
              logo: true
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
          },
          _count: {
            select: {
              participants: true
            }
          }
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
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
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
        organizerId: true,
        organizerType: true,
        clubId: true,
        fanGroupId: true,
        gameId: true,
        maxParticipants: true,
        currentParticipants: true,
        price: true,
        currency: true,
        status: true,
        isPublic: true,
        image: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        club: {
          select: {
            id: true,
            name: true,
            logo: true,
            banner: true
          }
        },
        fanGroup: {
          select: {
            id: true,
            name: true,
            logo: true,
            banner: true
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
        },
        participants: {
          select: {
            status: true,
            registeredAt: true,
            confirmedAt: true,
            attendedAt: true,
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
            participants: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new event
router.post('/', [
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('category').isIn(['TRAVEL', 'SOCIAL', 'CHARITY', 'OFFICIAL', 'COMMUNITY', 'SPORTS', 'CULTURAL']),
  body('type').isIn(['MATCH_DAY', 'MEETUP', 'CHARITY', 'TRAINING', 'TOURNAMENT', 'CELEBRATION', 'AWAY_TRIP']),
  body('date').isISO8601(),
  body('time').optional().trim(),
  body('location').optional().trim(),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
  body('maxParticipants').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'OPEN', 'FULL', 'CANCELLED', 'FINISHED']),
  body('isPublic').optional().isBoolean(),
  body('image').optional().isURL(),
  body('tags').optional().isArray(),
  body('clubId').optional().isString(),
  body('fanGroupId').optional().isString(),
  body('gameId').optional().isString(),
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

    const eventData = req.body;

    // Determine organizer type and validate permissions
    let organizerType = null;
    let organizerId = null;

    if (eventData.clubId) {
      // Check if user has permission to create events for this club
      // This would typically require admin role or club ownership
      organizerType = 'club';
      organizerId = eventData.clubId;
    } else if (eventData.fanGroupId) {
      // Check if user is leader or founder of this fan group
      const membership = await prisma.fanGroupMembership.findFirst({
        where: {
          userId: decoded.userId,
          fanGroupId: eventData.fanGroupId,
          status: 'ACTIVE',
          role: { in: ['LEADER', 'FOUNDER'] }
        }
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: 'Only leaders and founders can create events for fan groups'
        });
      }

      organizerType = 'fan_group';
      organizerId = eventData.fanGroupId;
    } else {
      // User is creating a personal event
      organizerType = 'user';
      organizerId = decoded.userId;
    }

    const event = await prisma.event.create({
      data: {
        ...eventData,
        organizerId,
        organizerType,
        date: new Date(eventData.date)
      },
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
        organizerId: true,
        organizerType: true,
        clubId: true,
        fanGroupId: true,
        gameId: true,
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
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update event
router.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('category').optional().isIn(['TRAVEL', 'SOCIAL', 'CHARITY', 'OFFICIAL', 'COMMUNITY', 'SPORTS', 'CULTURAL']),
  body('type').optional().isIn(['MATCH_DAY', 'MEETUP', 'CHARITY', 'TRAINING', 'TOURNAMENT', 'CELEBRATION', 'AWAY_TRIP']),
  body('date').optional().isISO8601(),
  body('time').optional().trim(),
  body('location').optional().trim(),
  body('latitude').optional().isFloat(),
  body('longitude').optional().isFloat(),
  body('maxParticipants').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'OPEN', 'FULL', 'CANCELLED', 'FINISHED']),
  body('isPublic').optional().isBoolean(),
  body('image').optional().isURL(),
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions based on organizer type
    let hasPermission = false;

    if (existingEvent.organizerType === 'user' && existingEvent.organizerId === decoded.userId) {
      hasPermission = true;
    } else if (existingEvent.organizerType === 'fan_group') {
      const membership = await prisma.fanGroupMembership.findFirst({
        where: {
          userId: decoded.userId,
          fanGroupId: existingEvent.fanGroupId,
          status: 'ACTIVE',
          role: { in: ['LEADER', 'FOUNDER'] }
        }
      });
      hasPermission = !!membership;
    } else if (existingEvent.organizerType === 'club') {
      // This would typically require admin role or club ownership
      // For now, we'll allow it if the user is an admin
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { role: true }
      });
      hasPermission = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this event'
      });
    }

    const updateData = { ...req.body };
    
    // Convert date to Date object if provided
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
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
        organizerId: true,
        organizerType: true,
        clubId: true,
        fanGroupId: true,
        gameId: true,
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
    });

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete event
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check permissions (same logic as update)
    let hasPermission = false;

    if (existingEvent.organizerType === 'user' && existingEvent.organizerId === decoded.userId) {
      hasPermission = true;
    } else if (existingEvent.organizerType === 'fan_group') {
      const membership = await prisma.fanGroupMembership.findFirst({
        where: {
          userId: decoded.userId,
          fanGroupId: existingEvent.fanGroupId,
          status: 'ACTIVE',
          role: { in: ['LEADER', 'FOUNDER'] }
        }
      });
      hasPermission = !!membership;
    } else if (existingEvent.organizerType === 'club') {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { role: true }
      });
      hasPermission = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    }

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this event'
      });
    }

    // Soft delete
    await prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register for event
router.post('/:id/register', async (req, res) => {
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

    // Check if event exists and is open for registration
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'PUBLISHED' && event.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'Event is not open for registration'
      });
    }

    // Check if event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventParticipant.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: id
        }
      }
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered for this event'
      });
    }

    // Create registration
    const registration = await prisma.eventParticipant.create({
      data: {
        userId: decoded.userId,
        eventId: id,
        status: 'registered'
      }
    });

    // Update participant count
    await prisma.event.update({
      where: { id },
      data: {
        currentParticipants: { increment: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Registered for event successfully',
      data: registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Unregister from event
router.delete('/:id/register', async (req, res) => {
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

    // Check if user is registered for this event
    const registration = await prisma.eventParticipant.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: id
        }
      }
    });

    if (!registration) {
      return res.status(400).json({
        success: false,
        message: 'User is not registered for this event'
      });
    }

    // Delete registration
    await prisma.eventParticipant.delete({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: id
        }
      }
    });

    // Update participant count
    await prisma.event.update({
      where: { id },
      data: {
        currentParticipants: { decrement: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Unregistered from event successfully'
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Confirm attendance
router.post('/:id/confirm-attendance', async (req, res) => {
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

    // Check if user is registered for this event
    const registration = await prisma.eventParticipant.findUnique({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: id
        }
      }
    });

    if (!registration) {
      return res.status(400).json({
        success: false,
        message: 'User is not registered for this event'
      });
    }

    // Update status to confirmed
    await prisma.eventParticipant.update({
      where: {
        userId_eventId: {
          userId: decoded.userId,
          eventId: id
        }
      },
      data: {
        status: 'confirmed',
        confirmedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Attendance confirmed successfully'
    });
  } catch (error) {
    console.error('Confirm attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get event participants
router.get('/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const where = { eventId: id };

    if (status) {
      where.status = status;
    }

    const [participants, total] = await Promise.all([
      prisma.eventParticipant.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { registeredAt: 'asc' },
        select: {
          status: true,
          registeredAt: true,
          confirmedAt: true,
          attendedAt: true,
          cancelledAt: true,
          cancelledReason: true,
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
      prisma.eventParticipant.count({ where })
    ]);

    res.json({
      success: true,
      data: participants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get event participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 