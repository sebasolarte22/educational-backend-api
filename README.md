# Educational Backend API

Production-ready REST API built with Node.js and Express.

This project demonstrates authentication, role-based access control,
secure token management, automated testing, and AI service integration.

---

##  Features

- User registration and login
- JWT authentication with Refresh Token flow
- Role-based access control (Admin / User)
- Rate limiting for API protection
- Secure password hashing with bcrypt
- PostgreSQL database (raw SQL, no ORM)
- AI service integration for automated course explanations
- File upload handling with Multer
- OCR processing with Tesseract.js
- Unit and integration testing with Jest & Supertest

---

##  Architecture Highlights

- Modular folder structure (routes, services, middlewares)
- Separation of concerns
- Environment-based configuration
- Centralized error handling
- Token rotation strategy
- Test coverage for:
  - Authentication
  - Role validation
  - Refresh token logic
  - Protected routes
  - AI integration

---

##  Tech Stack

- Node.js
- Express
- PostgreSQL
- JWT
- Jest
- Supertest
- OpenAI API
- Multer
- Tesseract.js

---

##  Installation

```bash
git clone https://github.com/sebasolarte22/educational-backend-api.git
cd educational-backend-api
npm install
