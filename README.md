# Educational Backend API

Production-ready REST API built with **Node.js, Express, PostgreSQL and Redis** following a clean architecture approach.

This project demonstrates secure authentication, role-based authorization, refresh token rotation, Redis caching, AI service integration, structured logging, Dockerized infrastructure, and full integration testing with an isolated test database.

---

## 🚀 Features

* User registration and login
* JWT authentication with **Access + Refresh Token rotation**
* Role-based access control (Admin / User)
* Redis caching (course list + course by id)
* Cache invalidation strategy (pattern-based)
* AI endpoint with role protection and rate limiting
* PostgreSQL with raw SQL (no ORM)
* Clean architecture (controllers → services → infrastructure)
* Centralized error handling with custom AppError
* Structured logging using Winston
* Environment-based configuration (dev / test)
* Automated integration tests with isolated test DB
* AI service mocked in tests (production-safe pattern)
* Dockerized infrastructure (Redis)

---

## 🏗 Architecture Highlights

* Separation of concerns
* Controllers layer (HTTP)
* Service layer (business logic + caching)
* Infrastructure layer (DB, Redis)
* Cache-aside pattern implementation
* Cache invalidation on mutations
* Middlewares (auth, roles, rate limit, error handler)
* Global async error wrapper
* Token hashing for refresh tokens
* Secure cookie strategy
* Database isolation for tests
* Production-ready logging strategy

---

## ⚡ Redis Caching Strategy

This project implements **cache-aside pattern**:

* Cache course list
* Cache course by id
* Automatic invalidation after create/update/delete
* Pattern-based cache invalidation

Benefits:

* Reduced DB load
* Faster responses
* Scalable backend design

---

## 🐳 Docker Usage

Redis runs inside a Docker container to ensure:

* Environment reproducibility
* Production-like setup
* Infrastructure isolation

The backend connects to Redis using environment variables, allowing the same configuration locally and in cloud deployments.

---

## 📁 Project Structure

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
```

---

## 🛠 Tech Stack

* Node.js
* Express
* PostgreSQL
* Redis
* JWT
* Jest
* Supertest
* Winston (logging)
* OpenAI API (service layer)
* Bcrypt
* Docker

---

## 📦 Installation

```bash
git clone https://github.com/sebasolarte22/educational-backend-api.git
cd educational-backend-api
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
PORT=3000

# Database
DATABASE_URL=
DATABASE_URL_TEST=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379

# AI
OPENAI_API_KEY=
```

---

## 🐳 Run Redis (Docker)

```bash
docker run -d -p 6379:6379 --name redis-dev redis:7
```

---

## 🧪 Testing

Tests run against a **separate test database**.

```bash
npm test
```

---

## ▶️ Run Server

```bash
npm start
```

---

## 📚 Example API Modules

* Auth (register, login, refresh, logout)
* Courses (programming & mathematics unified domain)
* AI (course explanation endpoint)

---

## 🧠 What This Project Demonstrates

This repository focuses on **real backend engineering practices**:

* Token rotation strategy
* Secure refresh token storage (hashed)
* Clean architecture structure
* Redis caching strategy
* Cache invalidation strategy
* Infrastructure abstraction
* External service mocking (AI)
* Production logging patterns
* Integration testing with database isolation
* Docker-based infrastructure usage

---

## 👨‍💻 Author

Sebastian Olarte
Backend Developer


