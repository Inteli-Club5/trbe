const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.$transaction([
    prisma.userBadge.deleteMany(),
    prisma.userTask.deleteMany(),
    prisma.eventParticipant.deleteMany(),
    prisma.fanGroupMembership.deleteMany(),
    prisma.clubFollow.deleteMany(),
    prisma.checkIn.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.purchase.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.reputationHistory.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.socialStats.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.task.deleteMany(),
    prisma.event.deleteMany(),
    prisma.game.deleteMany(),
    prisma.fanGroup.deleteMany(),
    prisma.club.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✅ Database cleared');

  // Create clubs
  console.log('🏟️ Creating clubs...');
  const clubs = await Promise.all([
    prisma.club.create({
      data: {
        name: 'Manchester United',
        shortName: 'Man Utd',
        description: 'One of the most successful football clubs in England',
        logo: '/images/clubs/man-utd.png',
        banner: '/images/clubs/man-utd-banner.jpg',
        founded: 1878,
        location: 'Manchester, England',
        country: 'England',
        city: 'Manchester',
        stadium: 'Old Trafford',
        capacity: 74140,
        website: 'https://www.manutd.com',
        socialLinks: {
          twitter: '@ManUtd',
          instagram: 'manutd',
          facebook: 'manchesterunited'
        },
        category: 'FOOTBALL',
        level: 'PREMIER_LEAGUE',
        isActive: true
      }
    }),
    prisma.club.create({
      data: {
        name: 'Liverpool FC',
        shortName: 'Liverpool',
        description: 'One of England\'s most successful football clubs',
        logo: '/images/clubs/liverpool.png',
        banner: '/images/clubs/liverpool-banner.jpg',
        founded: 1892,
        location: 'Liverpool, England',
        country: 'England',
        city: 'Liverpool',
        stadium: 'Anfield',
        capacity: 53394,
        website: 'https://www.liverpoolfc.com',
        socialLinks: {
          twitter: '@LFC',
          instagram: 'liverpoolfc',
          facebook: 'LiverpoolFC'
        },
        category: 'FOOTBALL',
        level: 'PREMIER_LEAGUE',
        isActive: true
      }
    }),
    prisma.club.create({
      data: {
        name: 'Arsenal FC',
        shortName: 'Arsenal',
        description: 'North London football club with rich history',
        logo: '/images/clubs/arsenal.png',
        banner: '/images/clubs/arsenal-banner.jpg',
        founded: 1886,
        location: 'London, England',
        country: 'England',
        city: 'London',
        stadium: 'Emirates Stadium',
        capacity: 60704,
        website: 'https://www.arsenal.com',
        socialLinks: {
          twitter: '@Arsenal',
          instagram: 'arsenal',
          facebook: 'Arsenal'
        },
        category: 'FOOTBALL',
        level: 'PREMIER_LEAGUE',
        isActive: true
      }
    })
  ]);

  console.log(`✅ Created ${clubs.length} clubs`);

  // Create fan groups
  console.log('👥 Creating fan groups...');
  const fanGroups = await Promise.all([
    prisma.fanGroup.create({
      data: {
        name: 'Red Devils United',
        description: 'Official Manchester United fan group',
        logo: '/images/fan-groups/red-devils.png',
        banner: '/images/fan-groups/red-devils-banner.jpg',
        founded: 2020,
        location: 'Manchester, England',
        country: 'England',
        city: 'Manchester',
        headquarters: 'Old Trafford',
        category: 'OFFICIAL',
        level: 'RESPECTABLE',
        isPublic: true,
        requiresApproval: false,
        maxMembers: 1000,
        website: 'https://reddevilsunited.com',
        socialLinks: {
          twitter: '@RedDevilsUnited',
          instagram: 'reddevilsunited'
        },
        tags: ['manchester-united', 'football', 'official']
      }
    }),
    prisma.fanGroup.create({
      data: {
        name: 'Kopites Worldwide',
        description: 'Global Liverpool FC supporters group',
        logo: '/images/fan-groups/kopites.png',
        banner: '/images/fan-groups/kopites-banner.jpg',
        founded: 2019,
        location: 'Liverpool, England',
        country: 'England',
        city: 'Liverpool',
        headquarters: 'Anfield',
        category: 'UNOFFICIAL',
        level: 'RESPECTABLE',
        isPublic: true,
        requiresApproval: true,
        maxMembers: 500,
        website: 'https://kopitesworldwide.com',
        socialLinks: {
          twitter: '@KopitesWorldwide',
          instagram: 'kopitesworldwide'
        },
        tags: ['liverpool', 'football', 'supporters']
      }
    }),
    prisma.fanGroup.create({
      data: {
        name: 'Gunners Community',
        description: 'Arsenal FC fan community',
        logo: '/images/fan-groups/gunners.png',
        banner: '/images/fan-groups/gunners-banner.jpg',
        founded: 2021,
        location: 'London, England',
        country: 'England',
        city: 'London',
        headquarters: 'Emirates Stadium',
        category: 'UNOFFICIAL',
        level: 'RESPECTABLE',
        isPublic: true,
        requiresApproval: false,
        maxMembers: 750,
        website: 'https://gunnerscommunity.com',
        socialLinks: {
          twitter: '@GunnersCommunity',
          instagram: 'gunnerscommunity'
        },
        tags: ['arsenal', 'football', 'community']
      }
    })
  ]);

  console.log(`✅ Created ${fanGroups.length} fan groups`);

  // Create games
  console.log('⚽ Creating games...');
  const games = await Promise.all([
    prisma.game.create({
      data: {
        homeClubId: clubs[0].id, // Man Utd
        awayClubId: clubs[1].id, // Liverpool
        competition: 'Premier League',
        season: '2024/25',
        matchday: 1,
        date: new Date('2024-08-17T15:00:00Z'),
        status: 'SCHEDULED',
        homeScore: null,
        awayScore: null,
        venue: 'Old Trafford',
        capacity: 74140,
        ticketsSold: 65000,
        isHomeGame: true,
        isDerby: true,
        isChampionship: false,
        isCup: false,
        broadcastInfo: {
          channel: 'Sky Sports',
          stream: 'sky-sports-premier-league'
        }
      }
    }),
    prisma.game.create({
      data: {
        homeClubId: clubs[2].id, // Arsenal
        awayClubId: clubs[0].id, // Man Utd
        competition: 'Premier League',
        season: '2024/25',
        matchday: 2,
        date: new Date('2024-08-24T17:30:00Z'),
        status: 'SCHEDULED',
        homeScore: null,
        awayScore: null,
        venue: 'Emirates Stadium',
        capacity: 60704,
        ticketsSold: 58000,
        isHomeGame: false,
        isDerby: false,
        isChampionship: false,
        isCup: false,
        broadcastInfo: {
          channel: 'BT Sport',
          stream: 'bt-sport-premier-league'
        }
      }
    })
  ]);

  console.log(`✅ Created ${games.length} games`);

  // Create users
  console.log('👤 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: '$2b$10$example.hash', // In real app, use proper hashing
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        avatar: '/images/avatars/john-doe.jpg',
        bio: 'Passionate football fan and Manchester United supporter',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'MALE',
        phoneNumber: '+44123456789',
        location: 'Manchester, England',
        timezone: 'Europe/London',
        language: 'en',
        socialLinks: {
          twitter: '@johndoe',
          instagram: 'johndoe'
        },
        privacySettings: {
          profileVisibility: 'PUBLIC',
          showEmail: false,
          showPhone: false
        },
        tokens: 1000,
        experience: 2500,
        level: 3,
        reputationScore: 750,
        totalCheckIns: 15,
        totalTasks: 25,
        totalBadges: 8,
        totalEvents: 5,
        totalTransactions: 12,
        totalPurchases: 3,
        totalAchievements: 2,
        pushNotifications: true,
        emailNotifications: true,
        darkMode: false,
        autoCheckIn: true,
        status: 'ACTIVE',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: '$2b$10$example.hash',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        avatar: '/images/avatars/jane-smith.jpg',
        bio: 'Liverpool FC fan and football enthusiast',
        dateOfBirth: new Date('1988-12-03'),
        gender: 'FEMALE',
        phoneNumber: '+44987654321',
        location: 'Liverpool, England',
        timezone: 'Europe/London',
        language: 'en',
        socialLinks: {
          twitter: '@janesmith',
          instagram: 'janesmith'
        },
        privacySettings: {
          profileVisibility: 'PUBLIC',
          showEmail: false,
          showPhone: false
        },
        tokens: 750,
        experience: 1800,
        level: 2,
        reputationScore: 600,
        totalCheckIns: 12,
        totalTasks: 18,
        totalBadges: 6,
        totalEvents: 3,
        totalTransactions: 8,
        totalPurchases: 2,
        totalAchievements: 1,
        pushNotifications: true,
        emailNotifications: false,
        darkMode: true,
        autoCheckIn: false,
        status: 'ACTIVE',
        role: 'USER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike.wilson@example.com',
        username: 'mikewilson',
        password: '$2b$10$example.hash',
        firstName: 'Mike',
        lastName: 'Wilson',
        displayName: 'Mike Wilson',
        avatar: '/images/avatars/mike-wilson.jpg',
        bio: 'Arsenal supporter and football analyst',
        dateOfBirth: new Date('1992-08-22'),
        gender: 'MALE',
        phoneNumber: '+44111222333',
        location: 'London, England',
        timezone: 'Europe/London',
        language: 'en',
        socialLinks: {
          twitter: '@mikewilson',
          instagram: 'mikewilson'
        },
        privacySettings: {
          profileVisibility: 'PUBLIC',
          showEmail: false,
          showPhone: false
        },
        tokens: 500,
        experience: 1200,
        level: 2,
        reputationScore: 450,
        totalCheckIns: 8,
        totalTasks: 15,
        totalBadges: 4,
        totalEvents: 2,
        totalTransactions: 6,
        totalPurchases: 1,
        totalAchievements: 1,
        pushNotifications: false,
        emailNotifications: true,
        darkMode: false,
        autoCheckIn: true,
        status: 'ACTIVE',
        role: 'USER'
      }
    })
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create club follows
  console.log('👥 Creating club follows...');
  await Promise.all([
    prisma.clubFollow.create({
      data: {
        userId: users[0].id,
        clubId: clubs[0].id, // John follows Man Utd
        followedAt: new Date('2024-01-15')
      }
    }),
    prisma.clubFollow.create({
      data: {
        userId: users[1].id,
        clubId: clubs[1].id, // Jane follows Liverpool
        followedAt: new Date('2024-02-20')
      }
    }),
    prisma.clubFollow.create({
      data: {
        userId: users[2].id,
        clubId: clubs[2].id, // Mike follows Arsenal
        followedAt: new Date('2024-03-10')
      }
    })
  ]);

  console.log('✅ Created club follows');

  // Create fan group memberships
  console.log('👥 Creating fan group memberships...');
  await Promise.all([
    prisma.fanGroupMembership.create({
      data: {
        userId: users[0].id,
        fanGroupId: fanGroups[0].id, // John joins Red Devils United
        status: 'ACTIVE',
        role: 'MEMBER',
        joinedAt: new Date('2024-01-20'),
        approvedAt: new Date('2024-01-20')
      }
    }),
    prisma.fanGroupMembership.create({
      data: {
        userId: users[1].id,
        fanGroupId: fanGroups[1].id, // Jane joins Kopites Worldwide
        status: 'ACTIVE',
        role: 'MEMBER',
        joinedAt: new Date('2024-02-25'),
        approvedAt: new Date('2024-02-26')
      }
    }),
    prisma.fanGroupMembership.create({
      data: {
        userId: users[2].id,
        fanGroupId: fanGroups[2].id, // Mike joins Gunners Community
        status: 'ACTIVE',
        role: 'MEMBER',
        joinedAt: new Date('2024-03-15'),
        approvedAt: new Date('2024-03-15')
      }
    })
  ]);

  console.log('✅ Created fan group memberships');

  // Create badges
  console.log('🏆 Creating badges...');
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'First Check-in',
        description: 'Complete your first stadium check-in',
        category: 'CHECK_IN',
        rarity: 'COMMON',
        icon: '🏟️',
        iconComponent: 'StadiumIcon',
        requirement: 'Check in to a stadium for the first time',
        maxProgress: 1,
        tokens: 50,
        experience: 100,
        isActive: true,
        isHidden: false
      }
    }),
    prisma.badge.create({
      data: {
        name: 'Task Master',
        description: 'Complete 10 tasks',
        category: 'TASK',
        rarity: 'RARE',
        icon: '✅',
        iconComponent: 'TaskIcon',
        requirement: 'Complete 10 tasks',
        maxProgress: 10,
        tokens: 200,
        experience: 500,
        isActive: true,
        isHidden: false
      }
    }),
    prisma.badge.create({
      data: {
        name: 'Event Enthusiast',
        description: 'Attend 5 events',
        category: 'EVENT',
        rarity: 'EPIC',
        icon: '🎉',
        iconComponent: 'EventIcon',
        requirement: 'Attend 5 events',
        maxProgress: 5,
        tokens: 300,
        experience: 750,
        isActive: true,
        isHidden: false
      }
    }),
    prisma.badge.create({
      data: {
        name: 'Fan Group Leader',
        description: 'Become a leader in a fan group',
        category: 'SOCIAL',
        rarity: 'LEGENDARY',
        icon: '👑',
        iconComponent: 'CrownIcon',
        requirement: 'Achieve leadership role in a fan group',
        maxProgress: 1,
        tokens: 500,
        experience: 1000,
        isActive: true,
        isHidden: false
      }
    }),
    prisma.badge.create({
      data: {
        name: 'Token Collector',
        description: 'Earn 1000 tokens',
        category: 'ECONOMY',
        rarity: 'RARE',
        icon: '💰',
        iconComponent: 'TokenIcon',
        requirement: 'Accumulate 1000 tokens',
        maxProgress: 1000,
        tokens: 100,
        experience: 250,
        isActive: true,
        isHidden: false
      }
    })
  ]);

  console.log(`✅ Created ${badges.length} badges`);

  // Create tasks
  console.log('📋 Creating tasks...');
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Check-in to Stadium',
        description: 'Check-in to your team\'s stadium during a match',
        category: 'CHECK_IN',
        type: 'ATTENDANCE',
        difficulty: 'EASY',
        requirement: 'Use the app to check-in at the stadium',
        maxProgress: 1,
        tokens: 25,
        experience: 50,
        isActive: true,
        isRecurring: true,
        recurrenceType: 'WEEKLY',
        recurrenceValue: 1,
        clubId: clubs[0].id,
        tags: ['check-in', 'stadium', 'attendance']
      }
    }),
    prisma.task.create({
      data: {
        title: 'Share Match Experience',
        description: 'Share your match day experience on social media',
        category: 'SOCIAL',
        type: 'SHARING',
        difficulty: 'MEDIUM',
        requirement: 'Post about the match with team hashtags',
        maxProgress: 1,
        tokens: 50,
        experience: 100,
        isActive: true,
        isRecurring: true,
        recurrenceType: 'WEEKLY',
        recurrenceValue: 1,
        clubId: clubs[0].id,
        tags: ['social', 'sharing', 'match']
      }
    }),
    prisma.task.create({
      data: {
        title: 'Predict Match Result',
        description: 'Make a prediction for the upcoming match',
        category: 'PREDICTION',
        type: 'FORECAST',
        difficulty: 'HARD',
        requirement: 'Correctly predict the match outcome',
        maxProgress: 1,
        tokens: 100,
        experience: 200,
        isActive: true,
        isRecurring: true,
        recurrenceType: 'WEEKLY',
        recurrenceValue: 1,
        clubId: clubs[0].id,
        tags: ['prediction', 'match', 'forecast']
      }
    })
  ]);

  console.log(`✅ Created ${tasks.length} tasks`);

  // Create events
  console.log('🎉 Creating events...');
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Pre-Match Meetup',
        description: 'Join fellow fans before the big match',
        category: 'SOCIAL',
        type: 'MEETUP',
        date: new Date('2024-08-17T12:00:00Z'),
        time: '12:00 PM',
        location: 'Old Trafford Pub',
        latitude: 53.4631,
        longitude: -2.2913,
        organizerId: fanGroups[0].id,
        organizerType: 'fan_group',
        fanGroupId: fanGroups[0].id,
        gameId: games[0].id,
        maxParticipants: 50,
        price: 0,
        currency: 'GBP',
        status: 'PUBLISHED',
        isPublic: true,
        image: '/images/events/pre-match-meetup.jpg',
        tags: ['meetup', 'pre-match', 'social']
      }
    }),
    prisma.event.create({
      data: {
        title: 'Watch Party',
        description: 'Watch the away match with fellow supporters',
        category: 'VIEWING',
        type: 'WATCH_PARTY',
        date: new Date('2024-08-24T17:00:00Z'),
        time: '5:00 PM',
        location: 'Local Sports Bar',
        latitude: 53.4631,
        longitude: -2.2913,
        organizerId: fanGroups[0].id,
        organizerType: 'fan_group',
        fanGroupId: fanGroups[0].id,
        gameId: games[1].id,
        maxParticipants: 30,
        price: 0,
        currency: 'GBP',
        status: 'PUBLISHED',
        isPublic: true,
        image: '/images/events/watch-party.jpg',
        tags: ['watch-party', 'away-match', 'viewing']
      }
    })
  ]);

  console.log(`✅ Created ${events.length} events`);

  // Create user badges
  console.log('🏆 Awarding badges to users...');
  await Promise.all([
    prisma.userBadge.create({
      data: {
        userId: users[0].id,
        badgeId: badges[0].id,
        progress: 1,
        earnedAt: new Date('2024-01-20')
      }
    }),
    prisma.userBadge.create({
      data: {
        userId: users[0].id,
        badgeId: badges[1].id,
        progress: 10,
        earnedAt: new Date('2024-02-15')
      }
    }),
    prisma.userBadge.create({
      data: {
        userId: users[1].id,
        badgeId: badges[0].id,
        progress: 1,
        earnedAt: new Date('2024-02-25')
      }
    }),
    prisma.userBadge.create({
      data: {
        userId: users[2].id,
        badgeId: badges[0].id,
        progress: 1,
        earnedAt: new Date('2024-03-15')
      }
    })
  ]);

  console.log('✅ Awarded badges to users');

  // Create user tasks
  console.log('📋 Assigning tasks to users...');
  await Promise.all([
    prisma.userTask.create({
      data: {
        userId: users[0].id,
        taskId: tasks[0].id,
        status: 'COMPLETED',
        progress: 1,
        assignedAt: new Date('2024-01-20'),
        completedAt: new Date('2024-01-21')
      }
    }),
    prisma.userTask.create({
      data: {
        userId: users[0].id,
        taskId: tasks[1].id,
        status: 'COMPLETED',
        progress: 1,
        assignedAt: new Date('2024-01-22'),
        completedAt: new Date('2024-01-23')
      }
    }),
    prisma.userTask.create({
      data: {
        userId: users[1].id,
        taskId: tasks[0].id,
        status: 'IN_PROGRESS',
        progress: 0,
        assignedAt: new Date('2024-02-25')
      }
    })
  ]);

  console.log('✅ Assigned tasks to users');

  // Create event participants
  console.log('🎉 Adding event participants...');
  await Promise.all([
    prisma.eventParticipant.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
        status: 'registered',
        registeredAt: new Date('2024-08-10')
      }
    }),
    prisma.eventParticipant.create({
      data: {
        userId: users[0].id,
        eventId: events[1].id,
        status: 'registered',
        registeredAt: new Date('2024-08-15')
      }
    })
  ]);

  console.log('✅ Added event participants');

  // Create check-ins
  console.log('📍 Creating check-ins...');
  await Promise.all([
    prisma.checkIn.create({
      data: {
        userId: users[0].id,
        gameId: games[0].id,
        type: 'STADIUM',
        status: 'CONFIRMED',
        latitude: 53.4631,
        longitude: -2.2913,
        location: 'Old Trafford',
        checkedInAt: new Date('2024-08-17T14:30:00Z'),
        verifiedAt: new Date('2024-08-17T14:31:00Z')
      }
    }),
    prisma.checkIn.create({
      data: {
        userId: users[1].id,
        gameId: games[0].id,
        type: 'STADIUM',
        status: 'CONFIRMED',
        latitude: 53.4631,
        longitude: -2.2913,
        location: 'Old Trafford',
        checkedInAt: new Date('2024-08-17T14:45:00Z'),
        verifiedAt: new Date('2024-08-17T14:46:00Z')
      }
    })
  ]);

  console.log('✅ Created check-ins');

  // Create transactions
  console.log('💰 Creating transactions...');
  await Promise.all([
    prisma.transaction.create({
      data: {
        userId: users[0].id,
        type: 'EARNED',
        status: 'COMPLETED',
        amount: 50,
        balanceBefore: 950,
        balanceAfter: 1000,
        description: 'Earned tokens for completing task',
        processedAt: new Date('2024-01-21T10:00:00Z')
      }
    }),
    prisma.transaction.create({
      data: {
        userId: users[0].id,
        type: 'EARNED',
        status: 'COMPLETED',
        amount: 100,
        balanceBefore: 1000,
        balanceAfter: 1100,
        description: 'Earned tokens for badge achievement',
        processedAt: new Date('2024-02-15T14:30:00Z')
      }
    })
  ]);

  console.log('✅ Created transactions');

  // Create social stats
  console.log('📊 Creating social stats...');
  await Promise.all([
    prisma.socialStats.create({
      data: {
        userId: users[0].id,
        followers: 1250,
        following: 890,
        posts: 156,
        likes: 3420,
        comments: 890,
        shares: 234,
        views: 15600,
        engagementRate: 2.8,
        reach: 8900,
        impressions: 12400,
        lastUpdated: new Date()
      }
    }),
    prisma.socialStats.create({
      data: {
        userId: users[1].id,
        followers: 890,
        following: 567,
        posts: 98,
        likes: 2100,
        comments: 456,
        shares: 123,
        views: 8900,
        engagementRate: 3.1,
        reach: 5600,
        impressions: 7800,
        lastUpdated: new Date()
      }
    }),
    prisma.socialStats.create({
      data: {
        userId: users[2].id,
        followers: 567,
        following: 234,
        posts: 67,
        likes: 1200,
        comments: 234,
        shares: 78,
        views: 4500,
        engagementRate: 2.6,
        reach: 3400,
        impressions: 4800,
        lastUpdated: new Date()
      }
    })
  ]);

  console.log('✅ Created social stats');

  // Create notifications
  console.log('🔔 Creating notifications...');
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'TASK',
        category: 'REWARD',
        title: 'Task Completed!',
        message: 'Great job! You\'ve completed "Check-in to Stadium" and earned 25 tokens.',
        data: { taskTitle: 'Check-in to Stadium', tokens: 25, experience: 50 },
        priority: 'NORMAL',
        isRead: false
      }
    }),
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'BADGE',
        category: 'REWARD',
        title: 'Badge Earned!',
        message: 'Congratulations! You\'ve earned the "First Check-in" badge!',
        data: { badgeName: 'First Check-in', rarity: 'COMMON' },
        priority: 'HIGH',
        isRead: false
      }
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: 'EVENT',
        category: 'REMINDER',
        title: 'Event Reminder',
        message: 'Don\'t forget! "Pre-Match Meetup" is happening tomorrow.',
        data: { eventTitle: 'Pre-Match Meetup', eventDate: '2024-08-17' },
        priority: 'NORMAL',
        isRead: false
      }
    })
  ]);

  console.log('✅ Created notifications');

  // Create reputation history
  console.log('⭐ Creating reputation history...');
  await Promise.all([
    prisma.reputationHistory.create({
      data: {
        userId: users[0].id,
        action: 'POSITIVE',
        category: 'ENGAGEMENT',
        points: 50,
        reason: 'Completed first check-in',
        description: 'Positive reputation points for completing first check-in'
      }
    }),
    prisma.reputationHistory.create({
      data: {
        userId: users[0].id,
        action: 'POSITIVE',
        category: 'ACHIEVEMENT',
        points: 100,
        reason: 'Earned first badge',
        description: 'Positive reputation points for earning first badge'
      }
    })
  ]);

  console.log('✅ Created reputation history');

  // Create achievements
  console.log('🏅 Creating achievements...');
  await Promise.all([
    prisma.achievement.create({
      data: {
        userId: users[0].id,
        type: 'FIRST_CHECK_IN',
        title: 'First Check-in',
        description: 'Completed your first stadium check-in',
        icon: '🏟️',
        tokens: 50,
        experience: 100,
        earnedAt: new Date('2024-01-20')
      }
    }),
    prisma.achievement.create({
      data: {
        userId: users[0].id,
        type: 'TASK_MASTER',
        title: 'Task Master',
        description: 'Completed 10 tasks',
        icon: '✅',
        tokens: 200,
        experience: 500,
        earnedAt: new Date('2024-02-15')
      }
    })
  ]);

  console.log('✅ Created achievements');

  // Create purchases
  console.log('🛒 Creating purchases...');
  await Promise.all([
    prisma.purchase.create({
      data: {
        userId: users[0].id,
        itemType: 'MERCHANDISE',
        itemName: 'Team Jersey',
        itemId: 'jersey-001',
        quantity: 1,
        price: 75.00,
        currency: 'GBP',
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        transactionId: 'txn_123456789',
        purchasedAt: new Date('2024-01-25T15:30:00Z')
      }
    }),
    prisma.purchase.create({
      data: {
        userId: users[1].id,
        itemType: 'TICKET',
        itemName: 'Match Ticket',
        itemId: 'ticket-001',
        quantity: 1,
        price: 45.00,
        currency: 'GBP',
        status: 'COMPLETED',
        paymentMethod: 'DEBIT_CARD',
        transactionId: 'txn_987654321',
        purchasedAt: new Date('2024-02-10T12:15:00Z')
      }
    })
  ]);

  console.log('✅ Created purchases');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${clubs.length} clubs created`);
  console.log(`- ${fanGroups.length} fan groups created`);
  console.log(`- ${games.length} games created`);
  console.log(`- ${users.length} users created`);
  console.log(`- ${badges.length} badges created`);
  console.log(`- ${tasks.length} tasks created`);
  console.log(`- ${events.length} events created`);
  console.log('- Club follows, fan group memberships, and other relationships created');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 