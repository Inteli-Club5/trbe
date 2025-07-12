const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class FanGroupService {
  // Create a new fan group
  async createFanGroup(fanGroupData) {
    try {
      const fanGroup = await prisma.fanGroup.create({
        data: {
          name: fanGroupData.name,
          description: fanGroupData.description,
          logo: fanGroupData.logo,
          banner: fanGroupData.banner,
          founded: fanGroupData.founded,
          location: fanGroupData.location,
          country: fanGroupData.country,
          city: fanGroupData.city,
          headquarters: fanGroupData.headquarters,
          category: fanGroupData.category || 'UNOFFICIAL',
          level: fanGroupData.level || 'RESPECTABLE',
          isPublic: fanGroupData.isPublic !== false,
          requiresApproval: fanGroupData.requiresApproval || false,
          maxMembers: fanGroupData.maxMembers,
          website: fanGroupData.website,
          socialLinks: fanGroupData.socialLinks,
          tags: fanGroupData.tags || [],
        },
        include: {
          _count: {
            select: {
              memberships: true,
              events: true,
              achievements: true
            }
          }
        }
      });
      return fanGroup;
    } catch (error) {
      throw new Error(`Failed to create fan group: ${error.message}`);
    }
  }

  // Get fan group by ID
  async getFanGroupById(id) {
    try {
      const fanGroup = await prisma.fanGroup.findUnique({
        where: { id },
        include: {
          memberships: {
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
            orderBy: { joinedAt: 'desc' }
          },
          events: {
            where: { deletedAt: null },
            orderBy: { date: 'asc' },
            take: 10
          },
          achievements: {
            orderBy: { earnedAt: 'desc' },
            take: 10
          },
          _count: {
            select: {
              memberships: true,
              events: true,
              achievements: true
            }
          }
        }
      });
      return fanGroup;
    } catch (error) {
      throw new Error(`Failed to get fan group: ${error.message}`);
    }
  }

  // Get fan group by name
  async getFanGroupByName(name) {
    try {
      const fanGroup = await prisma.fanGroup.findUnique({
        where: { name },
        include: {
          _count: {
            select: {
              memberships: true,
              events: true
            }
          }
        }
      });
      return fanGroup;
    } catch (error) {
      throw new Error(`Failed to get fan group by name: ${error.message}`);
    }
  }

  // Update fan group
  async updateFanGroup(id, updateData) {
    try {
      const fanGroup = await prisma.fanGroup.update({
        where: { id },
        data: {
          name: updateData.name,
          description: updateData.description,
          logo: updateData.logo,
          banner: updateData.banner,
          founded: updateData.founded,
          location: updateData.location,
          country: updateData.country,
          city: updateData.city,
          headquarters: updateData.headquarters,
          category: updateData.category,
          level: updateData.level,
          isPublic: updateData.isPublic,
          requiresApproval: updateData.requiresApproval,
          maxMembers: updateData.maxMembers,
          website: updateData.website,
          socialLinks: updateData.socialLinks,
          tags: updateData.tags,
        },
        include: {
          _count: {
            select: {
              memberships: true,
              events: true,
              achievements: true
            }
          }
        }
      });
      return fanGroup;
    } catch (error) {
      throw new Error(`Failed to update fan group: ${error.message}`);
    }
  }

  // Delete fan group (soft delete)
  async deleteFanGroup(id) {
    try {
      const fanGroup = await prisma.fanGroup.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      });
      return fanGroup;
    } catch (error) {
      throw new Error(`Failed to delete fan group: ${error.message}`);
    }
  }

  // Get all fan groups with pagination and filters
  async getFanGroups(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        deletedAt: null,
        ...filters
      };

      const [fanGroups, total] = await Promise.all([
        prisma.fanGroup.findMany({
          where,
          skip,
          take: limit,
          orderBy: { totalMembers: 'desc' },
          include: {
            _count: {
              select: {
                memberships: true,
                events: true,
                achievements: true
              }
            }
          }
        }),
        prisma.fanGroup.count({ where })
      ]);

      return {
        fanGroups,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get fan groups: ${error.message}`);
    }
  }

  // Add member to fan group
  async addMember(fanGroupId, userId, role = 'MEMBER') {
    try {
      // Check if user is already a member
      const existingMembership = await prisma.fanGroupMembership.findUnique({
        where: { userId }
      });

      if (existingMembership) {
        throw new Error('User is already a member of a fan group');
      }

      // Check if fan group is full
      const fanGroup = await prisma.fanGroup.findUnique({
        where: { id: fanGroupId },
        include: {
          _count: {
            select: { memberships: true }
          }
        }
      });

      if (fanGroup.maxMembers && fanGroup._count.memberships >= fanGroup.maxMembers) {
        throw new Error('Fan group is full');
      }

      const membership = await prisma.fanGroupMembership.create({
        data: {
          userId,
          fanGroupId,
          status: fanGroup.requiresApproval ? 'PENDING' : 'ACTIVE',
          role,
          joinedAt: new Date(),
          approvedAt: fanGroup.requiresApproval ? null : new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              level: true
            }
          },
          fanGroup: true
        }
      });

      // Update fan group member count
      await this.updateMemberCount(fanGroupId);

      return membership;
    } catch (error) {
      throw new Error(`Failed to add member: ${error.message}`);
    }
  }

  // Remove member from fan group
  async removeMember(fanGroupId, userId) {
    try {
      const membership = await prisma.fanGroupMembership.update({
        where: { userId },
        data: {
          status: 'CANCELLED',
          leftAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true
            }
          },
          fanGroup: true
        }
      });

      // Update fan group member count
      await this.updateMemberCount(fanGroupId);

      return membership;
    } catch (error) {
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  }

  // Approve member request
  async approveMember(userId) {
    try {
      const membership = await prisma.fanGroupMembership.update({
        where: { userId },
        data: {
          status: 'ACTIVE',
          approvedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          },
          fanGroup: true
        }
      });

      // Update fan group member count
      await this.updateMemberCount(membership.fanGroupId);

      return membership;
    } catch (error) {
      throw new Error(`Failed to approve member: ${error.message}`);
    }
  }

  // Reject member request
  async rejectMember(userId, reason = null) {
    try {
      const membership = await prisma.fanGroupMembership.update({
        where: { userId },
        data: {
          status: 'CANCELLED',
          leftAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true
            }
          },
          fanGroup: true
        }
      });

      return membership;
    } catch (error) {
      throw new Error(`Failed to reject member: ${error.message}`);
    }
  }

  // Update member role
  async updateMemberRole(userId, newRole) {
    try {
      const membership = await prisma.fanGroupMembership.update({
        where: { userId },
        data: { role: newRole },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true
            }
          },
          fanGroup: true
        }
      });

      return membership;
    } catch (error) {
      throw new Error(`Failed to update member role: ${error.message}`);
    }
  }

  // Get fan group members
  async getMembers(fanGroupId, page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        fanGroupId,
        ...filters
      };

      const [members, total] = await Promise.all([
        prisma.fanGroupMembership.findMany({
          where,
          skip,
          take: limit,
          orderBy: { joinedAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                level: true,
                reputationScore: true,
                totalCheckIns: true,
                totalTasks: true
              }
            }
          }
        }),
        prisma.fanGroupMembership.count({ where })
      ]);

      return {
        members,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get members: ${error.message}`);
    }
  }

  // Get fan group events
  async getEvents(fanGroupId, page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        fanGroupId,
        deletedAt: null,
        ...filters
      };

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { date: 'asc' },
          include: {
            participants: {
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
            },
            _count: {
              select: { participants: true }
            }
          }
        }),
        prisma.event.count({ where })
      ]);

      return {
        events,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get events: ${error.message}`);
    }
  }

  // Update member count
  async updateMemberCount(fanGroupId) {
    try {
      const [activeMembers, totalMembers] = await Promise.all([
        prisma.fanGroupMembership.count({
          where: {
            fanGroupId,
            status: 'ACTIVE'
          }
        }),
        prisma.fanGroupMembership.count({
          where: { fanGroupId }
        })
      ]);

      await prisma.fanGroup.update({
        where: { id: fanGroupId },
        data: {
          totalMembers,
          activeMembers
        }
      });
    } catch (error) {
      throw new Error(`Failed to update member count: ${error.message}`);
    }
  }

  // Get fan group statistics
  async getFanGroupStats(fanGroupId) {
    try {
      const stats = await prisma.fanGroup.findUnique({
        where: { id: fanGroupId },
        include: {
          _count: {
            select: {
              memberships: true,
              events: true,
              achievements: true
            }
          },
          memberships: {
            include: {
              user: {
                select: {
                  tokens: true,
                  reputationScore: true,
                  totalCheckIns: true,
                  totalTasks: true
                }
              }
            }
          }
        }
      });

      if (!stats) {
        throw new Error('Fan group not found');
      }

      // Calculate additional stats
      const totalTokens = stats.memberships.reduce((sum, member) => sum + member.user.tokens, 0);
      const avgReputation = stats.memberships.length > 0 
        ? stats.memberships.reduce((sum, member) => sum + member.user.reputationScore, 0) / stats.memberships.length 
        : 0;
      const totalCheckIns = stats.memberships.reduce((sum, member) => sum + member.user.totalCheckIns, 0);
      const totalTasks = stats.memberships.reduce((sum, member) => sum + member.user.totalTasks, 0);

      return {
        ...stats,
        stats: {
          totalTokens,
          avgReputation: Math.round(avgReputation),
          totalCheckIns,
          totalTasks,
          avgTokensPerMember: stats.memberships.length > 0 ? Math.round(totalTokens / stats.memberships.length) : 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to get fan group stats: ${error.message}`);
    }
  }

  // Search fan groups
  async searchFanGroups(query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      };

      const [fanGroups, total] = await Promise.all([
        prisma.fanGroup.findMany({
          where,
          skip,
          take: limit,
          orderBy: { totalMembers: 'desc' },
          include: {
            _count: {
              select: {
                memberships: true,
                events: true
              }
            }
          }
        }),
        prisma.fanGroup.count({ where })
      ]);

      return {
        fanGroups,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to search fan groups: ${error.message}`);
    }
  }
}

module.exports = new FanGroupService(); 