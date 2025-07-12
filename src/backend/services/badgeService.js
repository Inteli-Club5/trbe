const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BadgeService {
  // Create a new badge
  async createBadge(badgeData) {
    try {
      const badge = await prisma.badge.create({
        data: {
          name: badgeData.name,
          description: badgeData.description,
          category: badgeData.category,
          rarity: badgeData.rarity,
          icon: badgeData.icon,
          iconComponent: badgeData.iconComponent,
          requirement: badgeData.requirement,
          maxProgress: badgeData.maxProgress || 1,
          tokens: badgeData.tokens || 0,
          experience: badgeData.experience || 0,
          isActive: badgeData.isActive !== false,
          isHidden: badgeData.isHidden || false,
        },
        include: {
          _count: {
            select: { userBadges: true }
          }
        }
      });
      return badge;
    } catch (error) {
      throw new Error(`Failed to create badge: ${error.message}`);
    }
  }

  // Get badge by ID
  async getBadgeById(id) {
    try {
      const badge = await prisma.badge.findUnique({
        where: { id },
        include: {
          userBadges: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                  level: true
                }
              }
            },
            orderBy: { earnedAt: 'desc' }
          },
          _count: {
            select: { userBadges: true }
          }
        }
      });
      return badge;
    } catch (error) {
      throw new Error(`Failed to get badge: ${error.message}`);
    }
  }

  // Get badge by name
  async getBadgeByName(name) {
    try {
      const badge = await prisma.badge.findUnique({
        where: { name },
        include: {
          _count: {
            select: { userBadges: true }
          }
        }
      });
      return badge;
    } catch (error) {
      throw new Error(`Failed to get badge by name: ${error.message}`);
    }
  }

  // Update badge
  async updateBadge(id, updateData) {
    try {
      const badge = await prisma.badge.update({
        where: { id },
        data: {
          name: updateData.name,
          description: updateData.description,
          category: updateData.category,
          rarity: updateData.rarity,
          icon: updateData.icon,
          iconComponent: updateData.iconComponent,
          requirement: updateData.requirement,
          maxProgress: updateData.maxProgress,
          tokens: updateData.tokens,
          experience: updateData.experience,
          isActive: updateData.isActive,
          isHidden: updateData.isHidden,
        },
        include: {
          _count: {
            select: { userBadges: true }
          }
        }
      });
      return badge;
    } catch (error) {
      throw new Error(`Failed to update badge: ${error.message}`);
    }
  }

  // Delete badge
  async deleteBadge(id) {
    try {
      const badge = await prisma.badge.update({
        where: { id },
        data: { isActive: false }
      });
      return badge;
    } catch (error) {
      throw new Error(`Failed to delete badge: ${error.message}`);
    }
  }

  // Get all badges with pagination and filters
  async getBadges(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        isActive: true,
        ...filters
      };

      const [badges, total] = await Promise.all([
        prisma.badge.findMany({
          where,
          skip,
          take: limit,
          orderBy: { rarity: 'asc' },
          include: {
            _count: {
              select: { userBadges: true }
            }
          }
        }),
        prisma.badge.count({ where })
      ]);

      return {
        badges,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get badges: ${error.message}`);
    }
  }

  // Get badges by category
  async getBadgesByCategory(category, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        category,
        isActive: true
      };

      const [badges, total] = await Promise.all([
        prisma.badge.findMany({
          where,
          skip,
          take: limit,
          orderBy: { rarity: 'asc' },
          include: {
            _count: {
              select: { userBadges: true }
            }
          }
        }),
        prisma.badge.count({ where })
      ]);

      return {
        badges,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get badges by category: ${error.message}`);
    }
  }

  // Get badges by rarity
  async getBadgesByRarity(rarity, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        rarity,
        isActive: true
      };

      const [badges, total] = await Promise.all([
        prisma.badge.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { userBadges: true }
            }
          }
        }),
        prisma.badge.count({ where })
      ]);

      return {
        badges,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get badges by rarity: ${error.message}`);
    }
  }

  // Award badge to user
  async awardBadgeToUser(userId, badgeId, progress = 1) {
    try {
      // Check if user already has this badge
      const existingBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId
          }
        }
      });

      if (existingBadge) {
        // Update progress if needed
        if (progress > existingBadge.progress) {
          const updatedBadge = await prisma.userBadge.update({
            where: {
              userId_badgeId: {
                userId,
                badgeId
              }
            },
            data: { progress },
            include: {
              badge: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  tokens: true
                }
              }
            }
          });

          // Award tokens and experience if badge is completed
          if (progress >= updatedBadge.badge.maxProgress) {
            await this.awardBadgeRewards(userId, updatedBadge.badge);
          }

          return updatedBadge;
        }
        return existingBadge;
      }

      // Award new badge
      const userBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId,
          progress,
          earnedAt: new Date()
        },
        include: {
          badge: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              tokens: true
            }
          }
        }
      });

      // Award tokens and experience if badge is completed
      if (progress >= userBadge.badge.maxProgress) {
        await this.awardBadgeRewards(userId, userBadge.badge);
      }

      return userBadge;
    } catch (error) {
      throw new Error(`Failed to award badge: ${error.message}`);
    }
  }

  // Award badge rewards (tokens and experience)
  async awardBadgeRewards(userId, badge) {
    try {
      const userService = require('./userService');

      // Award tokens
      if (badge.tokens > 0) {
        await userService.updateTokens(userId, badge.tokens, 'EARNED');
      }

      // Award experience
      if (badge.experience > 0) {
        await userService.updateExperience(userId, badge.experience);
      }

      // Update user's total badges count
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalBadges: {
            increment: 1
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to award badge rewards: ${error.message}`);
    }
  }

  // Get user's badges
  async getUserBadges(userId, page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        ...filters
      };

      const [userBadges, total] = await Promise.all([
        prisma.userBadge.findMany({
          where,
          skip,
          take: limit,
          orderBy: { earnedAt: 'desc' },
          include: {
            badge: true
          }
        }),
        prisma.userBadge.count({ where })
      ]);

      return {
        userBadges,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get user badges: ${error.message}`);
    }
  }

  // Get user's earned badges
  async getUserEarnedBadges(userId) {
    try {
      const userBadges = await prisma.userBadge.findMany({
        where: { userId },
        include: {
          badge: true
        },
        orderBy: { earnedAt: 'desc' }
      });

      return userBadges;
    } catch (error) {
      throw new Error(`Failed to get user earned badges: ${error.message}`);
    }
  }

  // Get user's available badges (not yet earned)
  async getUserAvailableBadges(userId) {
    try {
      const earnedBadgeIds = await prisma.userBadge.findMany({
        where: { userId },
        select: { badgeId: true }
      });

      const earnedIds = earnedBadgeIds.map(ub => ub.badgeId);

      const availableBadges = await prisma.badge.findMany({
        where: {
          isActive: true,
          isHidden: false,
          id: { notIn: earnedIds }
        },
        orderBy: { rarity: 'asc' }
      });

      return availableBadges;
    } catch (error) {
      throw new Error(`Failed to get user available badges: ${error.message}`);
    }
  }

  // Check if user has badge
  async userHasBadge(userId, badgeId) {
    try {
      const userBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId
          }
        }
      });

      return !!userBadge;
    } catch (error) {
      throw new Error(`Failed to check if user has badge: ${error.message}`);
    }
  }

  // Get badge progress for user
  async getBadgeProgress(userId, badgeId) {
    try {
      const userBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId
          }
        },
        include: {
          badge: true
        }
      });

      if (!userBadge) {
        return {
          progress: 0,
          maxProgress: 1,
          isCompleted: false,
          percentage: 0
        };
      }

      const percentage = Math.min(100, (userBadge.progress / userBadge.badge.maxProgress) * 100);

      return {
        progress: userBadge.progress,
        maxProgress: userBadge.badge.maxProgress,
        isCompleted: userBadge.progress >= userBadge.badge.maxProgress,
        percentage: Math.round(percentage),
        earnedAt: userBadge.earnedAt
      };
    } catch (error) {
      throw new Error(`Failed to get badge progress: ${error.message}`);
    }
  }

  // Get user's badge statistics
  async getUserBadgeStats(userId) {
    try {
      const userBadges = await prisma.userBadge.findMany({
        where: { userId },
        include: {
          badge: true
        }
      });

      const stats = {
        totalBadges: userBadges.length,
        totalTokens: userBadges.reduce((sum, ub) => sum + ub.badge.tokens, 0),
        totalExperience: userBadges.reduce((sum, ub) => sum + ub.badge.experience, 0),
        byCategory: {},
        byRarity: {}
      };

      // Group by category
      userBadges.forEach(ub => {
        const category = ub.badge.category;
        if (!stats.byCategory[category]) {
          stats.byCategory[category] = 0;
        }
        stats.byCategory[category]++;
      });

      // Group by rarity
      userBadges.forEach(ub => {
        const rarity = ub.badge.rarity;
        if (!stats.byRarity[rarity]) {
          stats.byRarity[rarity] = 0;
        }
        stats.byRarity[rarity]++;
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to get user badge stats: ${error.message}`);
    }
  }

  // Search badges
  async searchBadges(query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { requirement: { contains: query, mode: 'insensitive' } }
        ]
      };

      const [badges, total] = await Promise.all([
        prisma.badge.findMany({
          where,
          skip,
          take: limit,
          orderBy: { rarity: 'asc' },
          include: {
            _count: {
              select: { userBadges: true }
            }
          }
        }),
        prisma.badge.count({ where })
      ]);

      return {
        badges,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to search badges: ${error.message}`);
    }
  }

  // Get most popular badges
  async getMostPopularBadges(limit = 10) {
    try {
      const badges = await prisma.badge.findMany({
        where: { isActive: true },
        take: limit,
        orderBy: {
          userBadges: {
            _count: 'desc'
          }
        },
        include: {
          _count: {
            select: { userBadges: true }
          }
        }
      });

      return badges;
    } catch (error) {
      throw new Error(`Failed to get most popular badges: ${error.message}`);
    }
  }

  // Get rarest badges
  async getRarestBadges(limit = 10) {
    try {
      const badges = await prisma.badge.findMany({
        where: { isActive: true },
        take: limit,
        orderBy: [
          { rarity: 'desc' },
          {
            userBadges: {
              _count: 'asc'
            }
          }
        ],
        include: {
          _count: {
            select: { userBadges: true }
          }
        }
      });

      return badges;
    } catch (error) {
      throw new Error(`Failed to get rarest badges: ${error.message}`);
    }
  }
}

module.exports = new BadgeService(); 