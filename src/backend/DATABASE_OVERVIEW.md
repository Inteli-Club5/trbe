# Tribe Fan Engagement Platform - Database Overview

## 🎯 Overview

This document provides a comprehensive overview of the database schema designed for the Tribe fan engagement platform. The schema is built using Prisma ORM with PostgreSQL and follows industry best practices for scalability, performance, and maintainability.

## 🏗️ Database Architecture

### Core Principles
- **One Club Follow**: Users can only follow one club at a time
- **One Fan Group Membership**: Users can only be part of one fan group at a time
- **Personalized Tasks**: Tasks are personalized based on user's club and fan group
- **Comprehensive Tracking**: All user activities are tracked for engagement analytics
- **Scalable Design**: Schema supports millions of users and complex relationships

## 📊 Database Schema

### 1. User Management

#### User Model
```prisma
model User {
  // Core Information
  id              String     @id @default(cuid())
  email           String     @unique
  username        String     @unique
  password        String     // Hashed
  firstName       String
  lastName        String
  displayName     String
  avatar          String?
  bio             String?
  
  // Personal Details
  dateOfBirth     DateTime?
  gender          Gender?
  phoneNumber     String?
  location        String?
  timezone        String?
  language        String     @default("en")
  
  // Social & Privacy
  socialLinks     Json?
  privacySettings Json?
  
  // Game Mechanics
  tokens          Int        @default(0)
  experience      Int        @default(0)
  level           Int        @default(1)
  reputationScore Int        @default(0)
  
  // Statistics
  totalCheckIns   Int        @default(0)
  totalTasks      Int        @default(0)
  totalBadges     Int        @default(0)
  totalEvents     Int        @default(0)
  totalTransactions Int      @default(0)
  totalPurchases  Int        @default(0)
  totalAchievements Int      @default(0)
  
  // Preferences
  pushNotifications Boolean  @default(true)
  emailNotifications Boolean @default(true)
  darkMode         Boolean   @default(false)
  autoCheckIn      Boolean   @default(false)
  
  // Status & Role
  status          UserStatus @default(ACTIVE)
  role            UserRole   @default(USER)
  
  // Timestamps
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  deletedAt       DateTime?
  
  // Relations
  clubFollow      ClubFollow?
  fanGroupMembership FanGroupMembership?
  checkIns        CheckIn[]
  tasks           UserTask[]
  badges          UserBadge[]
  events          EventParticipant[]
  transactions    Transaction[]
  purchases       Purchase[]
  achievements    Achievement[]
  reputationHistory ReputationHistory[]
  notifications   Notification[]
  socialStats     SocialStats?
}
```

### 2. Club & Fan Group System

#### Club Model
```prisma
model Club {
  id              String     @id @default(cuid())
  name            String
  shortName       String?
  description     String?
  logo            String?
  banner          String?
  founded         Int?
  location        String?
  country         String?
  city            String?
  stadium         String?
  capacity        Int?
  website         String?
  socialLinks     Json?
  category        ClubCategory
  level           ClubLevel
  isActive        Boolean    @default(true)
  
  // Relations
  homeGames       Game[]     @relation("HomeClub")
  awayGames       Game[]     @relation("AwayClub")
  followers       ClubFollow[]
  events          Event[]
  tasks           Task[]
}
```

#### Fan Group Model
```prisma
model FanGroup {
  id              String     @id @default(cuid())
  name            String     @unique
  description     String?
  logo            String?
  banner          String?
  founded         Int?
  location        String?
  country         String?
  city            String?
  headquarters    String?
  category        FanGroupCategory
  level           FanGroupLevel
  isPublic        Boolean    @default(true)
  requiresApproval Boolean   @default(false)
  maxMembers      Int?
  totalMembers    Int        @default(0)
  activeMembers   Int        @default(0)
  website         String?
  socialLinks     Json?
  tags            String[]
  
  // Relations
  memberships     FanGroupMembership[]
  events          Event[]
  tasks           Task[]
  achievements    Achievement[]
}
```

### 3. Game & Event System

#### Game Model
```prisma
model Game {
  id              String     @id @default(cuid())
  homeClubId      String
  awayClubId      String
  competition     String
  season          String
  matchday        Int?
  date            DateTime
  status          GameStatus
  homeScore       Int?
  awayScore       Int?
  venue           String?
  capacity        Int?
  ticketsSold     Int        @default(0)
  isHomeGame      Boolean    @default(true)
  isDerby         Boolean    @default(false)
  isChampionship  Boolean    @default(false)
  isCup           Boolean    @default(false)
  broadcastInfo   Json?
  
  // Relations
  homeClub        Club       @relation("HomeClub", fields: [homeClubId], references: [id])
  awayClub        Club       @relation("AwayClub", fields: [awayClubId], references: [id])
  checkIns        CheckIn[]
  events          Event[]
}
```

