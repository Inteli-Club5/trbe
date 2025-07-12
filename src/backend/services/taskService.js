const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TaskService {
  // Create a new task
  async createTask(taskData) {
    try {
      const task = await prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          type: taskData.type,
          difficulty: taskData.difficulty,
          requirement: taskData.requirement,
          maxProgress: taskData.maxProgress || 1,
          tokens: taskData.tokens || 0,
          experience: taskData.experience || 0,
          isActive: taskData.isActive !== false,
          isRecurring: taskData.isRecurring || false,
          recurrenceType: taskData.recurrenceType,
          recurrenceValue: taskData.recurrenceValue,
          startDate: taskData.startDate ? new Date(taskData.startDate) : null,
          endDate: taskData.endDate ? new Date(taskData.endDate) : null,
          clubId: taskData.clubId,
          fanGroupId: taskData.fanGroupId,
          gameId: taskData.gameId,
          eventId: taskData.eventId,
          tags: taskData.tags || [],
        },
        include: {
          club: true,
          fanGroup: true,
          game: true,
          event: true,
          _count: {
            select: { userTasks: true }
          }
        }
      });
      return task;
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  // Get task by ID
  async getTaskById(id) {
    try {
      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          club: true,
          fanGroup: true,
          game: true,
          event: true,
          userTasks: {
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
            orderBy: { completedAt: 'desc' }
          },
          _count: {
            select: { userTasks: true }
          }
        }
      });
      return task;
    } catch (error) {
      throw new Error(`Failed to get task: ${error.message}`);
    }
  }

  // Update task
  async updateTask(id, updateData) {
    try {
      const task = await prisma.task.update({
        where: { id },
        data: {
          title: updateData.title,
          description: updateData.description,
          category: updateData.category,
          type: updateData.type,
          difficulty: updateData.difficulty,
          requirement: updateData.requirement,
          maxProgress: updateData.maxProgress,
          tokens: updateData.tokens,
          experience: updateData.experience,
          isActive: updateData.isActive,
          isRecurring: updateData.isRecurring,
          recurrenceType: updateData.recurrenceType,
          recurrenceValue: updateData.recurrenceValue,
          startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
          endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
          clubId: updateData.clubId,
          fanGroupId: updateData.fanGroupId,
          gameId: updateData.gameId,
          eventId: updateData.eventId,
          tags: updateData.tags,
        },
        include: {
          club: true,
          fanGroup: true,
          game: true,
          event: true,
          _count: {
            select: { userTasks: true }
          }
        }
      });
      return task;
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  // Delete task
  async deleteTask(id) {
    try {
      const task = await prisma.task.update({
        where: { id },
        data: { isActive: false }
      });
      return task;
    } catch (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  // Get all tasks with pagination and filters
  async getTasks(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        isActive: true,
        ...filters
      };

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { difficulty: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
            event: true,
            _count: {
              select: { userTasks: true }
            }
          }
        }),
        prisma.task.count({ where })
      ]);

      return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
  }

  // Get tasks by category
  async getTasksByCategory(category, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        category,
        isActive: true
      };

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { difficulty: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
            event: true,
            _count: {
              select: { userTasks: true }
            }
          }
        }),
        prisma.task.count({ where })
      ]);

      return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get tasks by category: ${error.message}`);
    }
  }

  // Get tasks by difficulty
  async getTasksByDifficulty(difficulty, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        difficulty,
        isActive: true
      };

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { title: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
            event: true,
            _count: {
              select: { userTasks: true }
            }
          }
        }),
        prisma.task.count({ where })
      ]);

      return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get tasks by difficulty: ${error.message}`);
    }
  }

  // Assign task to user
  async assignTaskToUser(userId, taskId) {
    try {
      // Check if task is already assigned to user
      const existingTask = await prisma.userTask.findUnique({
        where: {
          userId_taskId: {
            userId,
            taskId
          }
        }
      });

      if (existingTask) {
        throw new Error('Task is already assigned to user');
      }

      const userTask = await prisma.userTask.create({
        data: {
          userId,
          taskId,
          status: 'ASSIGNED',
          assignedAt: new Date()
        },
        include: {
          task: true,
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

      return userTask;
    } catch (error) {
      throw new Error(`Failed to assign task: ${error.message}`);
    }
  }

  // Update task progress
  async updateTaskProgress(userId, taskId, progress) {
    try {
      const userTask = await prisma.userTask.findUnique({
        where: {
          userId_taskId: {
            userId,
            taskId
          }
        },
        include: {
          task: true
        }
      });

      if (!userTask) {
        throw new Error('Task not assigned to user');
      }

      const newProgress = Math.min(progress, userTask.task.maxProgress);
      const isCompleted = newProgress >= userTask.task.maxProgress;

      const updatedUserTask = await prisma.userTask.update({
        where: {
          userId_taskId: {
            userId,
            taskId
          }
        },
        data: {
          progress: newProgress,
          status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
          completedAt: isCompleted ? new Date() : null
        },
        include: {
          task: true,
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

      // Award rewards if task is completed
      if (isCompleted) {
        await this.awardTaskRewards(userId, updatedUserTask.task);
      }

      return updatedUserTask;
    } catch (error) {
      throw new Error(`Failed to update task progress: ${error.message}`);
    }
  }

  // Award task rewards (tokens and experience)
  async awardTaskRewards(userId, task) {
    try {
      const userService = require('./userService');

      // Award tokens
      if (task.tokens > 0) {
        await userService.updateTokens(userId, task.tokens, 'EARNED');
      }

      // Award experience
      if (task.experience > 0) {
        await userService.updateExperience(userId, task.experience);
      }

      // Update user's total tasks count
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalTasks: {
            increment: 1
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to award task rewards: ${error.message}`);
    }
  }

  // Get user's tasks
  async getUserTasks(userId, page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        ...filters
      };

      const [userTasks, total] = await Promise.all([
        prisma.userTask.findMany({
          where,
          skip,
          take: limit,
          orderBy: { assignedAt: 'desc' },
          include: {
            task: true
          }
        }),
        prisma.userTask.count({ where })
      ]);

      return {
        userTasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get user tasks: ${error.message}`);
    }
  }

  // Get user's available tasks (not yet assigned)
  async getUserAvailableTasks(userId) {
    try {
      const assignedTaskIds = await prisma.userTask.findMany({
        where: { userId },
        select: { taskId: true }
      });

      const assignedIds = assignedTaskIds.map(ut => ut.taskId);

      const availableTasks = await prisma.task.findMany({
        where: {
          isActive: true,
          id: { notIn: assignedIds }
        },
        orderBy: { difficulty: 'asc' },
        include: {
          club: true,
          fanGroup: true,
          game: true,
          event: true
        }
      });

      return availableTasks;
    } catch (error) {
      throw new Error(`Failed to get user available tasks: ${error.message}`);
    }
  }

  // Get user's completed tasks
  async getUserCompletedTasks(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        status: 'COMPLETED'
      };

      const [userTasks, total] = await Promise.all([
        prisma.userTask.findMany({
          where,
          skip,
          take: limit,
          orderBy: { completedAt: 'desc' },
          include: {
            task: true
          }
        }),
        prisma.userTask.count({ where })
      ]);

      return {
        userTasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get user completed tasks: ${error.message}`);
    }
  }

  // Get task progress for user
  async getTaskProgress(userId, taskId) {
    try {
      const userTask = await prisma.userTask.findUnique({
        where: {
          userId_taskId: {
            userId,
            taskId
          }
        },
        include: {
          task: true
        }
      });

      if (!userTask) {
        return {
          progress: 0,
          maxProgress: 1,
          isCompleted: false,
          percentage: 0
        };
      }

      const percentage = Math.min(100, (userTask.progress / userTask.task.maxProgress) * 100);

      return {
        progress: userTask.progress,
        maxProgress: userTask.task.maxProgress,
        isCompleted: userTask.progress >= userTask.task.maxProgress,
        percentage: Math.round(percentage),
        status: userTask.status,
        assignedAt: userTask.assignedAt,
        completedAt: userTask.completedAt
      };
    } catch (error) {
      throw new Error(`Failed to get task progress: ${error.message}`);
    }
  }

  // Get user's task statistics
  async getUserTaskStats(userId) {
    try {
      const userTasks = await prisma.userTask.findMany({
        where: { userId },
        include: {
          task: true
        }
      });

      const stats = {
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter(ut => ut.status === 'COMPLETED').length,
        totalTokens: userTasks.filter(ut => ut.status === 'COMPLETED').reduce((sum, ut) => sum + ut.task.tokens, 0),
        totalExperience: userTasks.filter(ut => ut.status === 'COMPLETED').reduce((sum, ut) => sum + ut.task.experience, 0),
        byCategory: {},
        byDifficulty: {}
      };

      // Group by category
      userTasks.forEach(ut => {
        const category = ut.task.category;
        if (!stats.byCategory[category]) {
          stats.byCategory[category] = { total: 0, completed: 0 };
        }
        stats.byCategory[category].total++;
        if (ut.status === 'COMPLETED') {
          stats.byCategory[category].completed++;
        }
      });

      // Group by difficulty
      userTasks.forEach(ut => {
        const difficulty = ut.task.difficulty;
        if (!stats.byDifficulty[difficulty]) {
          stats.byDifficulty[difficulty] = { total: 0, completed: 0 };
        }
        stats.byDifficulty[difficulty].total++;
        if (ut.status === 'COMPLETED') {
          stats.byDifficulty[difficulty].completed++;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to get user task stats: ${error.message}`);
    }
  }

  // Get tasks by club
  async getTasksByClub(clubId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        clubId,
        isActive: true
      };

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { difficulty: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
            event: true,
            _count: {
              select: { userTasks: true }
            }
          }
        }),
        prisma.task.count({ where })
      ]);

      return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get tasks by club: ${error.message}`);
    }
  }

  // Get tasks by fan group
  async getTasksByFanGroup(fanGroupId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        fanGroupId,
        isActive: true
      };

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { difficulty: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
            event: true,
            _count: {
              select: { userTasks: true }
            }
          }
        }),
        prisma.task.count({ where })
      ]);

      return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get tasks by fan group: ${error.message}`);
    }
  }

  // Search tasks
  async searchTasks(query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { requirement: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      };

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { difficulty: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
            event: true,
            _count: {
              select: { userTasks: true }
            }
          }
        }),
        prisma.task.count({ where })
      ]);

      return {
        tasks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to search tasks: ${error.message}`);
    }
  }

  // Get daily tasks for user
  async getDailyTasks(userId) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const dailyTasks = await prisma.userTask.findMany({
        where: {
          userId,
          assignedAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: {
          task: true
        },
        orderBy: { assignedAt: 'desc' }
      });

      return dailyTasks;
    } catch (error) {
      throw new Error(`Failed to get daily tasks: ${error.message}`);
    }
  }

  // Get weekly tasks for user
  async getWeeklyTasks(userId) {
    try {
      const today = new Date();
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6, 23, 59, 59);

      const weeklyTasks = await prisma.userTask.findMany({
        where: {
          userId,
          assignedAt: {
            gte: startOfWeek,
            lte: endOfWeek
          }
        },
        include: {
          task: true
        },
        orderBy: { assignedAt: 'desc' }
      });

      return weeklyTasks;
    } catch (error) {
      throw new Error(`Failed to get weekly tasks: ${error.message}`);
    }
  }
}

module.exports = new TaskService(); 