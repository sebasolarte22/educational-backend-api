# Educational LMS API

Production-ready **REST API for an educational platform** built with **Node.js, Express, PostgreSQL, Redis and Docker**, following a clean architecture approach.

This project demonstrates modern backend engineering practices including **JWT authentication with refresh token rotation, Redis caching, role-based authorization, structured logging, Dockerized infrastructure, and integration testing**.

The API is fully deployed in the cloud and connected to a frontend dashboard that allows testing the endpoints.

---

# 🌐 Live Demo

Frontend Dashboard (API Tester)

```
https://lms-api-dashboard.netlify.app
```

Backend API

```
https://educational-backend-api.onrender.com
```

Example endpoint:

```
GET /
POST /
PUT / 
PATCH
```

---

# 🏗 System Architecture

```
Frontend Dashboard (Netlify)
        │
        ▼
Backend API (Render - Node.js / Express)
        │
        ├── PostgreSQL Database (Render)
        └── Redis Cache
```

This architecture simulates a **real production backend environment**.

---

# 🚀 Features

### Authentication

* User registration
* User login
* JWT authentication
* Access + Refresh Token rotation
* Secure refresh token storage (hashed)
* Token expiration strategy

### Course Platform

* Create courses
* Update courses
* Delete courses
* List courses
* View course details
* Course enrollment

### Learning System

* Course sections
* Course lessons
* Lesson completion tracking
* Course progress calculation

### User Features

* Favorite courses
* Progress tracking
* Enrollment management

### Performance

* Redis caching
* Cache-aside pattern
* Pattern-based cache invalidation

### AI Features

* Protected AI endpoint
* Role-based access
* Rate limiting

---

# ⚡ Redis Caching Strategy

Implements **cache-aside pattern**:

Cached resources:

* Course list
* Course by ID

Invalidation strategy:

* Cache cleared after course mutations
* Pattern-based invalidation

Benefits:

* Reduced database load
* Faster responses
* Scalable backend architecture

---

# 🐳 Docker Infrastructure

The project runs using **Docker Compose**.

Services:

* Backend API
* PostgreSQL
* Redis

Run locally:

```bash
docker compose up --build
```

Stop services:

```bash
docker compose down
```

---

# 📁 Project Structure

```
controllers/
services/
infrastructure/
   redis/
middlewares/
routers/
utils/
config/
tests/

docker-compose.yml
Dockerfile
```

Architecture layers:

```
Controllers → HTTP layer
Services → Business logic
Infrastructure → Database + Redis
Middlewares → Auth / Errors / Roles
```

---

# 🛠 Tech Stack

Backend

* Node.js
* Express

Database

* PostgreSQL

Cache

* Redis

Authentication

* JWT
* Refresh Token Rotation

Infrastructure

* Docker
* Docker Compose

Testing

* Jest
* Supertest

Logging

* Winston

Deployment

* Render (Backend + Database)
* Netlify (Frontend dashboard)

---

# 🔐 Environment Variables

Example `.env` file:

```env
PORT=3000

DATABASE_URL=
DATABASE_URL_TEST=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=15m

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=7d

REDIS_URL=redis://redis:6379
```

---

# 🧪 Testing

Integration tests run against a **separate test database**.

Run tests:

```bash
npm test
```

Testing tools:

* Jest
* Supertest

---

# 🧠 What This Project Demonstrates

This project showcases **real-world backend engineering practices**:

* Secure authentication with refresh token rotation
* Clean architecture design
* Redis caching strategy
* Cache invalidation strategies
* Dockerized backend infrastructure
* Structured logging
* Integration testing with DB isolation
* Cloud deployment
* API testing dashboard

---

# 👨‍💻 Author

Sebastian Olarte
Backend Developer
