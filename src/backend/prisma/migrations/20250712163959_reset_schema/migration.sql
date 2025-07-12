-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "CheckInType" AS ENUM ('STADIUM', 'HOME', 'AWAY');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('PRESENCE', 'SOCIAL', 'PURCHASE', 'ENGAGEMENT', 'COMMUNITY', 'SPECIAL');

-- CreateEnum
CREATE TYPE "TaskDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('AVAILABLE', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'FAILED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL', 'ONE_TIME', 'RECURRING');

-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('ATTENDANCE', 'SOCIAL', 'SHOPPING', 'ENGAGEMENT', 'SPECIAL', 'COMMUNITY', 'REPUTATION', 'LEADERSHIP');

-- CreateEnum
CREATE TYPE "BadgeRarity" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'LEGENDARY', 'MYTHIC');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('TRAVEL', 'SOCIAL', 'CHARITY', 'OFFICIAL', 'COMMUNITY', 'SPORTS', 'CULTURAL');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'OPEN', 'FULL', 'CANCELLED', 'FINISHED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('MATCH_DAY', 'MEETUP', 'CHARITY', 'TRAINING', 'TOURNAMENT', 'CELEBRATION', 'AWAY_TRIP');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GAME', 'REWARD', 'SOCIAL', 'CHALLENGE', 'WARNING', 'SYSTEM', 'EVENT', 'BADGE', 'TASK', 'REPUTATION');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARNED', 'SPENT', 'TRANSFERRED', 'REFUNDED', 'BONUS', 'PENALTY');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReputationAction" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "ReputationCategory" AS ENUM ('ATTENDANCE', 'COMMUNITY', 'BEHAVIOR', 'ENGAGEMENT', 'LEADERSHIP', 'ACCIDENT');

-- CreateEnum
CREATE TYPE "ClubCategory" AS ENUM ('ELITE', 'PREMIUM', 'STANDARD', 'DEVELOPING');

-- CreateEnum
CREATE TYPE "ClubLevel" AS ENUM ('EXEMPLARY', 'COMMENDABLE', 'RESPECTABLE', 'NEEDS_WORK', 'DISHONORABLE');

