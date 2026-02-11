# Educational Backend API

Production-ready REST API built with Node.js and Express.

This project demonstrates authentication, role-based access control,
secure token management, automated testing, and AI service integration.

---

## 🚀 Features

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
- API testing with Postman

---

## 🏗 Architecture Highlights

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

## 🛠 Tech Stack

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

## 📦 Installation

```bash
git clone https://github.com/sebasolarte22/educational-backend-api.git
cd educational-backend-api
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000

#JWT Secrets
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET

#Expirations
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

#IA
OPENAI_API_KEY  
```

---

## 🧪 Run Tests

```bash
npm test
```

---

## ▶️ Run Server

```bash
npm start
```

---

## 📌 Author

Sebastian Olarte  
Backend Developer
