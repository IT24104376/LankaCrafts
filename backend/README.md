# LankaCrafts — Tourist Management Backend

Node.js + Express + MongoDB REST API with **Firebase Authentication** and **Cloudinary** media storage.

---

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Firebase project (for Auth)
- Cloudinary account (for media uploads)

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and fill in:

| Key | Where to get it |
|-----|----------------|
| `MONGO_URI` | Your MongoDB connection string |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → General |
| `FIREBASE_CLIENT_EMAIL` | Firebase Console → Project Settings → Service Accounts → Generate new private key |
| `FIREBASE_PRIVATE_KEY` | Same JSON file from above |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard → Settings |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard → Settings → API Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → Settings → API Keys |

### 3. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at: **http://localhost:5000**

---

## API Reference

All routes are prefixed with `/api/tourist`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Firebase token | Create tourist profile after Firebase sign-up |
| POST | `/auth/login` | Firebase token | Sync & return profile after Firebase sign-in |

### Tourist Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile` | ✅ | Get authenticated tourist's profile |
| PATCH | `/profile` | ✅ | Update profile fields |
| GET | `/stats` | ✅ | Dashboard stats (workshops, blogs, reviews, bookings) |

### Blogs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/blogs` | ❌ | List published blogs (`?page=1&sort=recent\|liked\|workshop`) |
| POST | `/blogs` | ✅ | Create blog (multipart/form-data with optional `media` file) |
| PATCH | `/blogs/:id/like` | ✅ | Toggle like on a blog |
| DELETE | `/blogs/:id` | ✅ | Delete own blog (removes Cloudinary media) |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings` | ✅ | Get upcoming and past bookings |
| POST | `/bookings` | ✅ | Create a booking |
| PATCH | `/bookings/:id/cancel` | ✅ | Cancel a booking |

---

## Authentication Flow

1. **Register**: Firebase creates user on client → client gets ID token → POST to `/api/tourist/auth/register` with token in `Authorization: Bearer <token>` header + profile data in body → MongoDB profile created.

2. **Login**: Firebase signs user in on client → client gets ID token → POST to `/api/tourist/auth/login` → server verifies token, returns MongoDB profile.

3. **Subsequent requests**: All protected routes require `Authorization: Bearer <firebase-id-token>` header.

---

## Health Check

```
GET http://localhost:5000/health
```