-- CreateEnum
CREATE TYPE "FanGroupCategory" AS ENUM ('OFFICIAL', 'UNOFFICIAL', 'COMMUNITY', 'REGIONAL', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "FanGroupLevel" AS ENUM ('EXEMPLARY', 'COMMENDABLE', 'RESPECTABLE', 'NEEDS_WORK', 'DISHONORABLE');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('MEMBER', 'MODERATOR', 'LEADER', 'FOUNDER');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('HOME', 'AWAY', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "ChampionshipType" AS ENUM ('PREMIER_LEAGUE', 'FA_CUP', 'CARABAO_CUP', 'CHAMPIONS_LEAGUE', 'EUROPA_LEAGUE', 'FRIENDLY', 'OTHER');

-- CreateEnum
CREATE TYPE "PurchaseCategory" AS ENUM ('MERCHANDISE', 'TICKETS', 'EXPERIENCE', 'DISCOUNT', 'DONATION', 'SUBSCRIPTION');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "phoneNumber" TEXT,
    "location" TEXT,
    "timezone" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "twitterId" TEXT,
    "walletAddress" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "dataProcessingAccepted" BOOLEAN NOT NULL DEFAULT false,
    "privacyPolicyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "lockedTokens" INTEGER NOT NULL DEFAULT 0,
    "reputationScore" INTEGER NOT NULL DEFAULT 500,
    "rankingPosition" INTEGER,
    "totalCheckIns" INTEGER NOT NULL DEFAULT 0,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "totalBadges" INTEGER NOT NULL DEFAULT 0,
    "totalPurchases" INTEGER NOT NULL DEFAULT 0,
    "totalSocialShares" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "autoCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "privacySettings" JSONB,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "nickname" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "founded" INTEGER,
    "location" TEXT,
    "country" TEXT,
    "city" TEXT,
    "stadium" TEXT,
    "capacity" INTEGER,
    "category" "ClubCategory" NOT NULL DEFAULT 'STANDARD',
    "level" "ClubLevel" NOT NULL DEFAULT 'RESPECTABLE',
    "totalFans" INTEGER NOT NULL DEFAULT 0,
    "activeFans" INTEGER NOT NULL DEFAULT 0,
    "totalTrophies" INTEGER NOT NULL DEFAULT 0,
    "totalMatches" INTEGER NOT NULL DEFAULT 0,
    "website" TEXT,
    "socialLinks" JSONB,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_follows" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fan_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "founded" INTEGER,
    "location" TEXT,
    "country" TEXT,
    "city" TEXT,
    "headquarters" TEXT,
    "category" "FanGroupCategory" NOT NULL DEFAULT 'UNOFFICIAL',
    "level" "FanGroupLevel" NOT NULL DEFAULT 'RESPECTABLE',
    "totalMembers" INTEGER NOT NULL DEFAULT 0,
    "activeMembers" INTEGER NOT NULL DEFAULT 0,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "rankingPosition" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "maxMembers" INTEGER,
    "website" TEXT,
    "socialLinks" JSONB,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "fan_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fan_group_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fanGroupId" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
    "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "fan_group_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "stadium" TEXT,
    "championship" "ChampionshipType" NOT NULL,
    "type" "GameType" NOT NULL DEFAULT 'HOME',
    "status" "GameStatus" NOT NULL DEFAULT 'SCHEDULED',
    "description" TEXT,
    "highlights" TEXT,
    "attendance" INTEGER,
    "weather" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT,
    "type" "CheckInType" NOT NULL,
    "status" "CheckInStatus" NOT NULL DEFAULT 'PENDING',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "location" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "photo" TEXT,
    "comment" TEXT,
    "prediction" JSONB,
    "baseTokens" INTEGER NOT NULL DEFAULT 0,
    "bonusTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "TaskCategory" NOT NULL,
    "difficulty" "TaskDifficulty" NOT NULL,
    "type" "TaskType" NOT NULL,
    "maxProgress" INTEGER NOT NULL DEFAULT 1,
    "timeLimit" INTEGER,
    "deadline" TIMESTAMP(3),
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "reputationPoints" INTEGER NOT NULL DEFAULT 0,
    "clubId" TEXT,
    "fanGroupId" TEXT,
    "userLevel" INTEGER,
    "userReputation" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isRepeatable" BOOLEAN NOT NULL DEFAULT false,
    "maxCompletions" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tasks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'AVAILABLE',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "BadgeCategory" NOT NULL,
    "rarity" "BadgeRarity" NOT NULL,
    "icon" TEXT,
    "iconComponent" TEXT,
    "requirement" TEXT,
    "maxProgress" INTEGER NOT NULL DEFAULT 1,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "EventCategory" NOT NULL,
    "type" "EventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "organizerId" TEXT,
    "organizerType" TEXT,
    "clubId" TEXT,
    "fanGroupId" TEXT,
    "gameId" TEXT,
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_participants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "attendedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelledReason" TEXT,

    CONSTRAINT "event_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "relatedId" TEXT,
    "relatedType" TEXT,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "relatedId" TEXT,
    "relatedType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failedReason" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "PurchaseCategory" NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "itemName" TEXT NOT NULL,
    "itemDescription" TEXT,
    "itemImage" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GBP',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "tokensSpent" INTEGER NOT NULL DEFAULT 0,
    "tokensEarned" INTEGER NOT NULL DEFAULT 0,
    "shippingAddress" JSONB,
    "trackingNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelledReason" TEXT,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twitterFollowers" INTEGER NOT NULL DEFAULT 0,
    "instagramFollowers" INTEGER NOT NULL DEFAULT 0,
    "facebookFollowers" INTEGER NOT NULL DEFAULT 0,
    "youtubeSubscribers" INTEGER NOT NULL DEFAULT 0,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalShares" INTEGER NOT NULL DEFAULT 0,
    "totalComments" INTEGER NOT NULL DEFAULT 0,
    "twitterPosts" INTEGER NOT NULL DEFAULT 0,
    "instagramPosts" INTEGER NOT NULL DEFAULT 0,
    "facebookPosts" INTEGER NOT NULL DEFAULT 0,
    "youtubeVideos" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reputation_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ReputationAction" NOT NULL,
    "category" "ReputationCategory" NOT NULL,
    "points" INTEGER NOT NULL,
    "reason" TEXT,
    "description" TEXT,
    "relatedId" TEXT,
    "relatedType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reputation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "category" TEXT,
    "rarity" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_achievements" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "category" TEXT,
    "year" INTEGER,
    "competition" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fan_group_achievements" (
    "id" TEXT NOT NULL,
    "fanGroupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "category" TEXT,
    "year" INTEGER,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fan_group_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_twitterId_key" ON "users"("twitterId");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_name_key" ON "clubs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "club_follows_userId_key" ON "club_follows"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "fan_groups_name_key" ON "fan_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "fan_group_memberships_userId_key" ON "fan_group_memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_tasks_userId_taskId_key" ON "user_tasks"("userId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "event_participants_userId_eventId_key" ON "event_participants"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "social_stats_userId_key" ON "social_stats"("userId");

-- AddForeignKey
ALTER TABLE "club_follows" ADD CONSTRAINT "club_follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_follows" ADD CONSTRAINT "club_follows_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fan_group_memberships" ADD CONSTRAINT "fan_group_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fan_group_memberships" ADD CONSTRAINT "fan_group_memberships_fanGroupId_fkey" FOREIGN KEY ("fanGroupId") REFERENCES "fan_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_fanGroupId_fkey" FOREIGN KEY ("fanGroupId") REFERENCES "fan_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_stats" ADD CONSTRAINT "social_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reputation_history" ADD CONSTRAINT "reputation_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_achievements" ADD CONSTRAINT "club_achievements_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fan_group_achievements" ADD CONSTRAINT "fan_group_achievements_fanGroupId_fkey" FOREIGN KEY ("fanGroupId") REFERENCES "fan_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
