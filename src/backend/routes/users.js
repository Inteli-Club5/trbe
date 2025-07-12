const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('firstName').isLength({ min: 1, max: 50 }),
  body('lastName').isLength({ min: 1, max: 50 }),
  body('displayName').isLength({ min: 1, max: 100 }),
  body('phoneNumber').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
];

const validateUserUpdate = [
  body('firstName').optional().isLength({ min: 1, max: 50 }),
  body('lastName').optional().isLength({ min: 1, max: 50 }),
  body('displayName').optional().isLength({ min: 1, max: 100 }),
  body('phoneNumber').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// GET /api/users - Get all users with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, role, level } = req.query;
    
    const filters = {};
    if (search) {
      filters.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) filters.status = status;
    if (role) filters.role = role;
    if (level) filters.level = parseInt(level);

    const result = await userService.getUsers(parseInt(page), parseInt(limit), filters);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/', validateUser, handleValidationErrors, async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', validateUserUpdate, handleValidationErrors, async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// GET /api/users/:id/stats - Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await userService.getUserStats(req.params.id);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats',
      error: error.message
    });
  }
});

// GET /api/users/:id/ranking - Get user ranking
router.get('/:id/ranking', async (req, res) => {
  try {
    const ranking = await userService.getUserRanking(req.params.id);
    
    res.json({
      success: true,
      data: ranking
    });
  } catch (error) {
    console.error('Error getting user ranking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user ranking',
      error: error.message
    });
  }
});

// GET /api/users/:id/activity - Get user's recent activity
router.get('/:id/activity', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const activity = await userService.getRecentActivity(req.params.id, parseInt(limit));
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error getting user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user activity',
      error: error.message
    });
  }
});

// POST /api/users/:id/follow-club - Follow a club
router.post('/:id/follow-club', [
  body('clubId').isString().notEmpty()
], handleValidationErrors, async (req, res) => {
  try {
    const follow = await userService.followClub(req.params.id, req.body.clubId);
    
    res.json({
      success: true,
      message: 'Club followed successfully',
      data: follow
    });
  } catch (error) {
    console.error('Error following club:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to follow club',
      error: error.message
    });
  }
});

// DELETE /api/users/:id/follow-club - Unfollow club
router.delete('/:id/follow-club', async (req, res) => {
  try {
    const follow = await userService.unfollowClub(req.params.id);
    
    res.json({
      success: true,
      message: 'Club unfollowed successfully',
      data: follow
    });
  } catch (error) {
    console.error('Error unfollowing club:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unfollow club',
      error: error.message
    });
  }
});

// POST /api/users/:id/join-fan-group - Join fan group
router.post('/:id/join-fan-group', [
  body('fanGroupId').isString().notEmpty()
], handleValidationErrors, async (req, res) => {
  try {
    const membership = await userService.joinFanGroup(req.params.id, req.body.fanGroupId);
    
    res.json({
      success: true,
      message: 'Joined fan group successfully',
      data: membership
    });
  } catch (error) {
    console.error('Error joining fan group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join fan group',
      error: error.message
    });
  }
});

// DELETE /api/users/:id/leave-fan-group - Leave fan group
router.delete('/:id/leave-fan-group', async (req, res) => {
  try {
    const membership = await userService.leaveFanGroup(req.params.id);
    
    res.json({
      success: true,
      message: 'Left fan group successfully',
      data: membership
    });
  } catch (error) {
    console.error('Error leaving fan group:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave fan group',
      error: error.message
    });
  }
});

// POST /api/users/:id/tokens - Update user tokens
router.post('/:id/tokens', [
  body('amount').isNumeric(),
  body('type').optional().isIn(['EARNED', 'SPENT', 'PURCHASED', 'REFUNDED'])
], handleValidationErrors, async (req, res) => {
  try {
    const user = await userService.updateTokens(
      req.params.id, 
      parseFloat(req.body.amount), 
      req.body.type || 'EARNED'
    );
    
    res.json({
      success: true,
      message: 'Tokens updated successfully',
      data: { tokens: user.tokens }
    });
  } catch (error) {
    console.error('Error updating tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tokens',
      error: error.message
    });
  }
});

// POST /api/users/:id/experience - Update user experience
router.post('/:id/experience', [
  body('experience').isNumeric()
], handleValidationErrors, async (req, res) => {
  try {
    const user = await userService.updateExperience(req.params.id, parseInt(req.body.experience));
    
    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: { 
        experience: user.experience, 
        level: user.level 
      }
    });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error.message
    });
  }
});

// POST /api/users/:id/reputation - Update user reputation
router.post('/:id/reputation', [
  body('points').isNumeric(),
  body('action').optional().isIn(['POSITIVE', 'NEGATIVE']),
  body('category').optional().isIn(['ENGAGEMENT', 'ACHIEVEMENT', 'SOCIAL', 'MODERATION']),
  body('reason').optional().isString()
], handleValidationErrors, async (req, res) => {
  try {
    const user = await userService.updateReputation(
      req.params.id,
      parseInt(req.body.points),
      req.body.action || 'POSITIVE',
      req.body.category || 'ENGAGEMENT',
      req.body.reason
    );
    
    res.json({
      success: true,
      message: 'Reputation updated successfully',
      data: { reputationScore: user.reputationScore }
    });
  } catch (error) {
    console.error('Error updating reputation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reputation',
      error: error.message
    });
  }
});

// GET /api/users/search/:query - Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await userService.getUsers(parseInt(page), parseInt(limit), {
      OR: [
        { username: { contains: req.params.query, mode: 'insensitive' } },
        { displayName: { contains: req.params.query, mode: 'insensitive' } },
        { email: { contains: req.params.query, mode: 'insensitive' } }
      ]
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
});

// GET /api/users/leaderboard/tokens - Get token leaderboard
router.get('/leaderboard/tokens', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await userService.getUsers(parseInt(page), parseInt(limit), {
      deletedAt: null
    });
    
    // Sort by tokens in descending order
    result.users.sort((a, b) => b.tokens - a.tokens);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting token leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get token leaderboard',
      error: error.message
    });
  }
});

// GET /api/users/leaderboard/reputation - Get reputation leaderboard
router.get('/leaderboard/reputation', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await userService.getUsers(parseInt(page), parseInt(limit), {
      deletedAt: null
    });
    
    // Sort by reputation score in descending order
    result.users.sort((a, b) => b.reputationScore - a.reputationScore);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting reputation leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reputation leaderboard',
      error: error.message
    });
  }
});

module.exports = router; 