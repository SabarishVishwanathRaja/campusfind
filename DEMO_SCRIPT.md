# CampusFind — 4-Minute Presentation & Video Demo Script

A scene-by-scene script for a live university course presentation or recorded video submission. Total target duration: **4 minutes (240 seconds)**.

---

## Script Overview & Timing Breakdown

| Scene | Timestamp | Topic | Visual on Screen |
|---|---|---|---|
| **Scene 1** | 0:00 – 0:30 | The Problem & System Purpose | Title slide / Landing page of CampusFind |
| **Scene 2** | 0:30 – 1:00 | Cloud Architecture & Concepts | Mermaid Architecture Diagram in `ARCHITECTURE.md` |
| **Scene 3** | 1:00 – 1:45 | Live Report with Cloud Photo Upload | CampusFind web interface + Cloudinary Console |
| **Scene 4** | 1:45 – 2:30 | Student Claim & Multi-Account Flow | Second student browser session |
| **Scene 5** | 2:30 – 3:15 | Admin Verification & ACID Transaction | Admin Dashboard + Neon Table Editor |
| **Scene 6** | 3:15 – 3:45 | Postman REST API Walkthrough | Postman v2.1 Collection |
| **Scene 7** | 3:45 – 4:00 | Production Cloud Summary & Conclusion | Live Deployed URLs on Vercel & Render |

---

## Detailed Scene-by-Scene Script

### Scene 1: The Problem & System Purpose (0:00 – 0:30)
- **Visual**: Show the CampusFind application homepage (`Browse.jsx`) with clean item cards, badges, and filters.
- **Presenter (Speaking)**:
  > *"Hello everyone. Today on campus, when students lose valuable items—like student ID cards, laptops, keys, or course textbooks—recovery is chaotic. Students post in unorganized WhatsApp groups or stick handwritten notes on physical noticeboards. There is no central tracking, no search capability, and crucially, no verification of ownership.*
  >
  > *To solve this, we built **CampusFind**: a cloud-based campus lost & found platform following a strict 5-stage lifecycle: **Report → Search → Claim → Verify → Resolve**."*

---

### Scene 2: Cloud Architecture & Key Concepts (0:30 – 1:00)
- **Visual**: Open `ARCHITECTURE.md` showing the Mermaid cloud architecture diagram and ER diagram.
- **Presenter (Speaking)**:
  > *"Here is the multi-cloud architecture powering CampusFind:*
  >
  > *1. **Frontend**: A React 18 single-page application hosted on **Vercel's global CDN**.*
  > *2. **Compute**: A stateless Node.js and Express REST API running on **Render PaaS**, secured with JWT tokens.*
  > *3. **Database**: A serverless **PostgreSQL** instance managed on **Neon** with cascading foreign keys and performance indices.*
  > *4. **Object Storage**: High-resolution item photos are stored in **Cloudinary**.*
  >
  > *A core cloud computing concept demonstrated here is the **complete separation of blob storage from relational data**. Binary image files are never stored in PostgreSQL. Instead, the backend streams photos directly to Cloudinary, storing only the secure CDN URL and asset ID in PostgreSQL, while students fetch images directly from Cloudinary's edge cache."*

---

### Scene 3: Live Report with Cloud Photo Upload (1:00 – 1:45)
- **Visual**:
  1. Click **Report Item**.
  2. Select radio button `FOUND`, enter title *"Scientific Calculator Casio fx-991CW"*, category *"Electronics"*, location *"Science Block Lab 204"*.
  3. Attach an image file. Show the **live client-side preview**.
  4. Click **Publish Report**.
  5. Switch tab to the **Cloudinary Media Library** and **Neon SQL Editor**.
- **Presenter (Speaking)**:
  > *"Let's see this in action. I will log in as Arjun Patel (`arjun@student.edu`) and report a calculator found in the Science lab.*
  >
  > *Notice the instant client-side preview. When I click 'Publish Report', the Express backend handles the multipart upload via Multer memory storage and streams it to Cloudinary.*
  >
  > *If we switch to the Cloudinary console, we see our newly uploaded image safely stored in the `campusfind` folder. And if we look at Neon SQL Editor, the `items` row contains only the Cloudinary CDN URL. The database remains fast and lean."*

