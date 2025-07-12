# Fan Engagement Platform API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints Overview

### 1. Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system health information

### 2. Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password
- `POST /auth/avatar` - Upload avatar
- `DELETE /auth/account` - Delete account

### 3. Users (`/users`)
- `GET /users` - Get all users with pagination
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user (admin only)
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/:id/stats` - Get user statistics
- `GET /users/:id/ranking` - Get user ranking
- `GET /users/:id/activity` - Get user activity
- `POST /users/:id/follow-club` - Follow a club
- `DELETE /users/:id/follow-club` - Unfollow a club
- `POST /users/:id/join-fan-group` - Join a fan group
- `DELETE /users/:id/leave-fan-group` - Leave a fan group
- `POST /users/:id/tokens` - Add tokens to user
- `POST /users/:id/experience` - Add experience to user
- `POST /users/:id/reputation` - Update user reputation
- `GET /users/search/:query` - Search users
- `GET /users/leaderboard/tokens` - Get tokens leaderboard
- `GET /users/leaderboard/reputation` - Get reputation leaderboard

### 4. Clubs (`/clubs`)
- `GET /clubs` - Get all clubs with filtering
- `GET /clubs/:id` - Get club by ID with related data
- `POST /clubs` - Create club
- `PUT /clubs/:id` - Update club
- `DELETE /clubs/:id` - Delete club
- `POST /clubs/:id/follow` - Follow club
- `DELETE /clubs/:id/follow` - Unfollow club
- `GET /clubs/:id/followers` - Get club followers
- `GET /clubs/:id/games` - Get club games
- `GET /clubs/:id/events` - Get club events
- `GET /clubs/:id/achievements` - Get club achievements

### 5. Fan Groups (`/fan-groups`)
- `GET /fan-groups` - Get all fan groups with filtering
- `GET /fan-groups/:id` - Get fan group by ID with memberships
- `POST /fan-groups` - Create fan group
- `PUT /fan-groups/:id` - Update fan group
- `DELETE /fan-groups/:id` - Delete fan group
- `POST /fan-groups/:id/join` - Join fan group
- `DELETE /fan-groups/:id/leave` - Leave fan group
- `GET /fan-groups/:id/members` - Get fan group members
- `POST /fan-groups/:id/members/:userId/approve` - Approve member
- `POST /fan-groups/:id/members/:userId/reject` - Reject member
- `PUT /fan-groups/:id/members/:userId/role` - Update member role
- `GET /fan-groups/:id/events` - Get fan group events
- `GET /fan-groups/:id/achievements` - Get fan group achievements

### 6. Events (`/events`)
- `GET /events` - Get all events with filtering
- `GET /events/:id` - Get event by ID with related data
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `POST /events/:id/register` - Register for event
- `DELETE /events/:id/register` - Unregister from event
- `POST /events/:id/confirm-attendance` - Confirm attendance
- `GET /events/:id/participants` - Get event participants

### 7. Tasks (`/tasks`)
- `GET /tasks` - Get all tasks with filtering
- `GET /tasks/:id` - Get task by ID with user tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/user/tasks` - Get user's tasks
- `GET /tasks/user/available` - Get available tasks for user
- `POST /tasks/:id/start` - Start task
- `PUT /tasks/:id/progress` - Update task progress
- `GET /tasks/user/completed` - Get completed tasks
- `GET /tasks/user/stats` - Get user task statistics

### 8. Badges (`/badges`)
- `GET /badges` - Get all badges with filtering
- `GET /badges/:id` - Get badge by ID with user badges
- `POST /badges` - Create badge
- `PUT /badges/:id` - Update badge
- `DELETE /badges/:id` - Delete badge
- `GET /badges/user/badges` - Get user's badges
- `GET /badges/user/available` - Get available badges for user
- `POST /badges/:id/award` - Award badge to user
- `PUT /badges/:id/progress` - Update badge progress
- `GET /badges/user/stats` - Get user badge statistics
- `GET /badges/popular/:limit?` - Get most popular badges
- `GET /badges/rarest/:limit?` - Get rarest badges

### 9. Check-ins (`/check-ins`)
- `GET /check-ins` - Get all check-ins
- `GET /check-ins/:id` - Get check-in by ID
- `POST /check-ins` - Create check-in
- `PUT /check-ins/:id` - Update check-in
- `DELETE /check-ins/:id` - Delete check-in
- `GET /check-ins/user/check-ins` - Get user's check-ins
- `GET /check-ins/user/stats` - Get user check-in statistics
- `GET /check-ins/game/:gameId` - Get game check-ins

### 10. Games (`/games`)
- `GET /games` - Get all games with filtering
- `GET /games/:id` - Get game by ID with related data
- `POST /games` - Create game
- `PUT /games/:id` - Update game
- `DELETE /games/:id` - Delete game
- `GET /games/club/:clubId` - Get games by club
- `GET /games/upcoming/:limit?` - Get upcoming games
- `GET /games/recent/:limit?` - Get recent games

### 11. Notifications (`/notifications`)
- `GET /notifications` - Get user's notifications
- `GET /notifications/:id` - Get notification by ID
- `POST /notifications` - Create notification (admin only)
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all notifications as read
- `DELETE /notifications/:id` - Delete notification
- `GET /notifications/unread/count` - Get unread count
- `GET /notifications/type/:type` - Get notifications by type
- `GET /notifications/recent/:limit?` - Get recent notifications
- `DELETE /notifications/bulk/delete` - Bulk delete notifications
- `PUT /notifications/bulk/read` - Bulk mark as read

