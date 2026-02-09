# Pinkie Pie Bakery (Full Stack)

Student: Shakalova Diana

Group: SE-2431

Live Links:
- Backend: 
- Frontend: 


## 1. Project Overview

Pinkie Pie Bakery is a full‑stack web project that combines a Node.js/Express REST API with a multi‑page frontend. The backend provides authentication, products, and orders with role‑based access (admin/user). The frontend is a clean static UI with admin panel, favorites, FAQ, contact, and profile pages.

Core highlights:

- MVC backend (Models, Controllers, Routes, Middleware)
- JWT authentication and bcrypt password hashing
- Role‑based access (admin/user)
- Products and orders management
- Admin panel for product editing and order status updates
- Responsive, themed frontend (light/dark)

All data is stored in MongoDB.

---

## 2. Technologies Used

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS

Frontend
- HTML, CSS, JavaScript (vanilla)

Tools
- Postman (optional)

---

## 3. Features

### 3.1 Authentication & RBAC

User model fields:

| Field | Description |
|-----|------------|
| email | User email |
| password | Hashed password |
| role | user or admin |

Security:
- Passwords are hashed using bcrypt
- JWT tokens are issued on login and register
- Admin‑only access for protected routes

---

### 3.2 Products

Product model fields:

| Field | Description |
|-----|------------|
| name | Product name |
| description | Product description |
| price | Product price |

---

### 3.3 Orders

Order model fields:

| Field | Description |
|-----|------------|
| user | Reference to User |
| products | Array of Product references |
| totalPrice | Order total price |
| status | pending / completed |

Orders populate products for user views. Admins can view all orders and change statuses.

---

### 3.4 Frontend Pages

- Home
- Menu
- My Orders
- Admin Panel
- Favorites
- My Profile
- FAQ
- Contact

---

## 4. API Endpoints

### 4.1 Authentication
```
POST /api/auth/register
POST /api/auth/login
```
---

### 4.2 Products
```
GET  /api/products
POST /api/products             (admin)
PUT  /api/products/:id          (admin)
```
---

### 4.3 Orders
```
POST /api/orders                (auth)
GET  /api/orders                (auth)
GET  /api/orders/all            (admin)
PATCH /api/orders/:id/status    (admin)
```
---

## 5. Project Structure
```
PinkiePie_FullStack/
├─ backend/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ server.js
│  └─ package.json
├─ frontend/
│  ├─ css/
│  ├─ js/
│  ├─ *.html
│  └─ assets/
└─ README.md
```
---

## 6. Environment Variables

Backend `.env` (in `backend/`)

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Frontend

The frontend currently uses a hardcoded API base URL in:
- frontend/js/script.js

Default:
http://localhost:5000/api

If you change PORT, update `API_BASE` accordingly.

---

## 7. Run Locally

### 7.1 Prerequisites
- Node.js installed
- MongoDB (local or Atlas)

### 7.2 Backend Setup
1. Go to backend folder:

cd PinkiePie_FullStack/backend

2. Install dependencies:

npm install

3. Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
4. Start server:

npm start

Server runs at:
http://localhost:5000

---

### 7.3 Frontend Setup

Open `frontend/index.html` with any static server (Live Server recommended) or open directly in the browser. Ensure the backend is running.

---

## 8. Testing

All endpoints can be tested using Postman:
- Auth endpoints return JWT tokens
- Admin routes require admin role
- Orders require authentication

---

## 9. Error Responses

| Case | Response |
|----|---------|
| Missing token | 401 Unauthorized |
| Invalid token | 401 Unauthorized |
| Access denied | 403 Forbidden |
| Resource not found | 404 Not Found |

---

## 10. Conclusion

This project demonstrates a complete MVC backend with authentication and RBAC, plus a responsive frontend with admin and user flows. It is a solid foundation for a small e‑commerce bakery system.