---

### Scene 4: Student Claim Submission (1:45 – 2:30)
- **Visual**:
  1. Open an Incognito window or second browser profile.
  2. Log in as student Priya Sharma (`priya@student.edu`).
  3. Browse to the calculator item reported in Scene 3.
  4. Fill in the claim form: *"This is my calculator! It has my initials 'P.S.' scratched into the back battery cover."*
  5. Click **Submit Claim**.
- **Presenter (Speaking)**:
  > *"Now, another student, Priya, realizes her calculator is missing. She logs in, searches for 'Calculator', and opens the report.*
  >
  > *Because Priya is not the reporter and the item is in `OPEN` status, the 'Submit Claim' form is active. She provides verifiable proof of ownership—her initials scratched on the battery cover—and submits the claim.*
  >
  > *Our backend guarantees business rules: reporters cannot claim their own items, duplicate claims from the same student are rejected with HTTP 409, and closed items do not accept claims."*

---

### Scene 5: Admin Verification & ACID Transaction (2:30 – 3:15)
- **Visual**:
  1. Switch back to the primary browser logged in as Admin (`admin@campusfind.edu`).
  2. Click **Admin Dashboard** in the navbar.
  3. Point out the top summary metrics: Total Items, Open, Claimed, Returned, Pending Claims.
  4. Go to **Claims Verification** tab. Locate Priya's claim on the calculator.
  5. Click **Approve**.
  6. Show instant feedback: Claim changes to `APPROVED` and item changes to `CLAIMED`.
- **Presenter (Speaking)**:
  > *"Now we log in as the campus administrator (`admin@campusfind.edu`) and navigate to the Admin Dashboard.*
  >
  > *At the top, we see real-time summary statistics across all campus reports. Under the Claims tab, Priya's claim is waiting in `PENDING` status.*
  >
  > *When the administrator clicks 'Approve', the backend executes an **ACID database transaction** using a dedicated connection with `BEGIN` and `COMMIT`. In one atomic operation:*
  > *1. Priya's claim is marked `APPROVED`.*
  > *2. Any competing pending claims on this item are automatically marked `REJECTED`.*
  > *3. The item status transitions from `OPEN` to `CLAIMED`.*
  >
  > *If any step failed, the transaction would roll back, guaranteeing data integrity."*

---

### Scene 6: Postman REST API Walkthrough (3:15 – 3:45)
- **Visual**: Open Postman with the `CampusFind API Collection`.
- **Presenter (Speaking)**:
  > *"Every feature demonstrated in the UI is backed by our clean REST API. In Postman, we have requests organized across all five resources:*
  >
  > *1. When we run `POST /api/auth/login`, an automated test script extracts the signed JWT token and updates our `{{token}}` collection variable.*
  > *2. `GET /api/items` demonstrates multi-param filtering by status, category, and case-insensitive keyword search.*
  > *3. Running `GET /api/users` with a student token returns `403 Forbidden`, proving our role-based authorization middleware works as expected.*
  > *4. All resources—Users, Categories, Items, and Claims—support full CRUD operations."*

---

### Scene 7: Production Cloud Summary & Conclusion (3:45 – 4:00)
- **Visual**: Display both live URLs: Vercel frontend URL and Render API health check URL.
- **Presenter (Speaking)**:
  > *"In summary, CampusFind is fully deployed and production-ready:*
  > - *Frontend on Vercel: `https://campusfind.vercel.app`*
  > - *Backend on Render: `https://campusfind-api.onrender.com`*
  > - *PostgreSQL on Neon and media on Cloudinary.*
  >
  > *It demonstrates real-world cloud engineering: PaaS compute, managed DBaaS, decoupled object storage, stateless JWT security, and transactional consistency. Thank you!"*
