Cloud Storage Backend (Google Drive / Dropbox Inspired)

Tech Stack: Node.js, Express.js, MongoDB, Mongoose, Redis, JWT, Multer, Bcrypt

Description:
Designed and developed a secure cloud storage backend enabling authenticated users to upload, manage, search, and organize files with Redis-powered caching, storage management, and production-ready API optimizations.

Key Features
Developed secure JWT-based authentication with protected REST APIs.
Implemented user registration, login, and password update using bcrypt password hashing.
Added Redis-based rate limiting for Login, Signup, Upload, and Password Update APIs to prevent abuse.
Built complete file management APIs including:
Upload Files
Download Files
Rename Files
Search Files
Trash & Restore Files
Permanent Delete
Implemented 1 GB per-user storage quota with automatic storage usage tracking.
Developed a dashboard API displaying:
Total Files
Trashed Files
Recent Files
Storage Usage Statistics
Remaining Storage
Added server-side Pagination and Sorting for efficient file retrieval.
Optimized backend performance using Redis caching for:
File Listing
Dashboard Data
File Search
Pagination Results
Implemented automatic Redis cache invalidation after file upload, rename, delete, trash, and restore operations to maintain data consistency.
Enforced user-level authorization so users can only access and manage their own files.
Designed scalable RESTful APIs with centralized error handling and validation.
Technical Highlights
JWT Authentication & Authorization
Express.js REST API Development
MongoDB & Mongoose ODM
Redis Integration & Caching
Redis Rate Limiting
Multer File Upload
Bcrypt Password Encryption
Pagination & Sorting
Search APIs
Storage Quota Management
Secure File Access
Cache Invalidation Strategy
REST API Design
Resume Skills

Languages

Java
JavaScript

Backend

Node.js
Express.js

Database

MongoDB
Mongoose
Redis

Authentication & Security

JWT
Bcrypt
Rate Limiting

Concepts

REST APIs
Authentication
Authorization
Redis Caching
Pagination
Sorting
Search Optimization
File Storage Management
Storage Quota Management
Cache Invalidation
Resume Project (Short Version - 4 Bullet Points)

Cloud Storage Backend | Node.js, Express.js, MongoDB, Redis

Developed a secure cloud storage backend with JWT authentication, role-based authorization, and 1 GB per-user storage management.
Built REST APIs for file upload, download, search, rename, trash, restore, permanent deletion, pagination, and sorting.
Improved API performance using Redis caching for file listings, dashboard analytics, search, and pagination with automatic cache invalidation.
Implemented Redis-based rate limiting, bcrypt password encryption, and dashboard analytics for storage usage, recent files, and user activity.
