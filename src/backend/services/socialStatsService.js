const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SocialStatsService {
  // Create or update social stats for user
  async createOrUpdateSocialStats(userId, statsData) {
    try {
      const existingStats = await prisma.socialStats.findUnique({
        where: { userId }
      });

      if (existingStats) {
        const updatedStats = await prisma.socialStats.update({
          where: { userId },
          data: {
            followers: statsData.followers || existingStats.followers,
            following: statsData.following || existingStats.following,
            posts: statsData.posts || existingStats.posts,
            likes: statsData.likes || existingStats.likes,
            comments: statsData.comments || existingStats.comments,
            shares: statsData.shares || existingStats.shares,
            views: statsData.views || existingStats.views,
            engagementRate: statsData.engagementRate || existingStats.engagementRate,
            reach: statsData.reach || existingStats.reach,
            impressions: statsData.impressions || existingStats.impressions,
            lastUpdated: new Date()
          },
          include: {
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
        return updatedStats;
      } else {
        const newStats = await prisma.socialStats.create({
          data: {
            userId,
            followers: statsData.followers || 0,
            following: statsData.following || 0,
            posts: statsData.posts || 0,
            likes: statsData.likes || 0,
            comments: statsData.comments || 0,
            shares: statsData.shares || 0,
            views: statsData.views || 0,
            engagementRate: statsData.engagementRate || 0,
            reach: statsData.reach || 0,
            impressions: statsData.impressions || 0,
            lastUpdated: new Date()
          },
          include: {
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
        return newStats;
      }
    } catch (error) {
      throw new Error(`Failed to create or update social stats: ${error.message}`);
    }
  }

  // Get social stats by user ID
  async getSocialStatsByUserId(userId) {
    try {
      const stats = await prisma.socialStats.findUnique({
        where: { userId },
        include: {
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
      return stats;
    } catch (error) {
      throw new Error(`Failed to get social stats: ${error.message}`);
    }
  }

  // Update specific social stat
  async updateSocialStat(userId, statType, value) {
    try {
      const updateData = {
        [statType]: value,
        lastUpdated: new Date()
      };

      const stats = await prisma.socialStats.update({
        where: { userId },
        data: updateData,
        include: {
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
      return stats;
    } catch (error) {
      throw new Error(`Failed to update social stat: ${error.message}`);
    }
  }

  // Increment social stat
  async incrementSocialStat(userId, statType, increment = 1) {
    try {
      const stats = await prisma.socialStats.update({
        where: { userId },
        data: {
          [statType]: {
            increment
          },
          lastUpdated: new Date()
        },
        include: {
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
      return stats;
    } catch (error) {
      throw new Error(`Failed to increment social stat: ${error.message}`);
    }
  }

  // Decrement social stat
  async decrementSocialStat(userId, statType, decrement = 1) {
    try {
      const stats = await prisma.socialStats.update({
        where: { userId },
        data: {
          [statType]: {
            decrement
          },
          lastUpdated: new Date()
        },
        include: {
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
      return stats;
    } catch (error) {
      throw new Error(`Failed to decrement social stat: ${error.message}`);
    }
  }

  // Get top users by social stat
  async getTopUsersByStat(statType, limit = 10, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const orderBy = { [statType]: 'desc' };

      const [users, total] = await Promise.all([
        prisma.socialStats.findMany({
          where: {
            [statType]: { gt: 0 }
          },
          skip,
          take: limit,
          orderBy,
          include: {
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
        prisma.socialStats.count({
          where: {
            [statType]: { gt: 0 }
          }
        })
      ]);

      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get top users by stat: ${error.message}`);
    }
  }

  // Get social stats leaderboard
  async getSocialStatsLeaderboard(limit = 20) {
    try {
      const leaderboard = await prisma.socialStats.findMany({
        take: limit,
        orderBy: [
          { followers: 'desc' },
          { engagementRate: 'desc' },
          { posts: 'desc' }
        ],
        include: {
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
      });

      return leaderboard;
    } catch (error) {
      throw new Error(`Failed to get social stats leaderboard: ${error.message}`);
    }
  }

  // Get users with highest engagement rate
  async getTopEngagementUsers(limit = 10, minFollowers = 10) {
    try {
      const users = await prisma.socialStats.findMany({
        where: {
          followers: { gte: minFollowers },
          engagementRate: { gt: 0 }
        },
        take: limit,
        orderBy: { engagementRate: 'desc' },
        include: {
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
      });

      return users;
    } catch (error) {
      throw new Error(`Failed to get top engagement users: ${error.message}`);
    }
  }

  // Get social stats summary
  async getSocialStatsSummary() {
    try {
      const summary = await prisma.socialStats.aggregate({
        _count: {
          userId: true
        },
        _avg: {
          followers: true,
          following: true,
          posts: true,
          likes: true,
          comments: true,
          shares: true,
          views: true,
          engagementRate: true,
          reach: true,
          impressions: true
        },
        _sum: {
          followers: true,
          following: true,
          posts: true,
          likes: true,
          comments: true,
          shares: true,
          views: true,
          reach: true,
          impressions: true
        },
        _max: {
          followers: true,
          following: true,
          posts: true,
          likes: true,
          comments: true,
          shares: true,
          views: true,
          engagementRate: true,
          reach: true,
          impressions: true
        }
      });

      return {
        totalUsers: summary._count.userId,
        averages: {
          followers: Math.round(summary._avg.followers || 0),
          following: Math.round(summary._avg.following || 0),
          posts: Math.round(summary._avg.posts || 0),
          likes: Math.round(summary._avg.likes || 0),
          comments: Math.round(summary._avg.comments || 0),
          shares: Math.round(summary._avg.shares || 0),
          views: Math.round(summary._avg.views || 0),
          engagementRate: Math.round((summary._avg.engagementRate || 0) * 100) / 100,
          reach: Math.round(summary._avg.reach || 0),
          impressions: Math.round(summary._avg.impressions || 0)
        },
        totals: {
          followers: summary._sum.followers || 0,
          following: summary._sum.following || 0,
          posts: summary._sum.posts || 0,
          likes: summary._sum.likes || 0,
          comments: summary._sum.comments || 0,
          shares: summary._sum.shares || 0,
          views: summary._sum.views || 0,
          reach: summary._sum.reach || 0,
          impressions: summary._sum.impressions || 0
        },
        maximums: {
          followers: summary._max.followers || 0,
          following: summary._max.following || 0,
          posts: summary._max.posts || 0,
          likes: summary._max.likes || 0,
          comments: summary._max.comments || 0,
          shares: summary._max.shares || 0,
          views: summary._max.views || 0,
          engagementRate: summary._max.engagementRate || 0,
          reach: summary._max.reach || 0,
          impressions: summary._max.impressions || 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to get social stats summary: ${error.message}`);
    }
  }

  // Get social stats comparison between users
  async compareSocialStats(userIds) {
    try {
      const stats = await prisma.socialStats.findMany({
        where: {
          userId: { in: userIds }
        },
        include: {
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
        },
        orderBy: { followers: 'desc' }
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to compare social stats: ${error.message}`);
    }
  }

  // Get social stats growth over time (mock data for now)
  async getSocialStatsGrowth(userId, days = 30) {
    try {
      // This would typically query a time-series table
      // For now, return mock data
      const growth = [];
      const baseStats = await this.getSocialStatsByUserId(userId);
      
      if (!baseStats) {
        return growth;
      }

      const today = new Date();
      for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Mock growth data
        const growthFactor = 1 + (Math.random() * 0.1 - 0.05); // ±5% daily variation
        growth.push({
          date: date.toISOString().split('T')[0],
          followers: Math.round(baseStats.followers * growthFactor),
          following: Math.round(baseStats.following * growthFactor),
          posts: Math.round(baseStats.posts * growthFactor),
          likes: Math.round(baseStats.likes * growthFactor),
          comments: Math.round(baseStats.comments * growthFactor),
          shares: Math.round(baseStats.shares * growthFactor),
          views: Math.round(baseStats.views * growthFactor),
          engagementRate: Math.round((baseStats.engagementRate * growthFactor) * 100) / 100
        });
      }

      return growth;
    } catch (error) {
      throw new Error(`Failed to get social stats growth: ${error.message}`);
    }
  }

  // Calculate engagement rate
  async calculateEngagementRate(userId) {
    try {
      const stats = await this.getSocialStatsByUserId(userId);
      
      if (!stats || stats.followers === 0) {
        return 0;
      }

      const totalEngagement = stats.likes + stats.comments + stats.shares;
      const engagementRate = (totalEngagement / stats.followers) * 100;

      // Update the engagement rate
      await this.updateSocialStat(userId, 'engagementRate', Math.round(engagementRate * 100) / 100);

      return engagementRate;
    } catch (error) {
      throw new Error(`Failed to calculate engagement rate: ${error.message}`);
    }
  }

  // Get users by follower range
  async getUsersByFollowerRange(minFollowers, maxFollowers, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        followers: {
          gte: minFollowers,
          lte: maxFollowers
        }
      };

      const [users, total] = await Promise.all([
        prisma.socialStats.findMany({
          where,
          skip,
          take: limit,
          orderBy: { followers: 'desc' },
          include: {
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
        prisma.socialStats.count({ where })
      ]);

      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get users by follower range: ${error.message}`);
    }
  }

  // Get trending users (users with recent growth)
  async getTrendingUsers(limit = 10) {
    try {
      // This would typically analyze recent growth patterns
      // For now, return users with high engagement rates
      const users = await prisma.socialStats.findMany({
        where: {
          followers: { gte: 10 },
          engagementRate: { gt: 0 }
        },
        take: limit,
        orderBy: [
          { engagementRate: 'desc' },
          { followers: 'desc' }
        ],
        include: {
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
      });

      return users;
    } catch (error) {
      throw new Error(`Failed to get trending users: ${error.message}`);
    }
  }

  // Delete social stats for user
  async deleteSocialStats(userId) {
    try {
      const stats = await prisma.socialStats.delete({
        where: { userId }
      });
      return stats;
    } catch (error) {
      throw new Error(`Failed to delete social stats: ${error.message}`);
    }
  }

  // Bulk update social stats
  async bulkUpdateSocialStats(updates) {
    try {
      const results = [];
      
      for (const update of updates) {
        try {
          const result = await this.createOrUpdateSocialStats(update.userId, update.stats);
          results.push({ success: true, userId: update.userId, data: result });
        } catch (error) {
          results.push({ success: false, userId: update.userId, error: error.message });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to bulk update social stats: ${error.message}`);
    }
  }

  // Get social stats analytics
  async getSocialStatsAnalytics() {
    try {
      const analytics = {
        totalUsers: await prisma.socialStats.count(),
        activeUsers: await prisma.socialStats.count({
          where: {
            lastUpdated: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          }
        }),
        topPerformers: await this.getTopUsersByStat('followers', 5),
        averageStats: await this.getSocialStatsSummary()
      };

      return analytics;
    } catch (error) {
      throw new Error(`Failed to get social stats analytics: ${error.message}`);
    }
  }
}

module.exports = new SocialStatsService(); 