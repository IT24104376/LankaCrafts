<div align="center">

# Lanka Crafts

### A Digital Platform Connecting Sri Lankan Artisans with Tourists

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)](https://react.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.83.6-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![Node.js](https://img.shields.io/badge/Node.js-v18.x_LTS-339933?style=flat&logo=nodedotjs)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_8.x-47A248?style=flat&logo=mongodb)](https://www.mongodb.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_v9-FFCA28?style=flat&logo=firebase)](https://firebase.google.com)
[![Expo](https://img.shields.io/badge/Expo-SDK_55-000020?style=flat&logo=expo)](https://expo.dev)

**IT Project | Year 2, Semester 2 — 2026**

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Team Members](#-team-members)

---

## 🌟 About the Project

**Lanka Crafts** is a full-stack digital platform developed to bridge the gap between local Sri Lankan artisans and tourists seeking authentic cultural experiences. The platform addresses two interrelated challenges:

- 🏺 **Artisan Side** — Local handicraft businesses (pottery, batik, wood carving, lacquer work, handloom weaving, mask-making) lack digital visibility and are limited to walk-in visitors and intermediary channels.
- 🗺️ **Tourist Side** — Visitors to Sri Lanka struggle to discover genuine, locally crafted workshop experiences beyond standard tourist attractions.

Lanka Crafts delivers a unified ecosystem where artisans can establish verified profiles, list workshops, and communicate directly with tourists — while tourists can browse, book, review, and share their cultural experiences.

> *"Bridging cultural heritage and modern technology to create sustainable, mutually beneficial connections between artisans and tourists."*

---

## ✨ Key Features

| Module | Feature Highlights |
|---|---|
| 🧑‍🎒 **Tourist Profile & Experience Sharing** | Registration & profile management, map-based artisan discovery, wishlist, multimedia blog publishing |
| 🧑‍🎨 **Artisan Profile & Craft Showcase** | Verified digital identity, media portfolio upload, workshop listings with availability management |
| 📅 **Workshop Booking & Scheduling** | Real-time booking requests, double-booking prevention, artisan confirmation workflow, QR code generation |
| 💬 **Communication & AI Assistance** | REST HTTP-based in-app messaging, AI chatbot powered by Groq SDK (Llama-3.3-70b) |
| ⭐ **Review, Rating & Feedback** | Post-workshop reviews with photo uploads, AI-generated review summaries, artisan reply system |
| 🛡️ **Admin Verification & Analytics** | Artisan profile verification, content moderation, analytics dashboard with geographic tourist insights |

---

## 🏗️ System Architecture

Lanka Crafts follows a **client-server monorepo architecture** with a centralized RESTful API serving all three client applications.
```
┌──────────────────────────────────────────────────────────┐     
│                      Client Layer                        |     
│  ┌──────────────┐  ┌──────────────┐   ┌───────────────┐  │        
│  │  React.js    │  │ React Native │   │    Admin      │  │    
│  │  Web App     │  │ Mobile App   │   │   Dashboard   │  │     
│  └──────┬───────┘  └──────┬───────┘   └───────┬───────┘  │    
└─────────┼─────────────────┼───────────────────┼──────────┘      
          │           HTTPS / JSON              │
          └──────────────────┬──────────────────┘
                             │
          ┌──────────────────▼─────────────────────┐
          │        Express.js REST API             │
          │   (MVC Pattern - Routes / Controllers  │
          │    / Services / Middleware)            │
          └───┬─────────┬──────────┬───────────────┘
              │         │          │
   ┌──────────▼┐  ┌─────▼────┐  ┌──▼───────────────┐
   │ MongoDB   │  │ Firebase │  │ External APIs    │
   │  Atlas    │  │  Auth    │  │ Cloudinary       │
   │ (Data)    │  │(Identity)│  │ Groq AI (LLM)    │
   └───────────┘  └──────────┘  │ Map API / Email  │
                                └──────────────────┘
```

The backend is structured following the **MVC (Model-View-Controller)** pattern with **Role-Based Access Control (RBAC)** middleware enforcing route-level security for Tourist, Artisan, and Admin roles.

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18.x LTS | Backend runtime |
| Express.js | 4.x | RESTful API framework |
| Mongoose | 7.x | MongoDB ODM |
| Firebase Admin SDK | v9 | Server-side token verification |
| Multer + Streamifier | Latest | File upload handling |
| Groq SDK (Llama-3.3-70b) | Latest | AI chatbot & review summarisation |
| express-validator | Latest | Request validation middleware |

### Database & Storage
| Technology | Version | Purpose |
|---|---|---|
| MongoDB Atlas | 8.x | Cloud-hosted NoSQL database |
| Cloudinary | 4.x | Media storage (images & videos) |

### Web Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.x | Web application framework |
| Axios | 1.x | HTTP client for API requests |
| Tailwind CSS | 3.x | Utility-first styling |
| React Leaflet | Latest | Map-based artisan discovery |
| qrcode.react | Latest | Client-side QR code generation |

### Mobile Frontend
| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.83.6 | Cross-platform mobile framework |
| Expo SDK | 55 | Managed mobile workflow |
| React Navigation | 6.x | Navigation library |

---

## 📁 Repository Structure

---

## 📡 API Documentation

All API routes follow RESTful conventions. Protected routes require a valid **Firebase ID Token** passed as a Bearer token in the `Authorization` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/tourist/auth/register` | No | Register a new tourist |
| `POST` | `/api/artist/auth/register` | No | Register a new artisan |
| `POST` | `/api/tourist/auth/login` | No | Authenticate and return session token |

### Artisans & Workshops

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/artists` | No | Get paginated list of verified artisans |
| `GET` | `/api/artists/:id` | No | Get specific artisan profile with portfolio |
| `PUT` | `/api/artist/profile` | Artisan | Create or update artisan profile |
| `GET` | `/api/crafts/public/crafts` | No | Get filtered list of active workshop listings |
| `GET` | `/api/crafts/public/crafts/:id` | No | Get workshop with availability slots |
| `POST` | `/api/workshops` | Artisan | Create a new workshop listing |
| `PATCH` | `/api/workshops/:id` | Artisan | Update an existing workshop listing |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Tourist | Submit a new workshop booking request |
| `GET` | `/api/bookings/user/:email` | Tourist | Get all bookings for authenticated tourist |
| `PATCH` | `/api/bookings/:id/status` | Artisan | Accept, reject, or complete a booking |

### Reviews, Chat & Blogs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews` | Tourist | Submit a review for a completed workshop |
| `GET` | `/api/reviews/artisan/:artisanId` | No | Get reviews for a specific artisan |
| `GET` | `/api/chat/conversations` | Auth | Retrieve chat thread between two users |
| `POST` | `/api/chat/conversations/:id/messages` | Auth | Send a chat message |
| `GET` | `/api/tourist/blogs` | No | Get paginated tourist experience blog posts |
| `POST` | `/api/blogs` | Tourist | Create a new experience blog post |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/analytics` | Admin | Get platform analytics summary |
| `PATCH` | `/api/admin/artists/:id/verify` | Admin | Approve or reject an artisan profile |
| `GET` | `/api/admin/users` | Admin | Get all registered users with filters |

---

## ☁️ Deployment

The platform is fully integrated across all layers. Live platform entry targets:

| Component | Platform | Deployment Target / Access Point | Status |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | [Netlify](https://netlify.com) | [lanka-crafts.netlify.app](https://lanka-crafts.netlify.app/) | ✅ Live |
| **Backend API** | [Railway](https://railway.com) | Private Microservice Endpoint | ✅ Live |
| **Mobile Application** | GitHub Releases | [Download Pre-compiled APK](../../releases) | 📱 Active Preview |
| **Database Cluster** | MongoDB Atlas | Cloud Cluster (Shared Tier) | ✅ Active |
| **Identity Service** | Firebase Auth | Production Instance Infrastructure | ✅ Active |

### 📥 Testing the Mobile App

To test the cross-platform Android Mobile Application version directly on a physical device or simulation sandbox:

1. Navigate to the **[Releases](../../releases)** tab on this GitHub repository.
2. Download the latest compiled asset build file (`LankaCrafts-Preview.apk`).
3. Transfer the file to your Android device (or drag-and-drop it into an Android Emulator).
4. Open the file on the device and follow the prompt to install and evaluate the interface.

---

## 👥 Team Members

| # | Student ID | Name | Module | Contribution |
|---|---|---|---|---|
| 01 | IT24104376 | Akalanka W.D.U.K. | Tourist Profile & Experience Sharing | 22% |
| 02 | IT24103320 | Aathif R.A.A. | Admin Verification & Analytics | 15% |
| 03 | IT24102332 | Sathnara H.D.M. | Artisan Profile & Craft Showcase | 22% |
| 04 | IT24100910 | Ranasinghe R.G.P.D. | Workshop Booking & Scheduling | 15% |
| 05 | IT24102266 | Nidurshan G. | Communication & AI Assistance | 13% |
| 06 | IT24101028 | Uthpala W.A.S. | Review, Rating & Feedback | 13% |

---

## 📚 References

- Buhalis, D. & Law, R. (2008). *Progress in information technology and tourism management.* Tourism Management, 29(4), 609–623.
- Timothy, D.J. & Boyd, S.W. (2003). *Heritage Tourism.* Prentice Hall.
- UNWTO. (2019). *Digital Transformation in the Tourism Sector.* https://www.unwto.org
- Express.js, MongoDB Atlas, Firebase, React, Expo, Groq, Cloudinary — see `/backend/package.json` for full dependency list.

---

<div align="center">

**Lanka Crafts** — *Preserving Sri Lanka's craft heritage, one digital connection at a time.*

</div>

**Copyright&copy; 2026 Kasun Akalanka and Contributors**

**All rights reserved.**

⚠️This software and associated files may not be copied, modified, distributed, sublicensed, sold, or used commercially without
explicit written permission from the copyright holders.