### 12. Transactions (`/transactions`)
- `GET /transactions` - Get user's transactions
- `GET /transactions/:id` - Get transaction by ID
- `POST /transactions` - Create transaction
- `GET /transactions/stats/summary` - Get transaction statistics
- `GET /transactions/type/:type` - Get transactions by type
- `GET /transactions/recent/:limit?` - Get recent transactions
- `GET /transactions/history/period` - Get transaction history
- `GET /transactions/analytics` - Get transaction analytics

## Common Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10-20 depending on endpoint)

### Filtering
- `search` - Search term
- `status` - Filter by status
- `type` - Filter by type
- `category` - Filter by category
- `dateFrom` - Start date
- `dateTo` - End date

### Sorting
Most endpoints return data sorted by creation date (newest first) or relevance.

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "John Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "phoneNumber": "+1234567890",
  "location": "London, UK",
  "walletAddress": "0x..."
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "displayName": "string",
  "avatar": "string",
  "status": "ACTIVE|SUSPENDED|BANNED|PENDING_VERIFICATION",
  "role": "USER|MODERATOR|ADMIN|SUPER_ADMIN",
  "level": 1,
  "experience": 0,
  "tokens": 0,
  "reputationScore": 500,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Club
```json
{
  "id": "string",
  "name": "string",
  "shortName": "string",
  "nickname": "string",
  "description": "string",
  "logo": "string",
  "banner": "string",
  "founded": 1886,
  "location": "string",
  "country": "string",
  "city": "string",
  "stadium": "string",
  "capacity": 60000,
  "category": "ELITE|PREMIUM|STANDARD|DEVELOPING",
  "level": "EXEMPLARY|COMMENDABLE|RESPECTABLE|NEEDS_WORK|DISHONORABLE",
  "totalFans": 0,
  "activeFans": 0,
  "totalTrophies": 0,
  "totalMatches": 0,
  "website": "string",
  "socialLinks": {},
  "tags": ["string"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Event
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "TRAVEL|SOCIAL|CHARITY|OFFICIAL|COMMUNITY|SPORTS|CULTURAL",
  "type": "MATCH_DAY|MEETUP|CHARITY|TRAINING|TOURNAMENT|CELEBRATION|AWAY_TRIP",
  "date": "2024-01-01T00:00:00Z",
  "time": "string",
  "location": "string",
  "latitude": 0.0,
  "longitude": 0.0,
  "organizerId": "string",
  "organizerType": "club|fan_group|user",
  "clubId": "string",
  "fanGroupId": "string",
  "gameId": "string",
  "maxParticipants": 100,
  "currentParticipants": 0,
  "price": "10.00",
  "currency": "GBP",
  "status": "DRAFT|PUBLISHED|OPEN|FULL|CANCELLED|FINISHED",
  "isPublic": true,
  "image": "string",
  "tags": ["string"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Task
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "PRESENCE|SOCIAL|PURCHASE|ENGAGEMENT|COMMUNITY|SPECIAL",
  "difficulty": "EASY|MEDIUM|HARD|EXPERT",
  "type": "DAILY|WEEKLY|MONTHLY|SEASONAL|ONE_TIME|RECURRING",
  "maxProgress": 1,
  "timeLimit": 60,
  "deadline": "2024-01-01T00:00:00Z",
  "tokens": 0,
  "experience": 0,
  "reputationPoints": 0,
  "clubId": "string",
  "fanGroupId": "string",
  "userLevel": 1,
  "userReputation": 500,
  "isActive": true,
  "isRepeatable": false,
  "maxCompletions": 1,
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-01-01T00:00:00Z"
}
```

### Badge
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "ATTENDANCE|SOCIAL|SHOPPING|ENGAGEMENT|SPECIAL|COMMUNITY|REPUTATION|LEADERSHIP",
  "rarity": "BRONZE|SILVER|GOLD|PLATINUM|LEGENDARY|MYTHIC",
  "icon": "string",
  "iconComponent": "string",
  "requirement": "string",
  "maxProgress": 1,
  "tokens": 0,
  "experience": 0,
  "isActive": true,
  "isHidden": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Game
```json
{
  "id": "string",
  "clubId": "string",
  "homeTeam": "string",
  "awayTeam": "string",
  "homeScore": 2,
  "awayScore": 1,
  "date": "2024-01-01T00:00:00Z",
  "time": "15:00",
  "stadium": "string",
  "championship": "PREMIER_LEAGUE|FA_CUP|CARABAO_CUP|CHAMPIONS_LEAGUE|EUROPA_LEAGUE|FRIENDLY|OTHER",
  "type": "HOME|AWAY|NEUTRAL",
  "status": "SCHEDULED|LIVE|FINISHED|CANCELLED|POSTPONED",
  "description": "string",
  "highlights": "string",
  "attendance": 50000,
  "weather": "string",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `422` - Unprocessable Entity (business logic errors)
- `500` - Internal Server Error

## Rate Limiting

API endpoints are subject to rate limiting to prevent abuse. Limits vary by endpoint and user role.

## WebSocket Events

For real-time features, the platform supports WebSocket connections for:
- Live game updates
- Real-time notifications
- Chat functionality
- Live event updates

## File Upload

For file uploads (avatars, images), use multipart/form-data:
```http
POST /auth/avatar
Content-Type: multipart/form-data

file: [binary data]
```

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Testing

Use the provided test files in the `test/` directory to test API endpoints:
- `server.test.js` - Basic server tests
- Individual route tests for each module

## Deployment

The API is configured for deployment on Railway with:
- `railway.json` - Railway configuration
- `Dockerfile` - Docker configuration
- `docker-compose.yml` - Local development setup 