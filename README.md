# Educational Backend API

Production-ready REST API built with **Node.js, Express and PostgreSQL** following a clean architecture approach.

This project demonstrates secure authentication, role-based authorization, refresh token rotation, AI service integration, structured logging, and full integration testing with an isolated test database.

---

## 🚀 Features

- User registration and login
- JWT authentication with **Access + Refresh Token rotation**
- Role-based access control (Admin / User)
- AI endpoint with role protection and rate limiting
- PostgreSQL with raw SQL (no ORM)
- Clean architecture (controllers → services → middlewares)
- Centralized error handling with custom AppError
- Structured logging using Winston
- Environment-based configuration (dev / test)
- Automated integration tests with isolated test DB
- AI service mocked in tests (production-safe pattern)

---

## 🏗 Architecture Highlights

- Separation of concerns
- Controllers layer
- Service layer
- Middlewares (auth, roles, rate limit, error handler)
- Global async error wrapper
- Token hashing for refresh tokens
- Secure cookie strategy
- Database isolation for tests
- Production-ready logging strategy

### Covered Test Scenarios

- Authentication flow
- Refresh token rotation
- Protected routes
- Role validation
- AI endpoint authorization
- Course CRUD operations

---

## 🛠 Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT
- Jest
- Supertest
- Winston (logging)
- OpenAI API (service layer)
- Bcrypt

---

## 📦 Installation

```bash
git clone https://github.com/sebasolarte22/educational-backend-api.git
cd educational-backend-api
npm install

