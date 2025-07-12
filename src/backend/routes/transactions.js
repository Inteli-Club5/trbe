const express = require('express');
const jwt = require('jsonwebtoken');
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

// Middleware to extract user ID from JWT token
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get user's transactions with filtering and pagination
router.get('/', authenticateUser, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {
      userId: req.userId
    };
    
    if (type) where.type = type;
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseInt(minAmount);
      if (maxAmount) where.amount.lte = parseInt(maxAmount);
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create transaction
router.post('/', [
  body('type').isIn(['EARNED', 'SPENT', 'TRANSFERRED', 'REFUNDED', 'BONUS', 'PENALTY']),
  body('amount').isInt({ min: 1 }),
  body('description').notEmpty().trim(),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      userId,
      type,
      amount,
      description,
      reference,
      relatedId,
      relatedType,
      metadata
    } = req.body;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate new balance
    const balanceBefore = user.tokens;
    let balanceAfter = balanceBefore;

    switch (type) {
      case 'EARNED':
      case 'BONUS':
      case 'REFUNDED':
        balanceAfter += amount;
        break;
      case 'SPENT':
      case 'PENALTY':
        if (balanceBefore < amount) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient tokens'
          });
        }
        balanceAfter -= amount;
        break;
      case 'TRANSFERRED':
        // For transfers, we need to handle both sender and receiver
        if (balanceBefore < amount) {
          return res.status(400).json({
            success: false,
            message: 'Insufficient tokens for transfer'
          });
        }
        balanceAfter -= amount;
        break;
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        status: 'COMPLETED',
        amount,
        balanceBefore,
        balanceAfter,
        description,
        reference,
        relatedId,
        relatedType,
        metadata,
        processedAt: new Date()
      }
    });

    // Update user's token balance
    await prisma.user.update({
      where: { id: userId },
      data: { tokens: balanceAfter }
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction statistics
router.get('/stats/summary', authenticateUser, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    const where = { userId: req.userId };
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [
      totalEarned,
      totalSpent,
      totalTransactions,
      recentTransactions
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: { in: ['EARNED', 'BONUS', 'REFUNDED'] } },
        _sum: { amount: true }
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: { in: ['SPENT', 'PENALTY'] } },
        _sum: { amount: true }
      }),
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const stats = {
      totalEarned: totalEarned._sum.amount || 0,
      totalSpent: totalSpent._sum.amount || 0,
      netTokens: (totalEarned._sum.amount || 0) - (totalSpent._sum.amount || 0),
      totalTransactions,
      recentTransactions
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transactions by type
router.get('/type/:type', authenticateUser, async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: req.userId,
          type
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.transaction.count({
        where: {
          userId: req.userId,
          type
        }
      })
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transactions by type:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get recent transactions
router.get('/recent/:limit?', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction history for a specific period
router.get('/history/period', authenticateUser, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFrom = new Date();
    switch (period) {
      case '7d':
        dateFrom.setDate(dateFrom.getDate() - 7);
        break;
      case '30d':
        dateFrom.setDate(dateFrom.getDate() - 30);
        break;
      case '90d':
        dateFrom.setDate(dateFrom.getDate() - 90);
        break;
      case '1y':
        dateFrom.setFullYear(dateFrom.getFullYear() - 1);
        break;
      default:
        dateFrom.setDate(dateFrom.getDate() - 30);
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        createdAt: {
          gte: dateFrom
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction analytics
router.get('/analytics', authenticateUser, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFrom = new Date();
    switch (period) {
      case '7d':
        dateFrom.setDate(dateFrom.getDate() - 7);
        break;
      case '30d':
        dateFrom.setDate(dateFrom.getDate() - 30);
        break;
      case '90d':
        dateFrom.setDate(dateFrom.getDate() - 90);
        break;
      case '1y':
        dateFrom.setFullYear(dateFrom.getFullYear() - 1);
        break;
      default:
        dateFrom.setDate(dateFrom.getDate() - 30);
    }

    const analytics = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId: req.userId,
        createdAt: {
          gte: dateFrom
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching transaction analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 