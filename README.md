 # CLOudex — Cloud Storage & File Management Platform

CLOudex is a secure cloud storage backend inspired by platforms like Google Drive and Dropbox. It allows authenticated users to upload, download, search, organize, and manage their files while providing storage tracking, Redis caching, rate limiting, and secure API access.

## 🚀 Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication
* Protected REST APIs
* User-level authorization
* Bcrypt password hashing
* Password update functionality
* Redis-based rate limiting for:

  * Login
  * Signup
  * File upload
  * Password update

### 📁 File Management

* Upload files
* Download files
* Rename files
* Search files
* Move files to trash
* Restore files
* Permanently delete files
* Secure file access based on authenticated user

### 💾 Storage Management

* 1 GB storage quota per user
* Automatic storage usage tracking
* Remaining storage calculation
* File count tracking
* Trashed file tracking
* Recent files tracking

### 📊 Dashboard

The dashboard API provides:

* Total files
* Trashed files
* Recent files
* Storage usage
* Remaining storage
* Storage statistics

### ⚡ Redis Caching

Redis is used to improve API performance by caching:

* File listings
* Dashboard data
* File search results
* Pagination results

Cache invalidation is automatically performed when file data changes, including:

* Upload
* Rename
* Delete
* Trash
* Restore

### 📄 Pagination & Sorting

* Server-side pagination
* Server-side sorting
* Efficient file retrieval
* Cached pagination results

### 🛡️ API Design

* RESTful API architecture
* Centralized error handling
* Request validation
* Protected routes
* User-specific resource access

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT
* Bcrypt
* Redis Rate Limiting

### File Handling

* Multer

### Caching

* Redis

---

## 📂 Core Modules

```text
Authentication
├── Register
├── Login
└── Password Update

File Management
├── Upload
├── Download
├── Rename
├── Search
├── Trash
├── Restore
└── Permanent Delete

Dashboard
├── File Statistics
├── Storage Usage
├── Recent Files
└── Remaining Storage

Performance
├── Redis Caching
├── Cache Invalidation
├── Pagination
└── Sorting

Security
├── JWT Authentication
├── Authorization
├── Bcrypt Password Hashing
└── Redis Rate Limiting
```

---

## 🔄 File Management Flow

```text
User Login
    ↓
JWT Authentication
    ↓
Access Protected API
    ↓
Upload / Manage Files
    ↓
MongoDB
    ↓
Redis Cache
    ↓
Dashboard / Search / File Listing
```

When a file is modified:

```text
File Mutation
    ↓
Update MongoDB
    ↓
Invalidate Related Redis Cache
    ↓
Return Updated Data
```

---

## ⚡ Performance Optimization

CLOudex uses Redis to reduce repeated database queries for frequently requested data.

Cached operations include:

* File listing
* Dashboard statistics
* File search
* Pagination results

When a file is uploaded, renamed, deleted, trashed, or restored, the related cache entries are invalidated to keep cached data synchronized with the database.

---

## 🔒 Security

The backend implements multiple security mechanisms:

* JWT authentication
* User-level authorization
* Bcrypt password hashing
* Protected REST APIs
* Redis-based API rate limiting
* Request validation
* Centralized error handling

Users can only access and manage resources belonging to their own account.

---

## 📌 Project Highlights

* Secure cloud file management backend
* 1 GB per-user storage management
* Redis caching and cache invalidation
* Redis-based API rate limiting
* JWT authentication and authorization
* File search, sorting, and pagination
* Dashboard and storage analytics
* RESTful API architecture
* User-level secure file access

---

## 👨‍💻 Author

**Adnan Ahmed**

Built as a full-stack/backend engineering project to explore secure file storage, REST API development, Redis caching, authentication, authorization, and backend performance optimization.

