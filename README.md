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

## 📁 Project Structure

```
controllers/
services/
middlewares/
routers/
utils/
config/
tests/
```

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
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
PORT=3000

# Database (DEV)
DB_HOST
DB_USER
DB_NAME
DB_PORT

# JWT
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI
OPENAI_API_KEY

# Testing DB
DB_NAME_TEST=cursos_test
```

---

## 🧪 Testing

Tests run against a **separate test database** to avoid affecting development data.

Run tests:

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

- Auth (register, login, refresh, logout)
- Courses (programming & mathematics)
- AI (course explanation endpoint)

---

## 🧠 What This Project Demonstrates

This repository focuses on **real backend engineering practices**:

- Token rotation strategy
- Secure refresh token storage (hashed)
- Clean architecture structure
- External service mocking (AI)
- Production logging patterns
- Integration testing with database isolation

---

## 👨‍💻 Author

**Sebastian Olarte**  
Backend Developer


