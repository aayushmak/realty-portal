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
│   └── .env                   # Environment variables (local only)
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

## Local Development

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB on port 27017)

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

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/realty-portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

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

## Deploying to Render

This app deploys as a **single Web Service** on Render. Express serves both the API and the React build from one server — no separate frontend service needed.

### How it works in production

```
Browser → https://your-app.onrender.com
              ↓
         Express server
         ├── /api/*  → API routes (auth, properties, favourites)
         └── /*      → Serves React's index.html (client-side routing)
```

### Step 1 — MongoDB Atlas setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access**
2. Click **Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`)
   - Render uses dynamic IPs so this is required
3. Copy your Atlas connection string — you'll need it in Step 3

### Step 2 — Push to GitHub

Make sure your latest code is pushed:

```bash
git add .
git commit -m "ready for render"
git push origin main
```

> ⚠️ The `.env` file is in `.gitignore` and will NOT be pushed. Environment variables are set directly in Render's dashboard.

### Step 3 — Create a Web Service on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set the following:

| Setting | Value |
|---|---|
| **Root Directory** | *(leave blank)* |
| **Build Command** | `cd frontend && npm install && npm run build && cd ../backend && npm install` |
| **Start Command** | `node backend/server.js` |

4. Add these **Environment Variables** in the Render dashboard:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://your-user:your-pass@cluster.mongodb.net/realty?retryWrites=true&w=majority` |
| `JWT_SECRET` | `a_long_random_secret_string` |
| `JWT_EXPIRES_IN` | `7d` |

5. Click **Create Web Service** — Render will build and deploy automatically

### Step 4 — Seed the database on Render (optional)

To add sample properties to your live database, run the seeder locally pointing at your Atlas URI:

```bash
# Temporarily update MONGO_URI in backend/.env to your Atlas connection string
cd backend && node seed.js
```

### Troubleshooting Render deployments

| Symptom | Cause | Fix |
|---|---|---|
| `404` on `/` | `NODE_ENV` not set to `production` | Add `NODE_ENV=production` in Render environment variables |
| `500` on login/register | MongoDB connection failing | Check `MONGO_URI` is correct and Atlas IP whitelist includes `0.0.0.0/0` |
| CORS errors | Frontend and backend on different domains | Not applicable — single service deployment shares the same domain |
| Page 404 on refresh | React Router routes not handled | Already handled — `server.js` catches all non-API routes and serves `index.html` |
| Build fails | Wrong build command | Ensure build command is exactly as shown in Step 3 |

---

## Example Flows

### Flow 1: Register → Login → Browse → Favourite

```
1. Visit /register
2. Fill in: Name, Email, Password (min 6 chars) → Submit
3. Automatically redirected to /dashboard
4. Browse the property grid
5. Click "♡ Add to Favourites" on any property card
6. Toast notification confirms: "Added to favourites!"
7. Navigate to /favourites via the top navbar
8. See your saved properties + portfolio stats
9. Click "♥ Remove from Favourites" to unsave
```

### Flow 2: Login with existing account

```
1. Visit /login
2. Enter your email + password → Submit
3. Redirected to /dashboard
```

### Flow 3: Direct URL protection

```
1. Open a private/incognito window
2. Try visiting /favourites directly
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

- **Passwords** are hashed with `bcryptjs` (12 salt rounds) — never stored in plaintext
- **JWT** is verified on every protected request via the `protect` middleware
- **Favourites are user-scoped**: DB queries always filter by `user: req.user._id` so users can never access another user's favourites
- **Input validation** runs on both client (React) and server (express-validator)
- A **compound unique index** (`user + property`) prevents duplicate favourites at the DB level
- **`.env` is gitignored** — secrets never reach GitHub

---

## Design Decisions

- **Single service deployment** — Express serves the React build in production, eliminating CORS complexity entirely
- **In-memory auth state** held in React Context + localStorage, with token verification on app mount
- **Axios interceptors** automatically attach the Bearer token and redirect to `/login` on 401
- **Separate Favourite model** (junction table pattern) allows easy extension (e.g., notes, alerts per saved property)
- **`select: false`** on the User password field ensures it's never accidentally returned in API responses

---

## Possible Extensions

- Password reset via email (nodemailer)
- Pagination / infinite scroll on the property grid
- Agent role: ability to create/edit/delete properties
- Property detail page with image gallery
- Price change alerts for favourited properties