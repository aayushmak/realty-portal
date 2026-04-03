# 🏠 Realty Portal — Buyer Dashboard

A full-stack MERN application for a real-estate buyer portal featuring JWT authentication, a property browser, and a personal favourites system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator (server) + custom (client) |

---

## Project Structure

```
realty-portal/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT protect middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema (hashed password)
│   │   ├── Property.js        # Property schema
│   │   └── Favourite.js       # User ↔ Property junction
│   ├── routes/
│   │   ├── auth.js            # POST /register, /login, GET /me
│   │   ├── properties.js      # GET /properties, /properties/:id
│   │   └── favourites.js      # GET/POST/DELETE /favourites
│   ├── seed.js                # Sample property data seeder
│   ├── server.js              # Express app entry point
│   └── .env                   # Environment variables
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js       # Axios instance + interceptors
        ├── components/
        │   ├── Navbar.js
        │   ├── PropertyCard.js
        │   ├── ProtectedRoute.js
        │   └── Toast.js
        ├── context/
        │   └── AuthContext.js # Global auth state
        ├── pages/
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── DashboardPage.js
        │   └── FavouritesPage.js
        └── App.js             # Router setup
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `mongodb://localhost:27017`  
  *(or swap `MONGO_URI` in `.env` for a MongoDB Atlas connection string)*

---

## How to Run

### 1. Install dependencies

```bash
# From the project root
npm run install:all
```

Or manually:
```bash
npm install                     # root (concurrently)
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

The backend `.env` file is pre-configured for local development:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/realty-portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> ⚠️ Change `JWT_SECRET` before deploying to production.

### 3. Seed the database (optional but recommended)

```bash
npm run seed
```

This inserts 8 sample properties (penthouse, villas, houses, apartments, studio).

### 4. Start the app

```bash
# Runs backend (port 5001) + frontend (port 3000) simultaneously
npm run dev
```

Or run individually:
```bash
npm run dev:backend    # Express API on :5001
npm run dev:frontend   # React app on :3000
```

Open **http://localhost:3000** in your browser.

---

## Example Flows

### Flow 1: Register → Login → Browse → Favourite

```
1. Visit http://localhost:3000/register
2. Fill in: Name, Email, Password (min 6 chars) → Submit
3. Automatically redirected to /dashboard (logged in)
4. Browse the property grid
5. Click "♡ Add to Favourites" on any property card
6. Toast notification confirms: "Added to favourites!"
7. Navigate to /favourites via the top navbar
8. See your saved properties + portfolio stats
9. Click "♥ Remove from Favourites" to unsave
```

### Flow 2: Login with existing account

```
1. Visit http://localhost:3000/login
2. Enter your email + password → Submit
3. Redirected to /dashboard
```

### Flow 3: Direct URL protection

```
1. Open a private/incognito window
2. Try visiting http://localhost:3000/favourites
3. Automatically redirected to /login
4. After logging in, redirected back to /favourites
```

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| GET | `/api/auth/me` | ✅ | Get current user |

### Properties

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/properties` | ❌ | List all (supports `?search=`, `?type=`, `?city=`) |
| GET | `/api/properties/:id` | ❌ | Single property |

### Favourites

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/favourites` | ✅ | User's favourites (populated) |
| POST | `/api/favourites/:propertyId` | ✅ | Add to favourites |
| DELETE | `/api/favourites/:propertyId` | ✅ | Remove from favourites |
| GET | `/api/favourites/check/:propertyId` | ✅ | Check if favourited |

---

## Security Highlights

- **Passwords** are hashed with `bcryptjs` (12 salt rounds) before storage — never stored in plaintext
- **JWT** is verified on every protected request via the `protect` middleware
- **Favourites are user-scoped**: the DB query always filters by `user: req.user._id`, so users can never read or modify another user's favourites
- **Input validation** runs on both client (React) and server (express-validator)
- A **compound unique index** (`user + property`) prevents duplicate favourites at the DB level
- **CORS** is configured to only accept requests from the frontend origin

---

## Design Decisions

- **In-memory auth state** is held in React Context + localStorage for the JWT token, with a token verification call on app mount
- **Axios interceptors** automatically attach the Bearer token to every request and redirect to `/login` on 401
- **Separate Favourite model** (junction table pattern) allows easy extension (e.g., notes, alert preferences per saved property)
- **`select: false`** on the User password field ensures it's never accidentally returned in API responses

---

## Possible Extensions

- Password reset via email (nodemailer)
- Pagination / infinite scroll on the property grid
- Agent role: ability to create/edit/delete properties
- Property detail page with image gallery
- Price change alerts for favourited properties
