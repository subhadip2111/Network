 
 📡 Network - API Documentation

## 🌟 Core Features

- **User Authentication** (JWT + OAuth)
- **Personalized Content Feed**
- **Post Creation** (Ideas/Projects/Problems)
- **Group Collaboration**
- **Real-time Notifications**

# 📦 Module-wise API Summary

## 1. Auth Module

### `POST /auth/signup`  
- Register new user (email/password)
### `POST /auth/login`  
- JWT token generation
### `POST /auth/refresh`  
- Refresh expired tokens
### `GET /auth/me`  
- Get current user data

## 2. Users Module
### `GET /users/:id`  
- Get user profile by ID
### `PATCH /users/interests`  
- Update user interests (tags)
### `GET /users/search?q=:query`  
- Search users by name/email

## 3. Posts Module
### `POST /posts`  
- Create post (type: idea/project/problem)
### `GET /posts/feed`  
- Get personalized feed (paginated)
### `POST /posts/:id/like`  
- Like/unlike a post
### `POST /posts/:id/comments`  
- Add comment to post

## 4. Groups Module
### `POST /groups`  
- Create new group
### `POST /groups/:id/join`  
- Join existing group
### `GET /groups/:id/posts`  
- Get group-specific posts
### `GET /groups/search`  
- Discover public groups

## 5. Notifications (WebSocket)
### `wss://yourdomain.com/ws`  
- **Events**:
  - `new_like`  
  - `new_comment`  
  - `group_activity`
