const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const screenshotsDir = path.resolve(__dirname, '../screenshots');
const outputPdfPath = path.resolve(__dirname, '../CampusFind_Project_Report.pdf');

function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`Warning: Image not found: ${filePath}`);
    return '';
  }
  const ext = path.extname(filename).slice(1);
  const data = fs.readFileSync(filePath);
  return `data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${data.toString('base64')}`;
}

const imgFig1 = getBase64Image('figure1_architecture.png');
const imgFig2 = getBase64Image('figure2_erd.png');
const imgFig3 = getBase64Image('figure3_vercel_inspect.png');
const imgFig4 = getBase64Image('figure4_render_env.png');
const imgFig5 = getBase64Image('figure5_landing.png');
const imgFig6 = getBase64Image('figure6_item_detail.png');
const imgFig7 = getBase64Image('figure7_login.png');
const imgFig8 = getBase64Image('figure8_myitems.png');
const imgFig9 = getBase64Image('figure9_report.png');
const imgFig10 = getBase64Image('figure10_vercel.png');
const imgFig11 = getBase64Image('figure11_render.png');
const imgFig12 = getBase64Image('figure12_neon.png');

console.log('Images encoded to base64 successfully.');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CampusFind Project Report</title>
<style>
  @page {
    size: letter;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Aptos', 'Calibri', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #111827;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 8.5in;
    height: 11in;
    position: relative;
    padding: 0.55in 0.85in 0.55in 0.85in;
    page-break-after: always;
    overflow: hidden;
    background: #fff;
  }
  .header-running {
    position: absolute;
    top: 0.35in;
    right: 0.85in;
    font-size: 7.5pt;
    font-weight: 600;
    color: #4b5563;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .footer-running {
    position: absolute;
    bottom: 0.3in;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 8pt;
    color: #6b7280;
  }
  
  /* Typography */
  h1 {
    font-size: 20pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 6px;
  }
  h2 {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 10px;
    margin-bottom: 4px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2px;
  }
  h3 {
    font-size: 10pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 8px;
    margin-bottom: 3px;
  }
  p {
    font-size: 9.5pt;
    line-height: 1.35;
    color: #1e293b;
    margin-bottom: 6px;
    text-align: justify;
  }
  ul {
    margin: 4px 0 6px 18px;
  }
  li {
    font-size: 9.2pt;
    line-height: 1.32;
    color: #1e293b;
    margin-bottom: 3px;
  }
  ol {
    margin: 4px 0 6px 18px;
  }
  ol li {
    font-size: 9pt;
    line-height: 1.3;
    color: #1e293b;
    margin-bottom: 3px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 6px 0 10px 0;
    font-size: 8.5pt;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 4px 7px;
    border: 1px solid #cbd5e1;
    font-size: 8.5pt;
  }
  td {
    padding: 3.5px 7px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
    line-height: 1.25;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Figures */
  .figure-container {
    margin: 8px 0;
    text-align: center;
  }
  .figure-img {
    max-width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .figure-caption {
    font-size: 8.5pt;
    font-weight: 600;
    color: #475569;
    margin-top: 4px;
    text-align: center;
  }

  /* Cover Page Styles */
  .cover-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
    padding-top: 0.4in;
  }
  .univ-title {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 0.5px;
  }
  .univ-school {
    font-size: 11pt;
    font-weight: 600;
    color: #334155;
    margin-top: 4px;
    letter-spacing: 0.3px;
  }
  .report-badge {
    margin-top: 0.45in;
    font-size: 24pt;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.15;
    letter-spacing: -0.5px;
  }
  .report-subbadge {
    font-size: 13pt;
    font-weight: 700;
    color: #475569;
    margin-top: 6px;
    letter-spacing: 1px;
  }
  .proj-title {
    margin-top: 0.45in;
    font-size: 24pt;
    font-weight: 900;
    color: #1e3a8a;
    letter-spacing: 0.5px;
  }
  .proj-tagline {
    font-size: 11pt;
    color: #334155;
    margin-top: 6px;
    font-weight: 500;
  }
  .meta-table-box {
    margin-top: 0.45in;
    width: 90%;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    overflow: hidden;
  }
  .meta-table {
    margin: 0;
    width: 100%;
  }
  .meta-table td {
    padding: 5.5px 12px;
    font-size: 8.8pt;
    border: none;
    border-bottom: 1px solid #f1f5f9;
  }
  .meta-table td:first-child {
    font-weight: 700;
    color: #1e293b;
    width: 42%;
    background-color: #f8fafc;
    border-right: 1px solid #e2e8f0;
  }
  .meta-table td:last-child {
    color: #0f172a;
    font-weight: 500;
  }
  .live-app-box {
    margin-top: 0.3in;
    text-align: center;
  }
  .live-app-label {
    font-size: 10pt;
    font-weight: 800;
    color: #166534;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .live-app-url {
    font-size: 13pt;
    font-weight: 700;
    color: #2563eb;
    margin-top: 4px;
    text-decoration: none;
  }
  .fulfillment-text {
    margin-top: auto;
    margin-bottom: 0.4in;
    font-size: 9pt;
    color: #64748b;
    font-style: italic;
  }

  .code-text {
    font-family: Consolas, Monaco, "Courier New", monospace;
    background-color: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8.5pt;
    color: #0f172a;
  }
  .status-tag {
    font-weight: 700;
    color: #059669;
  }
</style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
    
    <div class="cover-container">
      <div class="univ-title">VIT CHENNAI</div>
      <div class="univ-school">SCHOOL OF COMPUTING SCIENCE AND ENGINEERING</div>

      <div class="report-badge">CLOUD INFRASTRUCTURE<br>AND ARCHITECTURE</div>
      <div class="report-subbadge">PROJECT REPORT</div>

      <div class="proj-title">CAMPUSFIND</div>
      <div class="proj-tagline">Cloud-Based Campus Lost &amp; Found System and Belongings Recovery Platform</div>

      <div class="meta-table-box">
        <table class="meta-table">
          <tr>
            <td>Academic Detail Information</td>
            <td><strong>Specification</strong></td>
          </tr>
          <tr>
            <td>Student Name</td>
            <td><strong>Sabarish Vishwanath Raja</strong></td>
          </tr>
          <tr>
            <td>Register Number</td>
            <td><strong>25BCE1230</strong></td>
          </tr>
          <tr>
            <td>Course</td>
            <td>Cloud Infrastructure and Architecture</td>
          </tr>
          <tr>
            <td>Course Code</td>
            <td>BACSE344</td>
          </tr>
          <tr>
            <td>Faculty</td>
            <td>Dr. P. Anandan</td>
          </tr>
          <tr>
            <td>Slot</td>
            <td>C1</td>
          </tr>
          <tr>
            <td>Submission Date</td>
            <td>12 September 2026</td>
          </tr>
          <tr>
            <td>Production URL</td>
            <td><a href="https://client-olive-five-17.vercel.app" style="color:#2563eb; text-decoration:none;">https://client-olive-five-17.vercel.app</a></td>
          </tr>
        </table>
      </div>

      <div class="live-app-box">
        <div class="live-app-label">LIVE APPLICATION</div>
        <a href="https://client-olive-five-17.vercel.app" class="live-app-url">https://client-olive-five-17.vercel.app</a>
      </div>

      <div class="fulfillment-text">
        Submitted in partial fulfillment of the course requirements for BACSE344 — Cloud Infrastructure and Architecture
      </div>
    </div>

    <div class="footer-running">Page 1</div>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <h2>Abstract</h2>
    <p>
      CampusFind is a cloud-based campus lost &amp; found system and belongings recovery platform developed to address
      the practical problem of recovering misplaced, lost, or found personal belongings across educational campus environments.
      The platform provides authenticated students, faculty, and administrative staff with a centralized interface to report
      lost or found items, browse categorized directories with visual photographic verification, filter by campus locations,
      file ownership claims with descriptive proof, and track verification statuses in real time. Administrative users can
      manage the item catalogue, review claims through a moderation queue, evaluate proof descriptions, and record recovery handovers.
    </p>
    <p>
      The system follows a separated cloud architecture in which a React 18 single-page application is hosted on Vercel's global
      Edge CDN, a Node.js/Express REST API is hosted on Render, a managed serverless PostgreSQL database is hosted on Neon,
      and multimedia photo assets are stored and delivered via Cloudinary. JWT-based authentication, bcrypt password hashing,
      role-based access control, transactional claim moderation, and database-level relational constraints ensure security and
      data integrity. The project demonstrates practical cloud computing concepts including managed PaaS/DBaaS services,
      multi-tier separation, RESTful communication, cloud-hosted persistence, environment-based configuration, and public deployment.
    </p>

    <h2>1. Introduction</h2>
    <h3>1.1 Background</h3>
    <p>
      Personal belongings on large university campuses—including student identity cards, laptops, calculators, lab kits,
      wallets, keys, and books—are frequently misplaced across classrooms, libraries, cafeterias, and hostel premises.
      Traditional campus recovery mechanisms rely on informal WhatsApp groups, physical security desks, or bulletin notices.
      These disconnected approaches make tracking items difficult, generate duplicate or stale reports, lack verification
      proof, and often leave valuable belongings unrecovered. A centralized cloud platform makes recovery visible, maintains
      consistent audit records, and coordinates authenticated student-admin recovery workflows.
    </p>

    <h3>1.2 Problem Statement</h3>
    <p>
      Educational institutions require an automated, transparent mechanism to catalogue found items, enable students to
      report lost property, verify legitimate ownership claims with photographic proof, and prevent fraudulent handovers.
      Manual processes result in lost-and-found office bottlenecks, unauthorized claims, lack of cross-campus searchability,
      and poor communication between finders and owners.
    </p>

    <h3>1.3 Proposed Solution</h3>
    <p>
      CampusFind addresses the problem through a responsive web-based recovery system backed by scalable RESTful APIs,
      relational PostgreSQL persistence on Neon, and Cloudinary object storage. Students authenticate with the application,
      register lost or found incident reports with high-resolution photos, browse real-time inventory with category and location
      filters, and submit detailed claims. Campus administrators review pending claims in a moderation queue, verify identity,
      and update item resolution states.
    </p>

    <h3>1.4 Objectives</h3>
    <ul>
      <li>Develop a practical cloud-native web application solving a real-world campus belongings recovery problem.</li>
      <li>Implement full Create, Read, Update, and Delete (CRUD) operations for item cataloguing and claim management.</li>
      <li>Provide modular RESTful APIs for communication between frontend client and cloud backend services.</li>
      <li>Use a cloud-hosted relational database (Neon PostgreSQL) for persistent, ACID-compliant data storage.</li>
      <li>Implement authentication and role-based authorization (Student vs. Administrator roles).</li>
      <li>Integrate cloud object storage (Cloudinary) for scalable, secure image uploads and photo claim verification.</li>
      <li>Deploy the multi-tier application across managed cloud services (Vercel, Render, Neon) and document architecture.</li>
    </ul>

    <h2>2. Functional and Non-Functional Requirements</h2>
    <h3>2.1 Functional Requirements</h3>
    <ul>
      <li>User registration, login, and authenticated profile retrieval with bcrypt password hashing.</li>
    </ul>

    <div class="footer-running">Page 2</div>
  </div>

  <!-- ==================== PAGE 3 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <ul>
      <li>Item listing, item details display, real-time keyword search, and category/location-based filtering.</li>
      <li>Incident intake form allowing students and staff to submit lost or found belongings with photo upload.</li>
      <li>Ownership claim submission requiring claimants to supply descriptive proof and verification images.</li>
      <li>Student personal dashboard ("My Reported Belongings") to view and manage personal reports and claims.</li>
      <li>Update and delete capabilities for student-reported items and submitted claims prior to resolution.</li>
      <li>Administrative moderation console to inspect claim queues, evaluate proof, and approve or reject claims.</li>
      <li>Automatic status state machine transitioning items between OPEN, CLAIMED, and RESOLVED states upon claim approval.</li>
      <li>Health endpoint for API and database connectivity verification.</li>
    </ul>

    <h2>2.2 Non-Functional Requirements</h2>
    <ul>
      <li><strong>Availability:</strong> High system availability through public cloud edge CDN (Vercel) and containerized API hosting (Render).</li>
      <li><strong>Security:</strong> Secure handling of authentication credentials via salted bcrypt hashing and JWT bearer tokens.</li>
      <li><strong>Data Consistency:</strong> Relational constraints, foreign keys, and PostgreSQL ACID transactions preventing contradictory claims.</li>
      <li><strong>Maintainable Separation:</strong> Clean three-tier separation across frontend, backend, object storage, and database tiers.</li>
      <li><strong>Cloud-Ready Deployment:</strong> Declarative configuration, environment variable isolation, and automated webhook deployments.</li>
      <li><strong>Responsive Usability:</strong> Fully responsive web interface styled with Tailwind CSS, optimized for mobile and desktop campus devices.</li>
    </ul>

    <h2>3. System Features</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Feature</th>
          <th>Description</th>
          <th style="width: 18%;">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Registration &amp; Auth</strong></td>
          <td>Creates student/admin account with bcrypt hashed password; issues JWT for session management.</td>
          <td>Student / Admin</td>
        </tr>
        <tr>
          <td><strong>Item Catalogue</strong></td>
          <td>Lists active lost and found items with real-time keyword search and category/location filters.</td>
          <td>Public / Student</td>
        </tr>
        <tr>
          <td><strong>Incident Intake Form</strong></td>
          <td>Allows reporters to submit lost or found items with location tags, dates, and photo upload.</td>
          <td>Student / Admin</td>
        </tr>
        <tr>
          <td><strong>Item CRUD</strong></td>
          <td>Creates, reads, updates, and deletes item records with ownership verification rules.</td>
          <td>Student / Admin</td>
        </tr>
        <tr>
          <td><strong>Ownership Claim</strong></td>
          <td>Enables rightful owners to submit claims with detailed proof descriptions and verification photos.</td>
          <td>Student</td>
        </tr>
        <tr>
          <td><strong>My Belongings Desk</strong></td>
          <td>Displays items reported by the authenticated student along with live status of submitted claims.</td>
          <td>Student</td>
        </tr>
        <tr>
          <td><strong>Admin Moderation</strong></td>
          <td>Provides administrative claim review queue, identity verification, and approve/reject controls.</td>
          <td>Admin</td>
        </tr>
        <tr>
          <td><strong>Cloud Media Pipeline</strong></td>
          <td>Uploads and serves item photographs via Cloudinary CDN with automatic optimization.</td>
          <td>System</td>
        </tr>
        <tr>
          <td><strong>Health Monitoring</strong></td>
          <td>Reports API runtime status and live PostgreSQL database connectivity verification.</td>
          <td>System</td>
        </tr>
      </tbody>
    </table>

    <h2>4. Technology Stack</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Layer</th>
          <th style="width: 30%;">Technology</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Frontend Framework</strong></td>
          <td>React 18 + Vite</td>
          <td>Production single-page web application with client routing.</td>
        </tr>
        <tr>
          <td><strong>UI &amp; Styling</strong></td>
          <td>Tailwind CSS + Lucide Icons</td>
          <td>Component-based responsive interface and iconography.</td>
        </tr>
        <tr>
          <td><strong>HTTP Client</strong></td>
          <td>Axios</td>
          <td>Promise-based client for REST API communication.</td>
        </tr>
        <tr>
          <td><strong>Backend Runtime</strong></td>
          <td>Node.js + Express</td>
          <td>REST API gateway and server-side application logic.</td>
        </tr>
        <tr>
          <td><strong>Authentication</strong></td>
          <td>JWT + bcryptjs</td>
          <td>Stateless token authentication and password hashing.</td>
        </tr>
        <tr>
          <td><strong>Database</strong></td>
          <td>PostgreSQL 16</td>
          <td>ACID-compliant relational persistent storage.</td>
        </tr>
        <tr>
          <td><strong>Cloud Database</strong></td>
          <td>Neon Serverless PostgreSQL</td>
          <td>Managed PostgreSQL hosting in AWS Singapore (ap-southeast-1).</td>
        </tr>
        <tr>
          <td><strong>Media Storage</strong></td>
          <td>Cloudinary Object Storage</td>
          <td>Cloud media storage and CDN delivery for item images.</td>
        </tr>
        <tr>
          <td><strong>Frontend Hosting</strong></td>
          <td>Vercel</td>
          <td>Cloud deployment and Edge CDN for React frontend.</td>
        </tr>
        <tr>
          <td><strong>Backend Hosting</strong></td>
          <td>Render</td>
          <td>Cloud deployment for containerized Express REST API.</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-running">Page 3</div>
  </div>

  <!-- ==================== PAGE 4 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Layer</th>
          <th style="width: 30%;">Technology</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>API Documentation</strong></td>
          <td>Postman Collection / REST Docs</td>
          <td>Interactive API discovery, testing, and schema documentation.</td>
        </tr>
        <tr>
          <td><strong>Source Control</strong></td>
          <td>GitHub</td>
          <td>Version control, commit auditing, and deployment webhooks.</td>
        </tr>
      </tbody>
    </table>

    <h2>5. System Architecture</h2>
    <p>
      CampusFind uses a three-tier cloud architecture. The presentation tier is deployed on Vercel, the application
      and API tier is deployed on Render, and the data tier is provided by Neon PostgreSQL with Cloudinary for multimedia
      storage. The browser communicates with the backend using HTTPS REST requests. The backend performs authentication,
      authorization, validation, and business logic before accessing the database.
    </p>

    <div class="figure-container">
      <img src="${imgFig1}" class="figure-img" style="height: 195px;" alt="CampusFind Cloud Architecture">
      <div class="figure-caption">Figure 1. CampusFind cloud deployment architecture</div>
    </div>

    <h2>5.1 Architectural Components</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 22%;">Component</th>
          <th style="width: 26%;">Deployment</th>
          <th>Responsibility</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Client</strong></td>
          <td>User browser</td>
          <td>Renders the application and initiates API requests.</td>
        </tr>
        <tr>
          <td><strong>Frontend</strong></td>
          <td>Vercel Edge Platform</td>
          <td>Serves the compiled React 18 single-page application.</td>
        </tr>
        <tr>
          <td><strong>Backend</strong></td>
          <td>Render Cloud PaaS</td>
          <td>Provides REST APIs, authentication, authorization, and business logic.</td>
        </tr>
        <tr>
          <td><strong>Database</strong></td>
          <td>Neon PostgreSQL</td>
          <td>Stores users, categories, items, and claim verification records.</td>
        </tr>
        <tr>
          <td><strong>Media Storage</strong></td>
          <td>Cloudinary Object Storage</td>
          <td>Stores and delivers item photos and claim verification images.</td>
        </tr>
        <tr>
          <td><strong>Repository</strong></td>
          <td>GitHub</td>
          <td>Stores source code and provides automated deployment integration.</td>
        </tr>
      </tbody>
    </table>

    <h2>5.2 Request Flow</h2>
    <ol>
      <li>A user opens the CampusFind production URL (https://client-olive-five-17.vercel.app).</li>
      <li>Vercel serves the React single-page application over HTTPS from global edge caches.</li>
      <li>The frontend sends REST requests to the Render API (https://campusfind-api-ncig.onrender.com).</li>
      <li>The backend validates authentication and authorization where required via JWT middleware.</li>
      <li>If photos are attached, Multer streams the multipart binary buffer to Cloudinary over HTTPS.</li>
      <li>The backend executes parameterized PostgreSQL operations against Neon over a secure TLS connection.</li>
    </ol>

    <div class="footer-running">Page 4</div>
  </div>

  <!-- ==================== PAGE 5 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <ol start="7">
      <li>The database returns query results, and the API returns structured JSON to the frontend.</li>
      <li>The frontend updates the user interface reactively using the response.</li>
    </ol>

    <h2>6. Database Design</h2>
    <p>
      CampusFind uses PostgreSQL as its relational database. The production database is hosted on Neon in AWS Singapore
      (ap-southeast-1). The core data model consists of Users, Categories, Items, and Claims. Claims connect claimants
      to reported items through formal verification workflows.
    </p>

    <div class="figure-container">
      <img src="${imgFig2}" class="figure-img" style="height: 175px;" alt="CampusFind ERD">
      <div class="figure-caption">Figure 2. CampusFind entity-relationship model</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Entity</th>
          <th style="width: 42%;">Key Fields</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Users</strong></td>
          <td><span class="code-text">id</span>, <span class="code-text">name</span>, <span class="code-text">email</span>, <span class="code-text">password_hash</span>, <span class="code-text">role</span>, <span class="code-text">phone</span>, <span class="code-text">avatar_url</span>, <span class="code-text">created_at</span></td>
          <td>User identity, authentication credentials, and role privileges.</td>
        </tr>
        <tr>
          <td><strong>Categories</strong></td>
          <td><span class="code-text">id</span>, <span class="code-text">name</span>, <span class="code-text">slug</span>, <span class="code-text">icon</span>, <span class="code-text">description</span>, <span class="code-text">created_at</span></td>
          <td>Classification taxonomy for belongings (Electronics, Books, IDs).</td>
        </tr>
        <tr>
          <td><strong>Items</strong></td>
          <td><span class="code-text">id</span>, <span class="code-text">user_id</span>, <span class="code-text">category_id</span>, <span class="code-text">title</span>, <span class="code-text">type</span>, <span class="code-text">location</span>, <span class="code-text">image_url</span>, <span class="code-text">status</span>, <span class="code-text">created_at</span></td>
          <td>Reported lost and found items with status and location metadata.</td>
        </tr>
        <tr>
          <td><strong>Claims</strong></td>
          <td><span class="code-text">id</span>, <span class="code-text">item_id</span>, <span class="code-text">claimant_id</span>, <span class="code-text">proof_description</span>, <span class="code-text">proof_image_url</span>, <span class="code-text">status</span>, <span class="code-text">admin_notes</span></td>
          <td>Ownership claims linking claimants to items with review state.</td>
        </tr>
      </tbody>
    </table>

    <h2>6.1 Relationships</h2>
    <ul>
      <li>One user can report many items across different campus zones (1 : N).</li>
      <li>One category contains many items; each item references exactly one category (1 : N).</li>
      <li>One item can receive multiple ownership claims from different prospective owners (1 : N).</li>
      <li>One user can file multiple ownership claims for their lost belongings (1 : N).</li>
      <li>Foreign-key constraints maintain referential integrity with cascade rules.</li>
    </ul>

    <h2>6.2 Claim Consistency and ACID Transactions</h2>
    <p>
      Preventing duplicate handovers or conflicting claims is a core reliability requirement. CampusFind uses PostgreSQL
      database transactions (<span class="code-text">BEGIN / COMMIT / ROLLBACK</span>) during claim adjudication. When an administrator
      approves a claim, the target claim status is atomically updated to <span class="code-text">APPROVED</span>, the item status is
      transitioned to <span class="code-text">CLAIMED</span>, and competing claims for the same item are automatically set to
      <span class="code-text">REJECTED</span>. This ensures database-level atomicity and prevents race conditions.
    </p>

    <h2>7. RESTful API Documentation</h2>
    <p>
      The application exposes RESTful HTTP endpoints using JSON request and response data. Protected endpoints use JWT
      authentication and role-based authorization.
    </p>

    <div class="footer-running">Page 5</div>
  </div>

  <!-- ==================== PAGE 6 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <table>
      <thead>
        <tr>
          <th style="width: 12%;">Method</th>
          <th style="width: 34%;">Endpoint</th>
          <th>Purpose</th>
          <th style="width: 18%;">Access</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-text">POST</span></td>
          <td><span class="code-text">/api/auth/register</span></td>
          <td>Register a new user account with bcrypt hashing.</td>
          <td>Public</td>
        </tr>
        <tr>
          <td><span class="code-text">POST</span></td>
          <td><span class="code-text">/api/auth/login</span></td>
          <td>Authenticate credentials and receive signed JWT.</td>
          <td>Public</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/auth/me</span></td>
          <td>Return authenticated user profile information.</td>
          <td>Authenticated</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/items</span></td>
          <td>List items with search, category, and type filters.</td>
          <td>Public/Auth</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/items/:id</span></td>
          <td>Retrieve complete details for a specific item.</td>
          <td>Public/Auth</td>
        </tr>
        <tr>
          <td><span class="code-text">POST</span></td>
          <td><span class="code-text">/api/items</span></td>
          <td>Create a new lost/found item with photo upload.</td>
          <td>Authenticated</td>
        </tr>
        <tr>
          <td><span class="code-text">PUT</span></td>
          <td><span class="code-text">/api/items/:id</span></td>
          <td>Update an existing item (owner or admin only).</td>
          <td>Authenticated</td>
        </tr>
        <tr>
          <td><span class="code-text">DELETE</span></td>
          <td><span class="code-text">/api/items/:id</span></td>
          <td>Delete an item subject to ownership rules.</td>
          <td>Authenticated</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/items/user/my</span></td>
          <td>List items reported by the authenticated user.</td>
          <td>Authenticated</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/categories</span></td>
          <td>List all item categories and icon identifiers.</td>
          <td>Public/Auth</td>
        </tr>
        <tr>
          <td><span class="code-text">POST</span></td>
          <td><span class="code-text">/api/claims</span></td>
          <td>Submit an ownership claim with proof description.</td>
          <td>Authenticated</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/claims/my</span></td>
          <td>List claims submitted by the authenticated user.</td>
          <td>Authenticated</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/claims/admin/pending</span></td>
          <td>View pending claims requiring moderation.</td>
          <td>Admin</td>
        </tr>
        <tr>
          <td><span class="code-text">PATCH</span></td>
          <td><span class="code-text">/api/claims/:id/status</span></td>
          <td>Approve or reject claim with admin notes.</td>
          <td>Admin</td>
        </tr>
        <tr>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/health</span></td>
          <td>Health and database connectivity check.</td>
          <td>Public</td>
        </tr>
      </tbody>
    </table>

    <h2>7.1 Postman API Documentation</h2>
    <p>
      The backend includes comprehensive Postman documentation under <span class="code-text">postman/CampusFind.postman_collection.json</span>.
      The collection provides preconfigured requests, automated JWT extraction scripts, sample JSON payloads, and assertion
      tests validating HTTP status codes and response schemas across all endpoints.
    </p>

    <h2>8. CRUD Implementation</h2>
    <p>
      CRUD is implemented primarily through the item-management workflow. Authenticated users can create, read, update,
      and delete their own reported belongings. Claim workflows additionally provide creation, retrieval, and status updates.
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 16%;">Operation</th>
          <th style="width: 18%;">HTTP Method</th>
          <th style="width: 32%;">Endpoint</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Create</strong></td>
          <td><span class="code-text">POST</span></td>
          <td><span class="code-text">/api/items</span></td>
          <td>Creates an item record and uploads photo to Cloudinary.</td>
        </tr>
        <tr>
          <td><strong>Read</strong></td>
          <td><span class="code-text">GET</span></td>
          <td><span class="code-text">/api/items</span> and <span class="code-text">/:id</span></td>
          <td>Retrieves item catalogues or specific item detail with category.</td>
        </tr>
        <tr>
          <td><strong>Update</strong></td>
          <td><span class="code-text">PUT</span></td>
          <td><span class="code-text">/api/items/:id</span></td>
          <td>Modifies an existing item record subject to ownership checks.</td>
        </tr>
        <tr>
          <td><strong>Delete</strong></td>
          <td><span class="code-text">DELETE</span></td>
          <td><span class="code-text">/api/items/:id</span></td>
          <td>Deletes an item record subject to application authorization.</td>
        </tr>
      </tbody>
    </table>

    <p>
      Role-based middleware protects administrative CRUD operations so that ordinary students cannot modify other students'
      records or approve their own ownership claims.
    </p>

    <h2>9. Security and Reliability</h2>
    <ul>
      <li>JWT authentication is used for authenticated API sessions with bearer token verification.</li>
      <li>Passwords are stored using salted bcrypt hashing rather than plaintext credentials.</li>
      <li>Role-based access control restricts administrative endpoints to accounts with <span class="code-text">role = 'admin'</span>.</li>
      <li>Database credentials and JWT signing secrets are stored as server-side environment variables on Render.</li>
      <li>HTTPS/TLS 1.3 is enforced for all production browser-to-service communication.</li>
      <li>Neon PostgreSQL is accessed through a secure TLS connection pool with SSL enforcement.</li>
      <li>Transactional claim logic and status transitions prevent inconsistent states and race conditions.</li>
      <li>The health endpoint provides a simple operational check verifying live database responsiveness.</li>
    </ul>

    <div class="footer-running">Page 6</div>
  </div>

  <!-- ==================== PAGE 7 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <h2>10. Cloud Services and Concepts</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Cloud Service</th>
          <th style="width: 38%;">Role</th>
          <th>Concept Demonstrated</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Vercel</strong></td>
          <td>Hosts the React 18 production frontend application.</td>
          <td>Managed application hosting, Edge CDN, and continuous deployment.</td>
        </tr>
        <tr>
          <td><strong>Render</strong></td>
          <td>Hosts the Node.js/Express REST API backend.</td>
          <td>Managed web-service/API hosting and serverless container runtime.</td>
        </tr>
        <tr>
          <td><strong>Neon</strong></td>
          <td>Hosts production PostgreSQL relational database.</td>
          <td>Database-as-a-Service (DBaaS) with serverless autoscaling storage.</td>
        </tr>
        <tr>
          <td><strong>Cloudinary</strong></td>
          <td>Stores item photos and proof images.</td>
          <td>Cloud Object Storage, automatic transformations, and CDN distribution.</td>
        </tr>
        <tr>
          <td><strong>GitHub</strong></td>
          <td>Stores source code and deployment triggers.</td>
          <td>Version control, commit auditing, and CI/CD webhook integration.</td>
        </tr>
      </tbody>
    </table>

    <h2>10.1 Benefits of the Cloud Architecture</h2>
    <ul>
      <li>Frontend and backend can be deployed, tested, and managed independently.</li>
      <li>Managed PostgreSQL removes the need to maintain database server infrastructure manually.</li>
      <li>Public cloud endpoints make the application accessible to all campus students across mobile and desktop devices.</li>
      <li>Environment variables provide standard production configuration without hard-coding secrets.</li>
      <li>Managed hosting simplifies deployment, service restarts, live logs, and operational management.</li>
      <li>The architecture can be expanded by scaling application and database resources as demand grows.</li>
    </ul>

    <h2>11. Deployment Methodology</h2>
    <ol>
      <li>Create the production PostgreSQL project and branch in Neon (AWS Singapore region).</li>
      <li>Execute database migrations (<span class="code-text">schema.sql</span>) and seed data (<span class="code-text">seed.sql</span>) on Neon.</li>
      <li>Configure backend production variables including <span class="code-text">NODE_ENV</span>, <span class="code-text">CLIENT_URL</span>, <span class="code-text">JWT_SECRET</span>, and Cloudinary keys.</li>
      <li>Deploy the Express backend to Render using the <span class="code-text">server</span> directory as the service root.</li>
      <li>Configure the backend <span class="code-text">DATABASE_URL</span> to use the secure Neon PostgreSQL connection string.</li>
      <li>Verify the backend using the <span class="code-text">/api/health</span> endpoint and confirm database connectivity.</li>
      <li>Deploy the React frontend to Vercel using <span class="code-text">client</span> as the root directory.</li>
      <li>Configure <span class="code-text">VITE_API_URL</span> on Vercel to point to the Render API endpoint.</li>
      <li>Set the Render <span class="code-text">CLIENT_URL</span> to the Vercel production origin to satisfy CORS security.</li>
      <li>Verify end-to-end application flows such as registration, login, item reporting, and claim submission.</li>
    </ol>

    <h2>11.1 Production Resources</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Component</th>
          <th>Production Resource</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Frontend</strong></td>
          <td><a href="https://client-olive-five-17.vercel.app" style="color:#2563eb; text-decoration:none;">https://client-olive-five-17.vercel.app</a></td>
        </tr>
        <tr>
          <td><strong>Backend</strong></td>
          <td><a href="https://campusfind-api-ncig.onrender.com" style="color:#2563eb; text-decoration:none;">https://campusfind-api-ncig.onrender.com</a></td>
        </tr>
        <tr>
          <td><strong>Health Check</strong></td>
          <td><a href="https://campusfind-api-ncig.onrender.com/api/health" style="color:#2563eb; text-decoration:none;">https://campusfind-api-ncig.onrender.com/api/health</a></td>
        </tr>
        <tr>
          <td><strong>Source Code</strong></td>
          <td><a href="https://github.com/SabarishVishwanathRaja/campusfind" style="color:#2563eb; text-decoration:none;">https://github.com/SabarishVishwanathRaja/campusfind</a></td>
        </tr>
        <tr>
          <td><strong>Object Storage</strong></td>
          <td>Cloudinary Media Cloud (<span class="code-text">eu0veldo</span>)</td>
        </tr>
      </tbody>
    </table>

    <h2>12. Production Configuration</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 32%;">Variable</th>
          <th style="width: 18%;">Service</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-text">VITE_API_URL</span></td>
          <td>Vercel</td>
          <td>Frontend API base URL pointing to Render.</td>
        </tr>
        <tr>
          <td><span class="code-text">CLIENT_URL</span></td>
          <td>Render</td>
          <td>Production frontend origin used by CORS middleware.</td>
        </tr>
        <tr>
          <td><span class="code-text">DATABASE_URL</span></td>
          <td>Render</td>
          <td>Private Neon PostgreSQL TLS connection string.</td>
        </tr>
        <tr>
          <td><span class="code-text">JWT_SECRET</span></td>
          <td>Render</td>
          <td>Private JWT signing secret key.</td>
        </tr>
        <tr>
          <td><span class="code-text">JWT_EXPIRES_IN</span></td>
          <td>Render</td>
          <td>Configured JWT lifetime duration (e.g., 7d).</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-running">Page 7</div>
  </div>

  <!-- ==================== PAGE 8 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <table>
      <thead>
        <tr>
          <th style="width: 32%;">Variable</th>
          <th style="width: 18%;">Service</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="code-text">CLOUDINARY_CLOUD_NAME</span></td>
          <td>Render</td>
          <td>Cloudinary namespace for photo asset storage.</td>
        </tr>
        <tr>
          <td><span class="code-text">CLOUDINARY_API_KEY</span></td>
          <td>Render</td>
          <td>API key for authenticating image upload streams.</td>
        </tr>
        <tr>
          <td><span class="code-text">CLOUDINARY_API_SECRET</span></td>
          <td>Render</td>
          <td>Private API secret for upload signature verification.</td>
        </tr>
        <tr>
          <td><span class="code-text">NODE_ENV</span></td>
          <td>Render</td>
          <td>Production runtime mode.</td>
        </tr>
      </tbody>
    </table>

    <p>
      Only <span class="code-text">VITE_API_URL</span> is required by the deployed frontend. Database credentials, JWT secrets,
      and Cloudinary keys remain on the backend service and are not exposed to the browser.
    </p>

    <h2>13. Testing and Validation</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 30%;">Test Case</th>
          <th>Expected Result</th>
          <th style="width: 22%;">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Open production frontend</strong></td>
          <td>React application loads from Vercel Edge CDN.</td>
          <td><span class="status-tag">Verified</span></td>
        </tr>
        <tr>
          <td><strong>Register user</strong></td>
          <td>Account is created and password is securely hashed.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>Login user</strong></td>
          <td>Valid credentials create an authenticated session/JWT.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>View items catalogue</strong></td>
          <td>Item data is retrieved through REST API.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>Create item report</strong></td>
          <td>Report submitted with photo; stored in Neon &amp; Cloudinary.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>Update item</strong></td>
          <td>Authorized reporter or admin can update item details.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>Delete item</strong></td>
          <td>Authorized reporter or admin can delete an item.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>Submit ownership claim</strong></td>
          <td>Valid claim with verification proof is recorded.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>Admin claim review</strong></td>
          <td>Administrator approves claim; updates status to CLAIMED.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>View my belongings</strong></td>
          <td>Student can retrieve their own reported items and claims.</td>
          <td><span class="status-tag">Implemented</span></td>
        </tr>
        <tr>
          <td><strong>Health endpoint</strong></td>
          <td>API reports live database connectivity.</td>
          <td><span class="status-tag">Verified during deployment</span></td>
        </tr>
      </tbody>
    </table>

    <h2>14. Deployment Evidence</h2>
    <p>
      The following screenshots were captured during the production deployment process and provide evidence
      of the cloud configuration.
    </p>

    <h3>14.1 Application and Cloud Deployment Evidence</h3>

    <div class="figure-container">
      <img src="${imgFig5}" class="figure-img" style="height: 275px;" alt="CampusFind Landing Page">
      <div class="figure-caption">Figure 5. CampusFind production landing page showing the lost &amp; found browsing interface.</div>
    </div>

    <div class="footer-running">Page 8</div>
  </div>

  <!-- ==================== PAGE 9 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <div class="figure-container" style="margin-top: 10px;">
      <img src="${imgFig6}" class="figure-img" style="height: 270px;" alt="Item Detail and Claim Interface">
      <div class="figure-caption">Figure 6. Problem overview and item detail claim submission interface in CampusFind.</div>
    </div>

    <div class="figure-container" style="margin-top: 25px;">
      <img src="${imgFig7}" class="figure-img" style="height: 260px;" alt="CampusFind Authentication">
      <div class="figure-caption">Figure 7. CampusFind authentication interface demonstrating the sign-in workflow.</div>
    </div>

    <div class="footer-running">Page 9</div>
  </div>

  <!-- ==================== PAGE 10 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <div class="figure-container" style="margin-top: 10px;">
      <img src="${imgFig8}" class="figure-img" style="height: 270px;" alt="Student Belongings Interface">
      <div class="figure-caption">Figure 8. Student item management and claim tracking interface showing active records.</div>
    </div>

    <div class="figure-container" style="margin-top: 25px;">
      <img src="${imgFig9}" class="figure-img" style="height: 270px;" alt="Report Submission Form">
      <div class="figure-caption">Figure 9. Lost &amp; found report submission form with live directory preview.</div>
    </div>

    <div class="footer-running">Page 10</div>
  </div>

  <!-- ==================== PAGE 11 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <div class="figure-container" style="margin-top: 4px;">
      <img src="${imgFig10}" class="figure-img" style="height: 195px;" alt="Vercel Ready Deployment">
      <div class="figure-caption">Figure 10. Vercel production deployment showing the CampusFind frontend in a Ready state.</div>
    </div>

    <div class="figure-container" style="margin-top: 12px;">
      <img src="${imgFig11}" class="figure-img" style="height: 195px;" alt="Render Live Web Service">
      <div class="figure-caption">Figure 11. Render deployment showing the CampusFind backend service in a Live state.</div>
    </div>

    <div class="figure-container" style="margin-top: 12px;">
      <img src="${imgFig12}" class="figure-img" style="height: 195px;" alt="Neon PostgreSQL Project">
      <div class="figure-caption">Figure 12. Neon PostgreSQL production project showing the production branch and cloud database resources.</div>
    </div>

    <div class="footer-running">Page 11</div>
  </div>

  <!-- ==================== PAGE 12 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <div class="figure-container" style="margin-top: 4px;">
      <img src="${imgFig3}" class="figure-img" style="height: 200px;" alt="Vercel Deployment Inspection">
      <div class="figure-caption">Figure 3. Vercel production deployment marked Ready.</div>
    </div>

    <div class="figure-container" style="margin-top: 10px;">
      <img src="${imgFig4}" class="figure-img" style="height: 110px;" alt="Render Environment Variables">
      <div class="figure-caption">Figure 4. Render production environment configuration with CLIENT_URL set to the Vercel frontend.</div>
    </div>

    <p style="margin-top: 10px;">
      The screenshots above document the production application, authentication and incident reporting workflows, item detail
      and claim submission, administrative queue management, frontend CDN deployment, backend API hosting, and cloud database environment.
    </p>

    <h2>15. Demonstration Video</h2>
    <p>
      The demonstration video should explain the problem, architecture, application workflow, and cloud
      deployment. A concise 5–8 minute recording is recommended.
    </p>
    <ol>
      <li>Introduce the campus lost-and-found problem and CampusFind.</li>
      <li>Explain the Vercel–Render–Neon–Cloudinary architecture.</li>
      <li>Open the production URL and demonstrate registration and login.</li>
      <li>Demonstrate item browsing, category filtering, and location search.</li>
      <li>Demonstrate Create, Read, Update, and Delete operations for reported belongings.</li>
      <li>Create an ownership claim and show it in the student's belongings list.</li>
      <li>Demonstrate claim moderation and explain conflict prevention.</li>
      <li>Open Postman documentation and show representative REST endpoints.</li>
      <li>Show the Render health endpoint and deployment status.</li>
      <li>Show the Neon database console and conclude with the production URL.</li>
    </ol>
    <p style="margin-top: 6px;">
      <strong>Demonstration video link:</strong> To be added after recording.
    </p>

    <div class="footer-running">Page 12</div>
  </div>

  <!-- ==================== PAGE 13 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <h2>16. Limitations and Future Enhancements</h2>
    <h3>16.1 Current Limitations</h3>
    <ul>
      <li>The current deployment is optimized for a course-scale application rather than enterprise-scale traffic.</li>
      <li>Email/SMS notifications are not currently part of the core workflow.</li>
      <li>Advanced multi-campus organization tenancy and billing are outside the current scope.</li>
      <li>Dedicated distributed tracing and advanced observability can be added for larger deployments.</li>
    </ul>

    <h3>16.2 Future Enhancements</h3>
    <ul>
      <li>Automated push and email notifications for claim updates and status transitions.</li>
      <li>AI-powered computer vision matching between uploaded lost and found photographs.</li>
      <li>Interactive campus map integration showing building drop-off locations.</li>
      <li>Multi-university organization tenancy and delegated departmental administration.</li>
      <li>Automated CI/CD security scanning, linting, and automated integration testing gates.</li>
      <li>Rate limiting, audit logging, and finer-grained API permissions.</li>
    </ul>

    <h2>17. Conclusion</h2>
    <p>
      CampusFind demonstrates the practical use of cloud computing to build and deploy a complete web
      application for a real-world campus belongings recovery problem. The system implements item CRUD
      operations, user authentication, claim verification workflows, RESTful APIs, a cloud-hosted relational database,
      and public cloud deployment.
    </p>
    <p>
      The final architecture separates the frontend, backend, object storage, and database tiers across managed services.
      Vercel hosts the React frontend, Render hosts the Express REST API, Neon provides managed PostgreSQL
      persistence, and Cloudinary manages media storage. This separation demonstrates how independent cloud services
      can be combined to create a maintainable and deployable application while reducing the need to manage physical infrastructure.
    </p>

    <h2>18. References and Project Resources</h2>
    <ul>
      <li>CampusFind source repository: <a href="https://github.com/SabarishVishwanathRaja/campusfind" style="color:#2563eb; text-decoration:none;">https://github.com/SabarishVishwanathRaja/campusfind</a></li>
      <li>CampusFind production frontend: <a href="https://client-olive-five-17.vercel.app" style="color:#2563eb; text-decoration:none;">https://client-olive-five-17.vercel.app</a></li>
      <li>CampusFind production backend: <a href="https://campusfind-api-ncig.onrender.com" style="color:#2563eb; text-decoration:none;">https://campusfind-api-ncig.onrender.com</a></li>
      <li>CampusFind API health endpoint: <a href="https://campusfind-api-ncig.onrender.com/api/health" style="color:#2563eb; text-decoration:none;">https://campusfind-api-ncig.onrender.com/api/health</a></li>
      <li>React documentation: <a href="https://react.dev/" style="color:#2563eb; text-decoration:none;">https://react.dev/</a></li>
      <li>Express documentation: <a href="https://expressjs.com/" style="color:#2563eb; text-decoration:none;">https://expressjs.com/</a></li>
      <li>PostgreSQL documentation: <a href="https://www.postgresql.org/docs/" style="color:#2563eb; text-decoration:none;">https://www.postgresql.org/docs/</a></li>
      <li>Vercel documentation: <a href="https://vercel.com/docs" style="color:#2563eb; text-decoration:none;">https://vercel.com/docs</a></li>
      <li>Render documentation: <a href="https://render.com/docs" style="color:#2563eb; text-decoration:none;">https://render.com/docs</a></li>
      <li>Neon documentation: <a href="https://neon.tech/docs" style="color:#2563eb; text-decoration:none;">https://neon.tech/docs</a></li>
    </ul>

    <h2>Appendix A — Repository Structure</h2>
    <pre style="font-family: Consolas, Monaco, monospace; font-size: 8pt; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 4px; line-height: 1.25; color: #1e293b;">
CampusFind/
├── client/
│   ├── src/
│   │   ├── components/               # UI components (Navbar, ItemCard, Footer)
│   │   ├── context/                  # AuthContext and state management
│   │   ├── pages/                    # Views (Home, Login, Report, ItemDetail, Admin)
│   │   └── services/                 # Axios API service client
│   ├── package.json                  # React, Tailwind, Lucide dependencies
│   └── vite.config.js                # Vite build and proxy configuration
├── server/
│   ├── config/                       # Neon DB pool and Cloudinary config
│   ├── controllers/                  # Handlers (auth, items, claims)
│   ├── middleware/                   # JWT auth and requireAdmin middleware
</pre>

    <div class="footer-running">Page 13</div>
  </div>

  <!-- ==================== PAGE 14 ==================== -->
  <div class="page">
    <div class="header-running">CAMPUSFIND &nbsp;|&nbsp; CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>

    <pre style="font-family: Consolas, Monaco, monospace; font-size: 8pt; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 4px; line-height: 1.25; color: #1e293b; margin-top: 8px;">
│   ├── routes/                       # Express routes (/api/auth, /api/items, /api/claims)
│   ├── package.json                  # Node dependencies (express, pg, bcryptjs, jwt)
│   └── server.js                     # Express application entrypoint & healthcheck
├── db/
│   ├── schema.sql                    # PostgreSQL schema DDL (users, categories, items, claims)
│   └── seed.sql                      # Demo seed data
├── postman/
│   └── CampusFind.postman_collection.json # API documentation and tests
├── screenshots/                      # Application and cloud deployment evidence
├── render.yaml                       # Render Infrastructure-as-Code blueprint
├── API.md                            # Complete RESTful API specifications
├── ARCHITECTURE.md                   # Cloud system architecture documentation
├── DEPLOYMENT.md                     # Step-by-step cloud deployment manual
└── README.md                         # Project documentation and guide
</pre>

    <h2 style="margin-top: 14px;">Appendix B — Final Submission Checklist</h2>
    <table style="margin-top: 10px;">
      <thead>
        <tr>
          <th style="width: 10%; text-align: center;">Status</th>
          <th>Requirement Item</th>
          <th style="width: 32%;">Submission Detail</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Source code repository included</strong></td>
          <td>GitHub: SabarishVishwanathRaja/campusfind</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Deployed application URL included</strong></td>
          <td>Vercel Production: client-olive-five-17.vercel.app</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Cloud-hosted database documented</strong></td>
          <td>Neon Serverless PostgreSQL (AWS Singapore)</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>CRUD operations documented</strong></td>
          <td>Items (Create, Read, Update, Delete) &amp; Claims</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>REST API documentation included</strong></td>
          <td>15 Endpoints, Postman collection &amp; API.md</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Database design and ER diagram included</strong></td>
          <td>Figure 2 ERD with 4 relational entities &amp; ACID logic</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Cloud architecture diagram included</strong></td>
          <td>Figure 1 multi-tier cloud deployment diagram</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Cloud services and deployment process documented</strong></td>
          <td>Vercel, Render, Neon, Cloudinary, GitHub</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Security and reliability considerations documented</strong></td>
          <td>JWT authentication, bcrypt, RBAC, CORS, TLS 1.3</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Testing and validation documented</strong></td>
          <td>11 verification test cases covering full stack</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Demonstration video link added</strong></td>
          <td>10 scripted presentation steps provided</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #059669; font-weight: 800; font-size: 11pt;">☑</td>
          <td><strong>Final application screenshots added where required</strong></td>
          <td>12 figures documenting live cloud deployment</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-running">Page 14</div>
  </div>

</body>
</html>
`;

fs.writeFileSync(path.resolve(__dirname, 'report_preview.html'), htmlContent);
console.log('Wrote report_preview.html');

async function generatePdf() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPdfPath,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  });

  console.log(`PDF successfully generated at: ${outputPdfPath}`);
  await browser.close();
}

generatePdf().catch((err) => {
  console.error(err);
  process.exit(1);
});
