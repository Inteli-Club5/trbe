const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { authenticateUser, optionalAuth } = require('../middleware/auth');

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

// Get all tasks
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      difficulty, 
      type, 
      search, 
      isActive,
      clubId,
      fanGroupId
    } = req.query;
    const skip = (page - 1) * limit;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (type) {
      where.type = type;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (clubId) {
      where.clubId = clubId;
    }

    if (fanGroupId) {
      where.fanGroupId = fanGroupId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          difficulty: true,
          type: true,
          maxProgress: true,
          timeLimit: true,
          deadline: true,
          tokens: true,
          experience: true,
          reputationPoints: true,
          clubId: true,
          fanGroupId: true,
          userLevel: true,
          userReputation: true,
          isActive: true,
          isRepeatable: true,
          maxCompletions: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          _count: {
            select: {
              userTasks: true
            }
          }
        }
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        tasks: tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's tasks
router.get('/user/tasks', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, type } = req.query;
    const skip = (page - 1) * limit;

    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    if (category) {
      where.task = { category };
    }

    if (type) {
      where.task = { ...where.task, type };
    }

    const [userTasks, total] = await Promise.all([
      prisma.userTask.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          progress: true,
          completedAt: true,
          failedAt: true,
          failedReason: true,
          createdAt: true,
          updatedAt: true,
          task: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              difficulty: true,
              type: true,
              maxProgress: true,
              timeLimit: true,
              deadline: true,
              tokens: true,
              experience: true,
              reputationPoints: true,
              isActive: true,
              isRepeatable: true,
              maxCompletions: true,
              expiresAt: true
            }
          }
        }
      }),
      prisma.userTask.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        userTasks: userTasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's available tasks
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

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        level: true,
        reputationScore: true,
        clubFollow: {
          select: { clubId: true }
        },
        fanGroupMembership: {
          select: { fanGroupId: true }
        }
      }
    });

    // Find available tasks
    const availableTasks = await prisma.task.findMany({
      where: {
        isActive: true,
        OR: [
          { userLevel: null },
          { userLevel: { lte: user.level } }
        ],
        OR: [
          { userReputation: null },
          { userReputation: { lte: user.reputationScore } }
        ],
        OR: [
          { clubId: null },
          { clubId: user.clubFollow?.clubId }
        ],
        OR: [
          { fanGroupId: null },
          { fanGroupId: user.fanGroupMembership?.fanGroupId }
        ],
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        type: true,
        maxProgress: true,
        timeLimit: true,
        deadline: true,
        tokens: true,
        experience: true,
        reputationPoints: true,
        isActive: true,
        isRepeatable: true,
        maxCompletions: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: availableTasks
    });
  } catch (error) {
    console.error('Get available tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's completed tasks
router.get('/user/completed', async (req, res) => {
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

    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [completedTasks, total] = await Promise.all([
      prisma.userTask.findMany({
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { completedAt: 'desc' },
        select: {
          id: true,
          progress: true,
          completedAt: true,
          createdAt: true,
          task: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              difficulty: true,
              type: true,
              tokens: true,
              experience: true,
              reputationPoints: true
            }
          }
        }
      }),
      prisma.userTask.count({
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        }
      })
    ]);

    res.json({
      success: true,
      data: completedTasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get completed tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's task statistics
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
      totalTasks,
      completedTasks,
      inProgressTasks,
      failedTasks,
      totalTokensEarned,
      totalExperienceEarned,
      totalReputationEarned,
      tasksByCategory,
      tasksByDifficulty
    ] = await Promise.all([
      prisma.userTask.count({
        where: { userId: decoded.userId }
      }),
      prisma.userTask.count({
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        }
      }),
      prisma.userTask.count({
        where: {
          userId: decoded.userId,
          status: 'IN_PROGRESS'
        }
      }),
      prisma.userTask.count({
        where: {
          userId: decoded.userId,
          status: 'FAILED'
        }
      }),
      prisma.userTask.aggregate({
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        },
        _sum: {
          task: {
            select: {
              tokens: true
            }
          }
        }
      }),
      prisma.userTask.aggregate({
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        },
        _sum: {
          task: {
            select: {
              experience: true
            }
          }
        }
      }),
      prisma.userTask.aggregate({
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        },
        _sum: {
          task: {
            select: {
              reputationPoints: true
            }
          }
        }
      }),
      prisma.userTask.groupBy({
        by: ['task'],
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        },
        _count: true
      }),
      prisma.userTask.groupBy({
        by: ['task'],
        where: {
          userId: decoded.userId,
          status: 'COMPLETED'
        },
        _count: true
      })
    ]);

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        failedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        totalTokensEarned: totalTokensEarned._sum.task?.tokens || 0,
        totalExperienceEarned: totalExperienceEarned._sum.task?.experience || 0,
        totalReputationEarned: totalReputationEarned._sum.task?.reputationPoints || 0
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        type: true,
        maxProgress: true,
        timeLimit: true,
        deadline: true,
        tokens: true,
        experience: true,
        reputationPoints: true,
        clubId: true,
        fanGroupId: true,
        userLevel: true,
        userReputation: true,
        isActive: true,
        isRepeatable: true,
        maxCompletions: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        userTasks: {
          select: {
            status: true,
            progress: true,
            completedAt: true,
            failedAt: true,
            failedReason: true,
            createdAt: true,
            updatedAt: true,
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
            userTasks: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new task (Admin only)
router.post('/', [
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('category').isIn(['PRESENCE', 'SOCIAL', 'PURCHASE', 'ENGAGEMENT', 'COMMUNITY', 'SPECIAL']),
  body('difficulty').isIn(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  body('type').isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL', 'ONE_TIME', 'RECURRING']),
  body('maxProgress').optional().isInt({ min: 1 }),
  body('timeLimit').optional().isInt({ min: 1 }),
  body('deadline').optional().isISO8601(),
  body('tokens').optional().isInt({ min: 0 }),
  body('experience').optional().isInt({ min: 0 }),
  body('reputationPoints').optional().isInt({ min: 0 }),
  body('clubId').optional().isString(),
  body('fanGroupId').optional().isString(),
  body('userLevel').optional().isInt({ min: 1 }),
  body('userReputation').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isRepeatable').optional().isBoolean(),
  body('maxCompletions').optional().isInt({ min: 1 }),
  body('expiresAt').optional().isISO8601(),
  handleValidationErrors
], async (req, res) => {
  try {
    const taskData = req.body;

    // Convert dates
    if (taskData.deadline) {
      taskData.deadline = new Date(taskData.deadline);
    }
    if (taskData.expiresAt) {
      taskData.expiresAt = new Date(taskData.expiresAt);
    }

    const task = await prisma.task.create({
      data: taskData,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        type: true,
        maxProgress: true,
        timeLimit: true,
        deadline: true,
        tokens: true,
        experience: true,
        reputationPoints: true,
        clubId: true,
        fanGroupId: true,
        userLevel: true,
        userReputation: true,
        isActive: true,
        isRepeatable: true,
        maxCompletions: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update task (Admin only)
router.put('/:id', [
  body('title').optional().notEmpty().trim(),
  body('description').optional().trim(),
  body('category').optional().isIn(['PRESENCE', 'SOCIAL', 'PURCHASE', 'ENGAGEMENT', 'COMMUNITY', 'SPECIAL']),
  body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  body('type').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL', 'ONE_TIME', 'RECURRING']),
  body('maxProgress').optional().isInt({ min: 1 }),
  body('timeLimit').optional().isInt({ min: 1 }),
  body('deadline').optional().isISO8601(),
  body('tokens').optional().isInt({ min: 0 }),
  body('experience').optional().isInt({ min: 0 }),
  body('reputationPoints').optional().isInt({ min: 0 }),
  body('clubId').optional().isString(),
  body('fanGroupId').optional().isString(),
  body('userLevel').optional().isInt({ min: 1 }),
  body('userReputation').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isRepeatable').optional().isBoolean(),
  body('maxCompletions').optional().isInt({ min: 1 }),
  body('expiresAt').optional().isISO8601(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert dates
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    if (updateData.expiresAt) {
      updateData.expiresAt = new Date(updateData.expiresAt);
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        type: true,
        maxProgress: true,
        timeLimit: true,
        deadline: true,
        tokens: true,
        experience: true,
        reputationPoints: true,
        clubId: true,
        fanGroupId: true,
        userLevel: true,
        userReputation: true,
        isActive: true,
        isRepeatable: true,
        maxCompletions: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true
      }
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete task (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start task
router.post('/:id/start', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists and is active
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!task.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Task is not active'
      });
    }

    // Check if user already has this task
    const existingUserTask = await prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: req.user.id,
          taskId: id
        }
      }
    });

    if (existingUserTask) {
      return res.status(400).json({
        success: false,
        message: 'User already has this task'
      });
    }

    // Create user task
    const userTask = await prisma.userTask.create({
      data: {
        userId: req.user.id,
        taskId: id,
        status: 'IN_PROGRESS',
        progress: 0
      },
      select: {
        id: true,
        status: true,
        progress: true,
        createdAt: true,
        updatedAt: true,
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            difficulty: true,
            type: true,
            maxProgress: true,
            timeLimit: true,
            deadline: true,
            tokens: true,
            experience: true,
            reputationPoints: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Task started successfully',
      data: userTask
    });
  } catch (error) {
    console.error('Start task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update task progress
router.put('/:id/progress', [
  body('progress').isInt({ min: 0 }),
  handleValidationErrors
], authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    // Get user task
    const userTask = await prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId: req.user.id,
          taskId: id
        }
      },
      include: {
        task: true
      }
    });

    if (!userTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found for user'
      });
    }

    if (userTask.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Task is already completed'
      });
    }

    if (userTask.status === 'FAILED') {
      return res.status(400).json({
        success: false,
        message: 'Task has failed'
      });
    }

    // Check if progress exceeds max progress
    if (progress > userTask.task.maxProgress) {
      return res.status(400).json({
        success: false,
        message: 'Progress cannot exceed maximum progress'
      });
    }

    let status = userTask.status;
    let completedAt = null;
    let failedAt = null;
    let failedReason = null;

    // Check if task is completed
    if (progress >= userTask.task.maxProgress) {
      status = 'COMPLETED';
      completedAt = new Date();

      // Award rewards
      if (userTask.task.tokens > 0) {
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            tokens: { increment: userTask.task.tokens }
          }
        });
      }

      if (userTask.task.experience > 0) {
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            experience: { increment: userTask.task.experience }
          }
        });
      }

      if (userTask.task.reputationPoints > 0) {
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            reputationScore: { increment: userTask.task.reputationPoints }
          }
        });
      }

      // Update user stats
      await prisma.user.update({
        where: { id: req.user.id },
        data: {
          totalTasks: { increment: 1 }
        }
      });
    }

    // Update user task
    const updatedUserTask = await prisma.userTask.update({
      where: {
        userId_taskId: {
          userId: req.user.id,
          taskId: id
        }
      },
      data: {
        progress,
        status,
        completedAt,
        failedAt,
        failedReason
      },
      select: {
        id: true,
        status: true,
        progress: true,
        completedAt: true,
        failedAt: true,
        failedReason: true,
        createdAt: true,
        updatedAt: true,
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            difficulty: true,
            type: true,
            maxProgress: true,
            tokens: true,
            experience: true,
            reputationPoints: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Task progress updated successfully',
      data: updatedUserTask
    });
  } catch (error) {
    console.error('Update task progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 