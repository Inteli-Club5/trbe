const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserService {
  // Create a new user
  async createUser(userData) {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          password: userData.password, // Lembre-se de hashear!
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          avatar: userData.avatar,
          bio: userData.bio,
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          gender: userData.gender,
          phoneNumber: userData.phoneNumber,
          location: userData.location,
          timezone: userData.timezone,
          language: userData.language || 'en',
          socialLinks: userData.socialLinks,
          privacySettings: userData.privacySettings,
          walletAddress: userData.walletAddress,
          oauthProvider: userData.oauthProvider,
          oauthId: userData.oauthId,
          acceptTerms: userData.acceptTerms,
          acceptPrivacy: userData.acceptPrivacy,
          acceptDataUsage: userData.acceptDataUsage,
        },
        include: {
          clubFollow: {
            include: {
              club: true
            }
          },
          fanGroupMembership: {
            include: {
              fanGroup: true
            }
          },
          socialStats: true
        }
      });
  
      // Cria a relação com o clube favorito
      if (userData.clubId) {
        await prisma.clubFollow.create({
          data: {
            userId: user.id,
            clubId: userData.clubId
          }
        });
      }
  
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  

  // Get user by ID
  async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          clubFollow: {
            include: {
              club: true
            }
          },
          fanGroupMembership: {
            include: {
              fanGroup: true
            }
          },
          socialStats: true,
          _count: {
            select: {
              checkIns: true,
              tasks: true,
              badges: true,
              events: true,
              notifications: true,
              transactions: true,
              purchases: true,
              achievements: true
            }
          }
        }
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          clubFollow: {
            include: {
              club: true
            }
          },
          fanGroupMembership: {
            include: {
              fanGroup: true
            }
          }
        }
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to get user by email: ${error.message}`);
    }
  }

  // Get user by username
  async getUserByUsername(username) {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          clubFollow: {
            include: {
              club: true
            }
          },
          fanGroupMembership: {
            include: {
              fanGroup: true
            }
          }
        }
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to get user by username: ${error.message}`);
    }
  }

  // Update user
  async updateUser(id, updateData) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          displayName: updateData.displayName,
          avatar: updateData.avatar,
          bio: updateData.bio,
          dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined,
          gender: updateData.gender,
          phoneNumber: updateData.phoneNumber,
          location: updateData.location,
          timezone: updateData.timezone,
          language: updateData.language,
          socialLinks: updateData.socialLinks,
          privacySettings: updateData.privacySettings,
          pushNotifications: updateData.pushNotifications,
          emailNotifications: updateData.emailNotifications,
          darkMode: updateData.darkMode,
          autoCheckIn: updateData.autoCheckIn,
        },
        include: {
          clubFollow: {
            include: {
              club: true
            }
          },
          fanGroupMembership: {
            include: {
              fanGroup: true
            }
          },
          socialStats: true
        }
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user (soft delete)
  async deleteUser(id) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: 'BANNED'
        }
      });
      return user;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Get all users with pagination
  async getUsers(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        deletedAt: null,
        ...filters
      };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            clubFollow: {
              include: {
                club: true
              }
            },
            fanGroupMembership: {
              include: {
                fanGroup: true
              }
            },
            _count: {
              select: {
                checkIns: true,
                tasks: true,
                badges: true,
                events: true
              }
            }
          }
        }),
        prisma.user.count({ where })
      ]);

      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Update user tokens
  async updateTokens(id, amount, type = 'EARNED') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { tokens: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newBalance = user.tokens + amount;
      if (newBalance < 0) {
        throw new Error('Insufficient tokens');
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { tokens: newBalance }
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: id,
          type: type,
          status: 'COMPLETED',
          amount: amount,
          balanceBefore: user.tokens,
          balanceAfter: newBalance,
          description: `${type.toLowerCase()} tokens`,
          processedAt: new Date()
        }
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update tokens: ${error.message}`);
    }
  }

  // Update user experience and level
  async updateExperience(id, experience) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { experience: true, level: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newExperience = user.experience + experience;
      const newLevel = Math.floor(newExperience / 1000) + 1; // 1000 XP per level

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          experience: newExperience,
          level: newLevel
        }
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update experience: ${error.message}`);
    }
  }

  // Update user reputation
  async updateReputation(id, points, action = 'POSITIVE', category = 'ENGAGEMENT', reason = null) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { reputationScore: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newReputation = Math.max(0, Math.min(1000, user.reputationScore + points));

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { reputationScore: newReputation }
      });

      // Create reputation history record
      await prisma.reputationHistory.create({
        data: {
          userId: id,
          action: action,
          category: category,
          points: points,
          reason: reason,
          description: `${action.toLowerCase()} reputation points for ${category.toLowerCase()}`
        }
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update reputation: ${error.message}`);
    }
  }

  // Get user statistics
  async getUserStats(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          checkIns: {
            orderBy: { checkedInAt: 'desc' },
            take: 10
          },
          tasks: {
            where: { status: 'COMPLETED' },
            include: { task: true },
            orderBy: { completedAt: 'desc' },
            take: 10
          },
          badges: {
            include: { badge: true },
            orderBy: { earnedAt: 'desc' },
            take: 10
          },
          events: {
            include: { event: true },
            orderBy: { registeredAt: 'desc' },
            take: 10
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          socialStats: true,
          _count: {
            select: {
              checkIns: true,
              tasks: true,
              badges: true,
              events: true,
              transactions: true,
              purchases: true,
              achievements: true
            }
          }
        }
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }

  // Get user ranking
  async getUserRanking(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { tokens: true, reputationScore: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get ranking by tokens
      const tokenRanking = await prisma.user.count({
        where: {
          tokens: { gt: user.tokens },
          deletedAt: null
        }
      });

      // Get ranking by reputation
      const reputationRanking = await prisma.user.count({
        where: {
          reputationScore: { gt: user.reputationScore },
          deletedAt: null
        }
      });

      return {
        tokenRanking: tokenRanking + 1,
        reputationRanking: reputationRanking + 1
      };
    } catch (error) {
      throw new Error(`Failed to get user ranking: ${error.message}`);
    }
  }

  // Follow a club
  async followClub(userId, clubId) {
    try {
      // Check if user already follows a club
      const existingFollow = await prisma.clubFollow.findUnique({
        where: { userId }
      });

      if (existingFollow) {
        throw new Error('User can only follow one club at a time');
      }

      const follow = await prisma.clubFollow.create({
        data: {
          userId,
          clubId
        },
        include: {
          club: true
        }
      });

      return follow;
    } catch (error) {
      throw new Error(`Failed to follow club: ${error.message}`);
    }
  }

  // Unfollow club
  async unfollowClub(userId) {
    try {
      const follow = await prisma.clubFollow.delete({
        where: { userId },
        include: {
          club: true
        }
      });

      return follow;
    } catch (error) {
      throw new Error(`Failed to unfollow club: ${error.message}`);
    }
  }

  // Join fan group
  async joinFanGroup(userId, fanGroupId) {
    try {
      // Check if user is already a member of a fan group
      const existingMembership = await prisma.fanGroupMembership.findUnique({
        where: { userId }
      });

      if (existingMembership) {
        throw new Error('User can only be part of one fan group at a time');
      }

      const membership = await prisma.fanGroupMembership.create({
        data: {
          userId,
          fanGroupId,
          status: 'PENDING'
        },
        include: {
          fanGroup: true
        }
      });

      return membership;
    } catch (error) {
      throw new Error(`Failed to join fan group: ${error.message}`);
    }
  }

  // Leave fan group
  async leaveFanGroup(userId) {
    try {
      const membership = await prisma.fanGroupMembership.update({
        where: { userId },
        data: {
          status: 'CANCELLED',
          leftAt: new Date()
        },
        include: {
          fanGroup: true
        }
      });

      return membership;
    } catch (error) {
      throw new Error(`Failed to leave fan group: ${error.message}`);
    }
  }

  // Get user's recent activity
  async getRecentActivity(id, limit = 20) {
    try {
      const activities = await prisma.$transaction([
        // Recent check-ins
        prisma.checkIn.findMany({
          where: { userId: id },
          orderBy: { checkedInAt: 'desc' },
          take: Math.ceil(limit / 4),
          include: { game: true }
        }),
        // Recent task completions
        prisma.userTask.findMany({
          where: { 
            userId: id,
            status: 'COMPLETED'
          },
          orderBy: { completedAt: 'desc' },
          take: Math.ceil(limit / 4),
          include: { task: true }
        }),
        // Recent badge earnings
        prisma.userBadge.findMany({
          where: { userId: id },
          orderBy: { earnedAt: 'desc' },
          take: Math.ceil(limit / 4),
          include: { badge: true }
        }),
        // Recent transactions
        prisma.transaction.findMany({
          where: { userId: id },
          orderBy: { createdAt: 'desc' },
          take: Math.ceil(limit / 4)
        })
      ]);

      // Combine and sort all activities
      const allActivities = [
        ...activities[0].map(c => ({ ...c, type: 'check-in', date: c.checkedInAt })),
        ...activities[1].map(t => ({ ...t, type: 'task', date: t.completedAt })),
        ...activities[2].map(b => ({ ...b, type: 'badge', date: b.earnedAt })),
        ...activities[3].map(tr => ({ ...tr, type: 'transaction', date: tr.createdAt }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date))
       .slice(0, limit);

      return allActivities;
    } catch (error) {
      throw new Error(`Failed to get recent activity: ${error.message}`);
    }
  }
}

module.exports = new UserService(); 