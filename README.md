# Educational Backend API

Production-ready REST API built with **Node.js, Express, PostgreSQL, Redis and Docker** following a clean architecture approach.

This project demonstrates secure authentication, role-based authorization, refresh token rotation, Redis caching, Dockerized infrastructure, structured logging, and full integration testing with an isolated test database.

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
* Automated integration tests with isolated test DB
* Docker multi-service environment (Backend + Postgres + Redis)

---

## 🏗 Architecture Highlights

* Separation of concerns
* Controllers layer (HTTP)
* Service layer (business logic + caching)
* Infrastructure layer (DB, Redis)
* Cache-aside pattern implementation
* Cache invalidation on mutations
* Production-ready logging strategy
* Infrastructure abstraction
* Environment-based configuration

---

## ⚡ Redis Caching Strategy

Implements **cache-aside pattern**:

* Cache course list
* Cache course by id
* Automatic invalidation after create/update/delete
* Pattern-based cache invalidation

Benefits:

* Reduced DB load
* Faster responses
* Scalable backend architecture

---

## 🐳 Docker Setup

The application runs using **Docker Compose**:

Services:

* Backend (Node.js API)
* PostgreSQL database
* Redis cache

This ensures:

* Reproducible environments
* Production-like local setup
* Clean infrastructure isolation

Run everything:

```bash
docker compose up --build
```

Stop:

```bash
docker compose down
```

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
docker-compose.yml
Dockerfile
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
* OpenAI API
* Docker

---

## 🔐 Environment Variables

```env
PORT=3000

DATABASE_URL=
DATABASE_URL_TEST=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

REDIS_URL=redis://redis:6379
```

---

## 🧪 Testing

Tests run against a **separate test database**.

```bash
npm test
```

---

## 🧠 What This Project Demonstrates

Real backend engineering practices:

* Token rotation strategy
* Secure refresh token storage
* Clean architecture
* Redis caching strategy
* Cache invalidation strategy
* Docker multi-service setup
* Infrastructure abstraction
* Production logging patterns
* Integration testing with DB isolation

---

## 👨‍💻 Author

Sebastian Olarte
Backend Developer