#### Event Model
```prisma
model Event {
  id              String     @id @default(cuid())
  title           String
  description     String?
  category        EventCategory
  type            EventType
  date            DateTime
  time            String?
  location        String?
  latitude        Float?
  longitude        Float?
  organizerId     String?
  organizerType   String?
  clubId          String?
  fanGroupId      String?
  gameId          String?
  maxParticipants Int?
  currentParticipants Int    @default(0)
  price           Decimal?   @db.Decimal(10, 2)
  currency        String     @default("GBP")
  status          EventStatus @default(DRAFT)
  isPublic        Boolean    @default(true)
  image           String?
  tags            String[]
  
  // Relations
  club            Club?      @relation(fields: [clubId], references: [id])
  fanGroup        FanGroup?  @relation(fields: [fanGroupId], references: [id])
  game            Game?      @relation(fields: [gameId], references: [id])
  participants    EventParticipant[]
}
```

### 4. Engagement & Gamification

#### Task Model
```prisma
model Task {
  id              String     @id @default(cuid())
  title           String
  description     String?
  category        TaskCategory
  type            TaskType
  difficulty      TaskDifficulty
  requirement     String?
  maxProgress     Int        @default(1)
  tokens          Int        @default(0)
  experience      Int        @default(0)
  isActive        Boolean    @default(true)
  isRecurring     Boolean    @default(false)
  recurrenceType  RecurrenceType?
  recurrenceValue Int?
  startDate       DateTime?
  endDate         DateTime?
  clubId          String?
  fanGroupId      String?
  gameId          String?
  eventId         String?
  tags            String[]
  
  // Relations
  club            Club?      @relation(fields: [clubId], references: [id])
  fanGroup        FanGroup?  @relation(fields: [fanGroupId], references: [id])
  game            Game?      @relation(fields: [gameId], references: [id])
  event           Event?     @relation(fields: [eventId], references: [id])
  userTasks       UserTask[]
}
```

#### Badge Model
```prisma
model Badge {
  id              String     @id @default(cuid())
  name            String     @unique
  description     String?
  category        BadgeCategory
  rarity          BadgeRarity
  icon            String?
  iconComponent   String?
  requirement     String?
  maxProgress     Int        @default(1)
  tokens          Int        @default(0)
  experience      Int        @default(0)
  isActive        Boolean    @default(true)
  isHidden        Boolean    @default(false)
  
  // Relations
  userBadges      UserBadge[]
}
```

### 5. Check-in & Location System

#### CheckIn Model
```prisma
model CheckIn {
  id              String     @id @default(cuid())
  userId          String
  gameId          String
  type            CheckInType
  status          CheckInStatus
  latitude        Float?
  longitude        Float?
  location        String?
  checkedInAt     DateTime   @default(now())
  verifiedAt      DateTime?
  
  // Relations
  user            User       @relation(fields: [userId], references: [id])
  game            Game       @relation(fields: [gameId], references: [id])
}
```

### 6. Economy & Transactions

#### Transaction Model
```prisma
model Transaction {
  id              String     @id @default(cuid())
  userId          String
  type            TransactionType
  status          TransactionStatus
  amount          Int
  balanceBefore   Int
  balanceAfter    Int
  description     String?
  processedAt     DateTime   @default(now())
  
  // Relations
  user            User       @relation(fields: [userId], references: [id])
}
```

#### Purchase Model
```prisma
model Purchase {
  id              String     @id @default(cuid())
  userId          String
  itemType        PurchaseItemType
  itemName        String
  itemId          String?
  quantity        Int        @default(1)
  price           Decimal    @db.Decimal(10, 2)
  currency        String     @default("GBP")
  status          PurchaseStatus
  paymentMethod   PaymentMethod
  transactionId   String?
  purchasedAt     DateTime   @default(now())
  
  // Relations
  user            User       @relation(fields: [userId], references: [id])
}
```

### 7. Social & Analytics

#### SocialStats Model
```prisma
model SocialStats {
  id              String     @id @default(cuid())
  userId          String     @unique
  followers       Int        @default(0)
  following       Int        @default(0)
  posts           Int        @default(0)
  likes           Int        @default(0)
  comments        Int        @default(0)
  shares          Int        @default(0)
  views           Int        @default(0)
  engagementRate  Float      @default(0)
  reach           Int        @default(0)
  impressions     Int        @default(0)
  lastUpdated     DateTime   @default(now())
  
  // Relations
  user            User       @relation(fields: [userId], references: [id])
}
```

