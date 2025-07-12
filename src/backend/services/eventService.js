const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EventService {
  // Create a new event
  async createEvent(eventData) {
    try {
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          type: eventData.type,
          date: new Date(eventData.date),
          time: eventData.time,
          location: eventData.location,
          latitude: eventData.latitude,
          longitude: eventData.longitude,
          organizerId: eventData.organizerId,
          organizerType: eventData.organizerType,
          clubId: eventData.clubId,
          fanGroupId: eventData.fanGroupId,
          gameId: eventData.gameId,
          maxParticipants: eventData.maxParticipants,
          price: eventData.price,
          currency: eventData.currency || 'GBP',
          status: eventData.status || 'DRAFT',
          isPublic: eventData.isPublic !== false,
          image: eventData.image,
          tags: eventData.tags || [],
        },
        include: {
          club: true,
          fanGroup: true,
          game: true,
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
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  // Get event by ID
  async getEventById(id) {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          club: true,
          fanGroup: true,
          game: true,
          participants: {
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
            orderBy: { registeredAt: 'desc' }
          },
          _count: {
            select: { participants: true }
          }
        }
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to get event: ${error.message}`);
    }
  }

  // Update event
  async updateEvent(id, updateData) {
    try {
      const event = await prisma.event.update({
        where: { id },
        data: {
          title: updateData.title,
          description: updateData.description,
          category: updateData.category,
          type: updateData.type,
          date: updateData.date ? new Date(updateData.date) : undefined,
          time: updateData.time,
          location: updateData.location,
          latitude: updateData.latitude,
          longitude: updateData.longitude,
          organizerId: updateData.organizerId,
          organizerType: updateData.organizerType,
          clubId: updateData.clubId,
          fanGroupId: updateData.fanGroupId,
          gameId: updateData.gameId,
          maxParticipants: updateData.maxParticipants,
          price: updateData.price,
          currency: updateData.currency,
          status: updateData.status,
          isPublic: updateData.isPublic,
          image: updateData.image,
          tags: updateData.tags,
        },
        include: {
          club: true,
          fanGroup: true,
          game: true,
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
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  // Delete event (soft delete)
  async deleteEvent(id) {
    try {
      const event = await prisma.event.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      });
      return event;
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  // Get all events with pagination and filters
  async getEvents(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
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
            club: true,
            fanGroup: true,
            game: true,
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

  // Get upcoming events
  async getUpcomingEvents(limit = 10, filters = {}) {
    try {
      const where = {
        deletedAt: null,
        date: { gte: new Date() },
        status: { in: ['PUBLISHED', 'OPEN'] },
        ...filters
      };

      const events = await prisma.event.findMany({
        where,
        take: limit,
        orderBy: { date: 'asc' },
        include: {
          club: true,
          fanGroup: true,
          game: true,
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
      });

      return events;
    } catch (error) {
      throw new Error(`Failed to get upcoming events: ${error.message}`);
    }
  }

  // Register user for event
  async registerForEvent(eventId, userId) {
    try {
      // Check if event exists and has space
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          participants: true,
          _count: {
            select: { participants: true }
          }
        }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.status !== 'OPEN' && event.status !== 'PUBLISHED') {
        throw new Error('Event is not open for registration');
      }

      if (event.maxParticipants && event._count.participants >= event.maxParticipants) {
        throw new Error('Event is full');
      }

      // Check if user is already registered
      const existingRegistration = await prisma.eventParticipant.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        }
      });

      if (existingRegistration) {
        throw new Error('User is already registered for this event');
      }

      const participant = await prisma.eventParticipant.create({
        data: {
          userId,
          eventId,
          status: 'registered',
          registeredAt: new Date()
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
          event: true
        }
      });

      // Update event participant count
      await this.updateParticipantCount(eventId);

      return participant;
    } catch (error) {
      throw new Error(`Failed to register for event: ${error.message}`);
    }
  }

  // Unregister user from event
  async unregisterFromEvent(eventId, userId) {
    try {
      const participant = await prisma.eventParticipant.update({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        },
        data: {
          status: 'cancelled',
          cancelledAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true
            }
          },
          event: true
        }
      });

      // Update event participant count
      await this.updateParticipantCount(eventId);

      return participant;
    } catch (error) {
      throw new Error(`Failed to unregister from event: ${error.message}`);
    }
  }

  // Confirm user attendance
  async confirmAttendance(eventId, userId) {
    try {
      const participant = await prisma.eventParticipant.update({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        },
        data: {
          status: 'attended',
          attendedAt: new Date()
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
          event: true
        }
      });

      return participant;
    } catch (error) {
      throw new Error(`Failed to confirm attendance: ${error.message}`);
    }
  }

  // Get event participants
  async getEventParticipants(eventId, page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        eventId,
        ...filters
      };

      const [participants, total] = await Promise.all([
        prisma.eventParticipant.findMany({
          where,
          skip,
          take: limit,
          orderBy: { registeredAt: 'desc' },
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
        prisma.eventParticipant.count({ where })
      ]);

      return {
        participants,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get event participants: ${error.message}`);
    }
  }

  // Get user's events
  async getUserEvents(userId, page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        userId,
        ...filters
      };

      const [participations, total] = await Promise.all([
        prisma.eventParticipant.findMany({
          where,
          skip,
          take: limit,
          orderBy: { registeredAt: 'desc' },
          include: {
            event: {
              include: {
                club: true,
                fanGroup: true,
                game: true,
                _count: {
                  select: { participants: true }
                }
              }
            }
          }
        }),
        prisma.eventParticipant.count({ where })
      ]);

      return {
        participations,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to get user events: ${error.message}`);
    }
  }

  // Update participant count
  async updateParticipantCount(eventId) {
    try {
      const currentParticipants = await prisma.eventParticipant.count({
        where: {
          eventId,
          status: { in: ['registered', 'confirmed', 'attended'] }
        }
      });

      await prisma.event.update({
        where: { id: eventId },
        data: { currentParticipants }
      });
    } catch (error) {
      throw new Error(`Failed to update participant count: ${error.message}`);
    }
  }

  // Search events
  async searchEvents(query, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      };

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { date: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
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
      throw new Error(`Failed to search events: ${error.message}`);
    }
  }

  // Get events by club
  async getEventsByClub(clubId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        clubId,
        deletedAt: null
      };

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { date: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
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
      throw new Error(`Failed to get events by club: ${error.message}`);
    }
  }

  // Get events by fan group
  async getEventsByFanGroup(fanGroupId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        fanGroupId,
        deletedAt: null
      };

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { date: 'asc' },
          include: {
            club: true,
            fanGroup: true,
            game: true,
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
      throw new Error(`Failed to get events by fan group: ${error.message}`);
    }
  }
}

module.exports = new EventService(); 