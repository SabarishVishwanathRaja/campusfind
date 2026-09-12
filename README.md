# CampusFind — Cloud-Based Campus Lost & Found System

> **A University Course Project for Cloud Computing**  
> *Demonstrating Managed DBaaS, PaaS Compute, Decoupled Object Storage, and Stateless JWT Architecture.*

### 🌐 Live Production Links
- **Deployed Web Application (Vercel)**: [https://client-olive-five-17.vercel.app](https://client-olive-five-17.vercel.app)
- **Backend API Health Check (Render)**: [https://campusfind-api-ncig.onrender.com/api/health](https://campusfind-api-ncig.onrender.com/api/health)
- **Cloud Database (Neon DBaaS)**: Serverless PostgreSQL on AWS Singapore (`ap-southeast-1`)
- **Media Storage & CDN (Cloudinary)**: Object store & optimized media delivery
- **GitHub Repository**: [https://github.com/SabarishVishwanathRaja/campusfind](https://github.com/SabarishVishwanathRaja/campusfind)

---

## 1. The Problem Being Solved

On college campuses, students frequently lose critical possessions: university ID cards, laptops, chargers, textbooks, wallets, keys, and transit passes. Currently, campus recovery relies on:
- Disorganized WhatsApp and Telegram group chats where posts quickly get buried.
- Physical bulletin boards that few students check regularly.
- Zero verification, allowing unauthorized persons to falsely claim items.

Because reports are scattered across unlinked channels, items are rarely reunited with their rightful owners.

---

## 2. The Solution

**CampusFind** is a centralized cloud platform establishing a verified 5-stage lifecycle:
```text
Report ──► Search ──► Claim ──► Verify ──► Resolve
```
1. **Report**: Any student reports a lost or found item, optionally attaching a photo.
2. **Search**: Community members filter and search items across campus locations and categories.
3. **Claim**: A student who identifies their item submits a claim with proof of ownership details.
4. **Verify**: Campus administrators review claims and verify identification notes.
5. **Resolve**: Upon claim approval, an atomic ACID transaction transitions the claim to `APPROVED`, automatically marks competing claims `REJECTED`, and sets the item status to `CLAIMED`.

---

## 3. Technology Stack

| Layer | Technology | Version | Hosted on |
|---|---|---|---|
| **Frontend** | React 18, React Router v6, Pure CSS | `react@^18.3.1`, `vite@^5.2.0` | **Vercel** |
| **Backend API** | Node.js 20, Express 4 (CommonJS) | `express@^4.19.2`, `node@20.x` | **Render** |
| **Database** | PostgreSQL (Relational DBaaS) | `pg@^8.11.5` | **Neon** |
| **Media Storage** | Cloudinary (Object Storage + CDN) | `cloudinary@^2.2.0` | **Cloudinary** |
| **Authentication**| JSON Web Tokens (JWT) + bcryptjs | `jsonwebtoken@^9.0.2`, `bcryptjs@^2.4.3` | Application Layer |

---

## 4. Key Features

- **Decoupled Cloud Object Storage**: Images are uploaded via streaming buffers to Cloudinary; only URLs and asset IDs are persisted in PostgreSQL.
- **ACID Transactional Integrity**: Dedicated PostgreSQL transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) ensure atomic claim approvals.
- **Role-Based Access Control (RBAC)**: Secure separation between `STUDENT` and `ADMIN` roles using signed JWT tokens.
- **Responsive Modern UI**: Zero external CSS frameworks—hand-crafted responsive CSS grid (`repeat(auto-fill, minmax(280px, 1fr))`) designed for projector presentations.
- **Comprehensive REST API**: Full CRUD capabilities across Users, Categories, Items, and Claims.
- **In-Page Confirmations**: Secure inline dialogs for sensitive delete operations (no native browser popups).

---

## 5. Seed Account Credentials

All password hashes in `db/seed.sql` were generated using `bcryptjs` at cost factor 10:

| Role | Name | Email Address | Password |
|---|---|---|---|
| **Admin** | Campus Admin | `admin@campusfind.edu` | `Admin@123` |
| **Student** | Arjun Patel | `arjun@student.edu` | `Student@123` |
| **Student** | Priya Sharma | `priya@student.edu` | `Student@123` |
| **Student** | Rahul Verma | `rahul@student.edu` | `Student@123` |

---

## 6. Screenshots & Interface Preview

```text
+-------------------------------------------------------------------------------+
|  CampusFind        [Browse]  [Report Item]  [My Items]  [My Claims]  [Admin]  |
+-------------------------------------------------------------------------------+
|                                                                               |
|  Browse Lost & Found Items                                                    |
|  +-------------------------------------------------------------------------+  |
|  | [Search by title, description...] [Search]                              |  |
|  | Type: [All Types v]  Status: [OPEN v]  Category: [All Categories v]     |  |
|  +-------------------------------------------------------------------------+  |
|                                                                               |
|  +-----------------------+  +-----------------------+  +--------------------+ |
|  | [LOST] [OPEN]         |  | [FOUND] [OPEN]        |  | [LOST] [OPEN]      | |
|  | (Photo: Dell Laptop)  |  | (Photo: Student ID)   |  | (Headphones)       | |
|  | Electronics           |  | ID Cards              |  | Electronics        | |
|  | Central Library       |  | Cafeteria             |  | Sports Complex     | |
|  | [View Details ->]     |  | [View Details ->]     |  | [View Details ->]  | |
|  +-----------------------+  +-----------------------+  +--------------------+ |
+-------------------------------------------------------------------------------+
```

---

## 7. Local Setup Instructions (Windows)

### 1. Prerequisites
Ensure you have Node.js installed (v20 or v22):
```powershell
node -v
npm -v
```

### 2. Configure Environment Variables
Create `.env` inside `server/`:
```powershell
Copy-Item server\.env.example server\.env
```
Edit `server/.env` and supply your database and Cloudinary credentials:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=campusfind_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `.env` inside `client/`:
```powershell
Copy-Item client\.env.example client\.env
```
Ensure it contains:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Initialize Database Schema & Seed Data
Execute the SQL files in your PostgreSQL database (e.g. in the Neon SQL Editor or local psql):
1. Run `db/schema.sql` (Creates tables and indexes).
2. Run `db/seed.sql` (Inserts categories, demo accounts, sample items, and claims).

### 4. Install Dependencies
```powershell
# Server dependencies
cd d:\PROJECTS\CampusFind\server
npm install

# Client dependencies
cd d:\PROJECTS\CampusFind\client
npm install
```

### 5. Run the Application
Open two separate terminal windows:

**Terminal 1 — Backend API:**
```powershell
cd d:\PROJECTS\CampusFind\server
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2 — Frontend App:**
```powershell
cd d:\PROJECTS\CampusFind\client
npm run dev
# Vite will launch the frontend on http://localhost:5173
```

Open `http://localhost:5173` in your browser and sign in with any of the seed accounts above.

---

## 8. Documentation Suite

Detailed architectural, API, and deployment documentation is available in the repository:

- 📘 **[ARCHITECTURE.md](file:///d:/PROJECTS/CampusFind/ARCHITECTURE.md)**: Cloud architecture diagram, ER diagram, and in-depth explanation of cloud computing concepts.
- 📙 **[API.md](file:///d:/PROJECTS/CampusFind/API.md)**: Complete REST API documentation with sample request and response payloads.
- 🚀 **[DEPLOYMENT.md](file:///d:/PROJECTS/CampusFind/DEPLOYMENT.md)**: Step-by-step manual cloud deployment guide for Neon, Cloudinary, Render, and Vercel.
- 🎬 **[DEMO_SCRIPT.md](file:///d:/PROJECTS/CampusFind/DEMO_SCRIPT.md)**: A 4-minute presentation and recorded video walkthrough script.
- 📮 **[Postman Collection](file:///d:/PROJECTS/CampusFind/postman/CampusFind.postman_collection.json)**: Importable Postman v2.1 collection with automated JWT variable capture.