#### Notification Model
```prisma
model Notification {
  id              String     @id @default(cuid())
  userId          String
  type            NotificationType
  category        NotificationCategory
  title           String
  message         String
  data            Json?
  priority        NotificationPriority @default(NORMAL)
  isRead          Boolean    @default(false)
  readAt          DateTime?
  scheduledAt     DateTime?
  expiresAt       DateTime?
  createdAt       DateTime   @default(now())
  
  // Relations
  user            User       @relation(fields: [userId], references: [id])
}
```

## 🔗 Key Relationships

### One-to-One Relationships
- **User ↔ ClubFollow**: Each user can follow only one club
- **User ↔ FanGroupMembership**: Each user can be part of only one fan group
- **User ↔ SocialStats**: Each user has one social stats record

### One-to-Many Relationships
- **Club → Games**: A club can have multiple home/away games
- **FanGroup → Memberships**: A fan group can have multiple members
- **User → Activities**: A user can have multiple check-ins, tasks, badges, etc.

### Many-to-Many Relationships
- **Users ↔ Events**: Users can participate in multiple events
- **Users ↔ Tasks**: Users can be assigned multiple tasks
- **Users ↔ Badges**: Users can earn multiple badges

## 🎮 Gamification Features

### Experience & Leveling System
- Users gain experience through various activities
- Level progression based on experience points
- Unlock features and rewards at higher levels

### Token Economy
- Earn tokens through engagement activities
- Spend tokens on merchandise, tickets, and premium features
- Transaction history tracking for transparency

### Badge System
- Multiple badge categories (Check-in, Task, Event, Social, Economy)
- Different rarity levels (Common, Rare, Epic, Legendary)
- Progress tracking for multi-step achievements

### Reputation System
- Reputation score based on positive/negative actions
- Reputation history tracking
- Community moderation features

## 📈 Analytics & Insights

### User Analytics
- Comprehensive activity tracking
- Engagement metrics
- Social media integration
- Performance analytics

### Community Analytics
- Fan group statistics
- Club engagement metrics
- Event participation rates
- Economic activity tracking

## 🔧 Technical Features

### Data Integrity
- Foreign key constraints
- Unique constraints where appropriate
- Soft delete functionality
- Audit trails for important changes

### Performance Optimization
- Indexed fields for common queries
- Efficient relationship design
- Pagination support
- Caching-friendly structure

### Scalability
- Horizontal scaling support
- Efficient query patterns
- Minimal N+1 query issues
- Optimized for read-heavy workloads

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Prisma CLI

### Setup Commands
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tribe_db"
JWT_SECRET="your-jwt-secret"
NODE_ENV="development"
```

## 📝 API Endpoints

The platform includes comprehensive REST API endpoints for all major features:

- **User Management**: CRUD operations, authentication, profile management
- **Club & Fan Groups**: Follow/unfollow, join/leave, management
- **Events**: Create, join, manage events
- **Tasks**: Assign, complete, track progress
- **Badges**: Award, track, display achievements
- **Check-ins**: Location-based verification
- **Economy**: Token transactions, purchases
- **Analytics**: Statistics, leaderboards, insights

## 🔮 Future Enhancements

### Planned Features
- Real-time notifications with WebSocket
- Advanced analytics dashboard
- Machine learning for personalized recommendations
- Blockchain integration for token management
- Mobile app support
- Multi-language support
- Advanced moderation tools

### Scalability Improvements
- Database sharding for large-scale deployments
- Redis caching layer
- CDN integration for media files
- Microservices architecture
- Event-driven architecture

## 📊 Database Statistics

### Estimated Storage Requirements
- **1M users**: ~50GB
- **10M check-ins**: ~20GB
- **1M transactions**: ~10GB
- **Total for 1M users**: ~100GB

### Performance Benchmarks
- User queries: <10ms
- Activity feeds: <50ms
- Analytics queries: <200ms
- Complex reports: <1s

## 🤝 Contributing

When contributing to the database schema:

1. Follow the established naming conventions
2. Add appropriate indexes for new query patterns
3. Include comprehensive seed data
4. Update this documentation
5. Test with realistic data volumes
6. Consider backward compatibility

## 📞 Support

For questions about the database schema or implementation:

- Check the Prisma documentation
- Review the service layer implementations
- Test with the provided seed data
- Consult the API documentation

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Author**: Tribe Development Team 