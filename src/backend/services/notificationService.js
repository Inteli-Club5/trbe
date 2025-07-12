const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationService {
  // Create a new notification
  async createNotification(notificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          type: notificationData.type,
          category: notificationData.category,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data || {},
          priority: notificationData.priority || 'NORMAL',
          isRead: notificationData.isRead || false,
          scheduledAt: notificationData.scheduledAt ? new Date(notificationData.scheduledAt) : null,
          expiresAt: notificationData.expiresAt ? new Date(notificationData.expiresAt) : null,
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
      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  // Create multiple notifications
  async createMultipleNotifications(notificationsData) {
    try {
      const notifications = await prisma.notification.createMany({
        data: notificationsData.map(notification => ({
          userId: notification.userId,
          type: notification.type,
          category: notification.category,
          title: notification.title,
          message: notification.message,
          data: notification.data || {},
          priority: notification.priority || 'NORMAL',
          isRead: false,
          scheduledAt: notification.scheduledAt ? new Date(notification.scheduledAt) : null,
          expiresAt: notification.expiresAt ? new Date(notification.expiresAt) : null,
        }))
      });
      return notifications;
    } catch (error) {
      throw new Error(`Failed to create multiple notifications: ${error.message}`);
    }
  }

  // Get notification by ID
  async getNotificationById(id) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
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
      return notification;
    } catch (error) {
      throw new Error(`Failed to get notification: ${error.message}`);
    }
  }

  // Update notification
  async updateNotification(id, updateData) {
    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: {
          type: updateData.type,
          category: updateData.category,
          title: updateData.title,
          message: updateData.message,
          data: updateData.data,
          priority: updateData.priority,
          isRead: updateData.isRead,
          scheduledAt: updateData.scheduledAt ? new Date(updateData.scheduledAt) : undefined,
          expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : undefined,
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
      return notification;
    } catch (error) {
      throw new Error(`Failed to update notification: ${error.message}`);
    }
  }

  // Delete notification
  async deleteNotification(id) {
    try {
      const notification = await prisma.notification.delete({
        where: { id }
      });
      return notification;
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  // Get user's notifications with pagination
  async getUserNotifications(userId, page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        ...filters
      };

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.notification.count({ where })
      ]);

      return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get user notifications: ${error.message}`);
    }
  }

  // Get user's unread notifications
  async getUserUnreadNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        isRead: false
      };

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.notification.count({ where })
      ]);

      return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get user unread notifications: ${error.message}`);
    }
  }

  // Mark notification as read
  async markAsRead(id) {
    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });
      return notification;
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  // Mark multiple notifications as read
  async markMultipleAsRead(notificationIds) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds }
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to mark multiple notifications as read: ${error.message}`);
    }
  }

  // Mark all user notifications as read
  async markAllAsRead(userId) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
  }

  // Get notification count for user
  async getNotificationCount(userId, unreadOnly = false) {
    try {
      const where = {
        userId,
        ...(unreadOnly && { isRead: false })
      };

      const count = await prisma.notification.count({ where });
      return count;
    } catch (error) {
      throw new Error(`Failed to get notification count: ${error.message}`);
    }
  }

  // Get notifications by type
  async getNotificationsByType(userId, type, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        type
      };

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.notification.count({ where })
      ]);

      return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get notifications by type: ${error.message}`);
    }
  }

  // Get notifications by category
  async getNotificationsByCategory(userId, category, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        category
      };

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.notification.count({ where })
      ]);

      return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get notifications by category: ${error.message}`);
    }
  }

  // Get high priority notifications
  async getHighPriorityNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        priority: 'HIGH'
      };

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.notification.count({ where })
      ]);

      return {
        notifications,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get high priority notifications: ${error.message}`);
    }
  }

  // Delete expired notifications
  async deleteExpiredNotifications() {
    try {
      const result = await prisma.notification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete expired notifications: ${error.message}`);
    }
  }

  // Delete old notifications (older than specified days)
  async deleteOldNotifications(days = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          isRead: true
        }
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to delete old notifications: ${error.message}`);
    }
  }

  // Get notification statistics for user
  async getUserNotificationStats(userId) {
    try {
      const stats = await prisma.notification.groupBy({
        by: ['type', 'category', 'priority', 'isRead'],
        where: { userId },
        _count: {
          id: true
        }
      });

      const formattedStats = {
        total: 0,
        unread: 0,
        byType: {},
        byCategory: {},
        byPriority: {}
      };

      stats.forEach(stat => {
        const count = stat._count.id;
        formattedStats.total += count;

        if (!stat.isRead) {
          formattedStats.unread += count;
        }

        // Group by type
        if (!formattedStats.byType[stat.type]) {
          formattedStats.byType[stat.type] = { total: 0, unread: 0 };
        }
        formattedStats.byType[stat.type].total += count;
        if (!stat.isRead) {
          formattedStats.byType[stat.type].unread += count;
        }

        // Group by category
        if (!formattedStats.byCategory[stat.category]) {
          formattedStats.byCategory[stat.category] = { total: 0, unread: 0 };
        }
        formattedStats.byCategory[stat.category].total += count;
        if (!stat.isRead) {
          formattedStats.byCategory[stat.category].unread += count;
        }

        // Group by priority
        if (!formattedStats.byPriority[stat.priority]) {
          formattedStats.byPriority[stat.priority] = { total: 0, unread: 0 };
        }
        formattedStats.byPriority[stat.priority].total += count;
        if (!stat.isRead) {
          formattedStats.byPriority[stat.priority].unread += count;
        }
      });

      return formattedStats;
    } catch (error) {
      throw new Error(`Failed to get user notification stats: ${error.message}`);
    }
  }

  // Create system notification
  async createSystemNotification(title, message, category = 'SYSTEM', data = {}) {
    try {
      // Get all active users
      const users = await prisma.user.findMany({
        where: {
          deletedAt: null,
          status: 'ACTIVE'
        },
        select: { id: true }
      });

      const notificationsData = users.map(user => ({
        userId: user.id,
        type: 'SYSTEM',
        category,
        title,
        message,
        data,
        priority: 'NORMAL'
      }));

      const result = await this.createMultipleNotifications(notificationsData);
      return result;
    } catch (error) {
      throw new Error(`Failed to create system notification: ${error.message}`);
    }
  }

  // Create club notification
  async createClubNotification(clubId, title, message, category = 'CLUB', data = {}) {
    try {
      // Get all users following this club
      const clubFollowers = await prisma.clubFollow.findMany({
        where: { clubId },
        select: { userId: true }
      });

      const notificationsData = clubFollowers.map(follower => ({
        userId: follower.userId,
        type: 'CLUB',
        category,
        title,
        message,
        data: { ...data, clubId },
        priority: 'NORMAL'
      }));

      const result = await this.createMultipleNotifications(notificationsData);
      return result;
    } catch (error) {
      throw new Error(`Failed to create club notification: ${error.message}`);
    }
  }

  // Create fan group notification
  async createFanGroupNotification(fanGroupId, title, message, category = 'FAN_GROUP', data = {}) {
    try {
      // Get all active members of this fan group
      const fanGroupMembers = await prisma.fanGroupMembership.findMany({
        where: {
          fanGroupId,
          status: 'ACTIVE'
        },
        select: { userId: true }
      });

      const notificationsData = fanGroupMembers.map(member => ({
        userId: member.userId,
        type: 'FAN_GROUP',
        category,
        title,
        message,
        data: { ...data, fanGroupId },
        priority: 'NORMAL'
      }));

      const result = await this.createMultipleNotifications(notificationsData);
      return result;
    } catch (error) {
      throw new Error(`Failed to create fan group notification: ${error.message}`);
    }
  }

  // Create event notification
  async createEventNotification(eventId, title, message, category = 'EVENT', data = {}) {
    try {
      // Get all participants of this event
      const eventParticipants = await prisma.eventParticipant.findMany({
        where: {
          eventId,
          status: { in: ['registered', 'confirmed', 'attended'] }
        },
        select: { userId: true }
      });

      const notificationsData = eventParticipants.map(participant => ({
        userId: participant.userId,
        type: 'EVENT',
        category,
        title,
        message,
        data: { ...data, eventId },
        priority: 'NORMAL'
      }));

      const result = await this.createMultipleNotifications(notificationsData);
      return result;
    } catch (error) {
      throw new Error(`Failed to create event notification: ${error.message}`);
    }
  }

  // Create achievement notification
  async createAchievementNotification(userId, achievementType, data = {}) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'ACHIEVEMENT',
        category: 'REWARD',
        title: 'Achievement Unlocked!',
        message: `Congratulations! You've earned a new achievement: ${achievementType}`,
        data: { ...data, achievementType },
        priority: 'HIGH'
      });

      return notification;
    } catch (error) {
      throw new Error(`Failed to create achievement notification: ${error.message}`);
    }
  }

  // Create task completion notification
  async createTaskCompletionNotification(userId, taskTitle, tokens, experience) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'TASK',
        category: 'REWARD',
        title: 'Task Completed!',
        message: `Great job! You've completed "${taskTitle}" and earned ${tokens} tokens and ${experience} experience points.`,
        data: { taskTitle, tokens, experience },
        priority: 'NORMAL'
      });

      return notification;
    } catch (error) {
      throw new Error(`Failed to create task completion notification: ${error.message}`);
    }
  }

  // Create badge earned notification
  async createBadgeEarnedNotification(userId, badgeName, rarity) {
    try {
      const notification = await this.createNotification({
        userId,
        type: 'BADGE',
        category: 'REWARD',
        title: 'Badge Earned!',
        message: `Congratulations! You've earned the "${badgeName}" badge (${rarity} rarity)!`,
        data: { badgeName, rarity },
        priority: 'HIGH'
      });

      return notification;
    } catch (error) {
      throw new Error(`Failed to create badge earned notification: ${error.message}`);
    }
  }
}

module.exports = new NotificationService(); 