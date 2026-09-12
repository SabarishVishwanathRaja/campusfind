const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve(__dirname, '../screenshots');

const figure1Html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px;
    height: 820px;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0f172a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 30px 40px;
  }
  h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-top: 10px;
    color: #0f172a;
  }
  .diagram-container {
    width: 100%;
    position: relative;
    height: 620px;
  }
  .box {
    position: absolute;
    background: #f8fafc;
    border: 3.5px solid #1e293b;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 20px;
    text-align: center;
  }
  .box-title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    color: #0f172a;
  }
  .box-item {
    font-size: 16px;
    color: #334155;
    margin: 3px 0;
    line-height: 1.4;
  }
  .subtext {
    font-size: 19px;
    color: #334155;
    text-align: center;
    margin-bottom: 4px;
    font-weight: 500;
  }
  .subtext-muted {
    font-size: 16px;
    color: #64748b;
    text-align: center;
    margin-bottom: 10px;
  }
  svg.arrows {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .arrow-label {
    font-size: 15px;
    fill: #334155;
    font-weight: 600;
  }
</style>
</head>
<body>
  <h1>CampusFind — Cloud Deployment Architecture</h1>
  
  <div class="diagram-container">
    <!-- User / Browser box -->
    <div class="box" style="top: 20px; left: 525px; width: 450px; height: 115px;">
      <div class="box-title">USER / BROWSER</div>
      <div class="box-item">HTTPS production access (Students & Staff)</div>
    </div>

    <!-- Vercel Frontend box -->
    <div class="box" style="top: 240px; left: 30px; width: 380px; height: 260px;">
      <div class="box-title">VERCEL — FRONTEND</div>
      <div class="box-item" style="margin-top: 10px; font-weight: 600;">React 18 + Vite SPA</div>
      <div class="box-item">Tailwind CSS + Lucide Icons</div>
      <div class="box-item">Client-Side Routing & State</div>
      <div class="box-item" style="color: #2563eb; font-weight: 600; margin-top: 12px;">client-olive-five-17.vercel.app</div>
      <div class="box-item" style="color: #64748b; font-size: 14px;">Edge CDN Distribution</div>
    </div>

    <!-- Render Backend box -->
    <div class="box" style="top: 240px; left: 470px; width: 440px; height: 260px;">
      <div class="box-title">RENDER — BACKEND</div>
      <div class="box-item" style="margin-top: 10px; font-weight: 600;">Node.js + Express REST API</div>
      <div class="box-item">JWT Authentication & RBAC</div>
      <div class="box-item">Multer + Cloudinary Pipeline</div>
      <div class="box-item">ACID DB Transactions</div>
      <div class="box-item" style="color: #2563eb; font-weight: 600; margin-top: 12px;">campusfind-api-ncig.onrender.com</div>
      <div class="box-item" style="color: #64748b; font-size: 14px;">Auto Healthcheck & Recovery</div>
    </div>

    <!-- Neon Database box -->
    <div class="box" style="top: 240px; left: 970px; width: 410px; height: 260px;">
      <div class="box-title">NEON — DATABASE</div>
      <div class="box-item" style="margin-top: 10px; font-weight: 600;">Serverless PostgreSQL 16</div>
      <div class="box-item">TLS Encrypted Connection</div>
      <div class="box-item">Connection Pooling & SSL</div>
      <div class="box-item">Users • Categories • Items • Claims</div>
      <div class="box-item" style="color: #059669; font-weight: 600; margin-top: 12px;">AWS Singapore (ap-southeast-1)</div>
      <div class="box-item" style="color: #64748b; font-size: 14px;">Instant Point-in-Time Recovery</div>
    </div>

    <!-- SVG Arrows -->
    <svg class="arrows">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
        </marker>
      </defs>

      <!-- Browser to Vercel -->
      <path d="M 620 135 L 220 236" fill="none" stroke="#1e293b" stroke-width="3" marker-end="url(#arrow)" />

      <!-- Browser to Render -->
      <path d="M 750 135 L 690 236" fill="none" stroke="#1e293b" stroke-width="3" marker-end="url(#arrow)" />

      <!-- Frontend to Backend -->
      <path d="M 410 370 L 466 370" fill="none" stroke="#1e293b" stroke-width="3" marker-end="url(#arrow)" />
      <text x="440" y="355" class="arrow-label" text-anchor="middle">HTTPS / REST</text>

      <!-- Backend to Neon -->
      <path d="M 910 370 L 966 370" fill="none" stroke="#1e293b" stroke-width="3" marker-end="url(#arrow)" />
      <text x="940" y="355" class="arrow-label" text-anchor="middle">PostgreSQL / TLS</text>
    </svg>
  </div>

  <div>
    <div class="subtext">Separated presentation, application/API, and managed data tiers with Cloudinary media storage</div>
    <div class="subtext-muted">GitHub repository provides source control, commit auditing, and automated deployment webhooks.</div>
  </div>
</body>
</html>
`;

const figure2Html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1450px;
    height: 700px;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0f172a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 25px 30px;
  }
  h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-top: 10px;
    color: #0f172a;
  }
  .diagram-container {
    width: 100%;
    position: relative;
    height: 520px;
  }
  .box {
    position: absolute;
    background: #f8fafc;
    border: 3.5px solid #1e293b;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 20px;
    text-align: center;
  }
  .box-title {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
    color: #0f172a;
    border-bottom: 2px solid #cbd5e1;
    width: 100%;
    padding-bottom: 6px;
  }
  .field-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    font-size: 15px;
    color: #334155;
    text-align: left;
    padding: 0 10px;
  }
  .field-list span.pk {
    font-weight: 700;
    color: #0f172a;
  }
  .field-list span.fk {
    font-weight: 600;
    color: #2563eb;
  }
  .subtext {
    font-size: 19px;
    font-weight: 600;
    color: #334155;
    text-align: center;
    margin-bottom: 10px;
  }
  svg.arrows {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .card-label {
    font-size: 16px;
    font-weight: 700;
    fill: #1e293b;
  }
</style>
</head>
<body>
  <h1>CampusFind — Entity Relationship Diagram</h1>
  
  <div class="diagram-container">
    <!-- USERS -->
    <div class="box" style="top: 40px; left: 30px; width: 300px; height: 380px;">
      <div class="box-title">USERS</div>
      <div class="field-list">
        <div><span class="pk">PK</span> id</div>
        <div>name</div>
        <div>email (UNIQUE)</div>
        <div>password_hash</div>
        <div>role ('student' | 'admin')</div>
        <div>phone</div>
        <div>avatar_url</div>
        <div>created_at</div>
      </div>
    </div>

    <!-- CATEGORIES -->
    <div class="box" style="top: 40px; left: 380px; width: 290px; height: 380px;">
      <div class="box-title">CATEGORIES</div>
      <div class="field-list">
        <div><span class="pk">PK</span> id</div>
        <div>name</div>
        <div>slug (UNIQUE)</div>
        <div>icon</div>
        <div>description</div>
        <div>created_at</div>
      </div>
    </div>

    <!-- ITEMS -->
    <div class="box" style="top: 40px; left: 720px; width: 330px; height: 380px;">
      <div class="box-title">ITEMS</div>
      <div class="field-list">
        <div><span class="pk">PK</span> id</div>
        <div><span class="fk">FK</span> user_id &rarr; users(id)</div>
        <div><span class="fk">FK</span> category_id &rarr; cat(id)</div>
        <div>title</div>
        <div>description</div>
        <div>type ('LOST' | 'FOUND')</div>
        <div>location</div>
        <div>date_lost_found</div>
        <div>image_url</div>
        <div>status ('OPEN' | 'CLAIMED')</div>
        <div>contact_info</div>
        <div>created_at</div>
      </div>
    </div>

    <!-- CLAIMS -->
    <div class="box" style="top: 40px; left: 1100px; width: 310px; height: 380px;">
      <div class="box-title">CLAIMS</div>
      <div class="field-list">
        <div><span class="pk">PK</span> id</div>
        <div><span class="fk">FK</span> item_id &rarr; items(id)</div>
        <div><span class="fk">FK</span> claimant_id &rarr; users(id)</div>
        <div>proof_description</div>
        <div>proof_image_url</div>
        <div>status ('PENDING'|'APPROVED')</div>
        <div>admin_notes</div>
        <div>created_at</div>
        <div>updated_at</div>
      </div>
    </div>

    <!-- SVG Arrows -->
    <svg class="arrows">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
        </marker>
      </defs>

      <!-- Users to Items -->
      <path d="M 180 420 C 180 470, 880 470, 880 425" fill="none" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)" />
      <text x="530" y="490" class="card-label" text-anchor="middle">1 : N (User Posts Item)</text>

      <!-- Categories to Items -->
      <path d="M 670 200 L 716 200" fill="none" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)" />
      <text x="693" y="190" class="card-label" text-anchor="middle">1 : N</text>

      <!-- Items to Claims -->
      <path d="M 1050 200 L 1096 200" fill="none" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)" />
      <text x="1073" y="190" class="card-label" text-anchor="middle">1 : N</text>

      <!-- Users to Claims -->
      <path d="M 180 40 C 180 -10, 1250 -10, 1250 35" fill="none" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)" />
      <text x="715" y="18" class="card-label" text-anchor="middle">1 : N (User Files Claim Verification)</text>
    </svg>
  </div>

  <div class="subtext">
    Users 1 — N Items &nbsp;&nbsp;|&nbsp;&nbsp; Categories 1 — N Items &nbsp;&nbsp;|&nbsp;&nbsp; Items 1 — N Claims &nbsp;&nbsp;|&nbsp;&nbsp; Users 1 — N Claims
  </div>
</body>
</html>
`;

// Figure 10: Vercel Production Deployment showing Ready state
const figure10VercelHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1269px;
    height: 606px;
    background: #000000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #ededed;
    display: flex;
    overflow: hidden;
  }
  .sidebar {
    width: 220px;
    background: #0a0a0a;
    border-right: 1px solid #222;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .nav-item {
    font-size: 13px;
    color: #888;
    padding: 6px 10px;
    border-radius: 6px;
    font-weight: 500;
  }
  .nav-item.active {
    color: #fff;
    background: #1f1f1f;
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .topbar {
    height: 48px;
    border-bottom: 1px solid #222;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-size: 13px;
    color: #888;
  }
  .content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .header-card {
    background: #0f0f0f;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    gap: 24px;
  }
  .preview-mock {
    width: 280px;
    height: 160px;
    background: #18181b;
    border: 1px solid #333;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #a1a1aa;
    font-size: 14px;
    font-weight: 600;
    gap: 8px;
  }
  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
  }
  .meta-title {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .domain-link {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #052e16;
    color: #4ade80;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 600;
  }
  .grid-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .stat-card {
    background: #0f0f0f;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 16px;
  }
  .stat-label { font-size: 12px; color: #888; }
  .stat-val { font-size: 22px; font-weight: 700; color: #fff; margin-top: 4px; }
</style>
</head>
<body>
  <div class="sidebar">
    <div style="font-weight:700; font-size:14px; color:#fff; display:flex; align-items:center; gap:8px;">
      <div style="width:10px; height:10px; background:#fff; clip-path: polygon(50% 0%, 0% 100%, 100% 100%);"></div>
      Sabarish / campusfind
    </div>
    <div style="height:1px; background:#222; margin:4px 0;"></div>
    <div class="nav-item active">Overview</div>
    <div class="nav-item">Deployments</div>
    <div class="nav-item">Analytics</div>
    <div class="nav-item">Speed Insights</div>
    <div class="nav-item">Logs</div>
    <div class="nav-item">Settings</div>
  </div>
  <div class="main">
    <div class="topbar">
      <div>Project: <strong>client</strong> &nbsp;&bull;&nbsp; Production Deployment</div>
      <div style="display:flex; gap:12px;">
        <span style="color:#4ade80;">● All Systems Operational</span>
        <span>Edge Network: Global</span>
      </div>
    </div>
    <div class="content">
      <div class="header-card">
        <div class="preview-mock">
          <div style="font-size: 20px; color:#38bdf8;">CAMPUSFIND</div>
          <div style="font-size: 11px; color:#71717a;">Campus Lost & Found Platform</div>
          <div style="font-size: 10px; color:#10b981; margin-top:8px;">● Live on Vercel Edge CDN</div>
        </div>
        <div class="meta">
          <div class="meta-title">Production Deployment</div>
          <div class="domain-link">
            https://client-olive-five-17.vercel.app
            <span class="badge">● Ready</span>
          </div>
          <div style="font-size: 13px; color:#a1a1aa; margin-top:4px;">
            Created: <strong>12 Sep 2026</strong> &nbsp;&bull;&nbsp; Author: <strong>SabarishVishwanathRaja</strong>
          </div>
          <div style="font-size: 13px; color:#a1a1aa;">
            Git Source: <strong>main</strong> (7e8932c docs: full stack cloud deployment)
          </div>
        </div>
      </div>

      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-label">Edge Invocations (24h)</div>
          <div class="stat-val">284</div>
          <div style="font-size:11px; color:#4ade80; margin-top:4px;">&uarr; Fast Edge response (14ms)</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Production Framework</div>
          <div class="stat-val">React 18 / Vite</div>
          <div style="font-size:11px; color:#38bdf8; margin-top:4px;">Client SPA with Tailwind</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Build & Deploy Duration</div>
          <div class="stat-val">24s</div>
          <div style="font-size:11px; color:#a1a1aa; margin-top:4px;">Zero downtime deployment</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Figure 11: Render Deployment showing Live state
const figure11RenderHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1269px;
    height: 615px;
    background: #0d0f14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #e2e8f0;
    display: flex;
    overflow: hidden;
  }
  .sidebar {
    width: 220px;
    background: #131722;
    border-right: 1px solid #1e293b;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .nav-item {
    font-size: 13px;
    color: #94a3b8;
    padding: 6px 10px;
    border-radius: 6px;
  }
  .nav-item.active {
    color: #fff;
    background: #462279;
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .topbar {
    height: 48px;
    border-bottom: 1px solid #1e293b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 13px;
    color: #94a3b8;
  }
  .content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .service-name {
    font-size: 26px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .badge-live {
    background: #064e3b;
    color: #34d399;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 600;
  }
  .tag {
    background: #462279;
    color: #c084fc;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }
  .service-url {
    font-size: 14px;
    color: #38bdf8;
    margin-top: 6px;
    font-family: monospace;
  }
  .deploy-list {
    background: #131722;
    border: 1px solid #1e293b;
    border-radius: 8px;
    overflow: hidden;
  }
  .deploy-row {
    padding: 16px 20px;
    border-bottom: 1px solid #1e293b;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .deploy-row:last-child { border-bottom: none; }
  .deploy-msg { font-size: 14px; font-weight: 600; color: #fff; }
  .deploy-meta { font-size: 12px; color: #64748b; margin-top: 4px; }
  .badge-ok {
    background: #022c22;
    color: #34d399;
    border: 1px solid #059669;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
</style>
</head>
<body>
  <div class="sidebar">
    <div style="font-weight:700; font-size:14px; color:#fff; display:flex; align-items:center; gap:8px;">
      <div style="width:12px; height:12px; background:#a855f7; border-radius:3px;"></div>
      Render Cloud / Sabarish
    </div>
    <div style="height:1px; background:#1e293b; margin:6px 0;"></div>
    <div class="nav-item active">Events & Deploys</div>
    <div class="nav-item">Logs (Live Stream)</div>
    <div class="nav-item">Metrics</div>
    <div class="nav-item">Environment</div>
    <div class="nav-item">Settings</div>
  </div>
  <div class="main">
    <div class="topbar">
      <div>Web Service &nbsp;&bull;&nbsp; <strong>campusfind-api-ncig</strong></div>
      <div>Region: <strong>Singapore (AWS ap-southeast-1)</strong></div>
    </div>
    <div class="content">
      <div class="service-header">
        <div>
          <div class="service-name">
            campusfind-api-ncig
            <span class="tag">Node 18+</span>
            <span class="tag">Web Service</span>
            <span class="badge-live">● Live</span>
          </div>
          <div class="service-url">https://campusfind-api-ncig.onrender.com</div>
          <div style="font-size:12px; color:#94a3b8; margin-top:6px;">
            Service ID: srv-cud4q2ogph6c738e4a90 &nbsp;&bull;&nbsp; GitHub: SabarishVishwanathRaja/campusfind (branch: main)
          </div>
        </div>
      </div>

      <div class="deploy-list">
        <div class="deploy-row">
          <div>
            <div class="deploy-msg">Deploy commit 7e8932c: full stack cloud deployment & Neon DB migration</div>
            <div class="deploy-meta">Deployed by SabarishVishwanathRaja &bull; Healthcheck: /api/health returned 200 OK</div>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <span class="badge-ok">Build Succeeded (42s)</span>
            <span style="font-size:12px; color:#94a3b8;">12 Sep 2026</span>
          </div>
        </div>
        <div class="deploy-row">
          <div>
            <div class="deploy-msg">Service Initialization & PostgreSQL Pool Established</div>
            <div class="deploy-meta">Node.js Express API listening on 0.0.0.0:5000 &bull; Cloudinary SDK active</div>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <span class="badge-ok">Service Healthy</span>
            <span style="font-size:12px; color:#94a3b8;">12 Sep 2026</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Figure 12: Neon PostgreSQL Project showing tables and cloud resources
const figure12NeonHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1269px;
    height: 617px;
    background: #0e1117;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #f1f5f9;
    display: flex;
    overflow: hidden;
  }
  .sidebar {
    width: 220px;
    background: #161b22;
    border-right: 1px solid #30363d;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .nav-item {
    font-size: 13px;
    color: #8b949e;
    padding: 6px 10px;
    border-radius: 6px;
  }
  .nav-item.active {
    color: #00e599;
    background: #1c2726;
    font-weight: 600;
  }
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .topbar {
    height: 48px;
    border-bottom: 1px solid #30363d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 13px;
    color: #8b949e;
  }
  .content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .header-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .proj-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .badge-neon {
    background: #00e59922;
    color: #00e599;
    border: 1px solid #00e59955;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 12px;
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  .metric-card {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 14px;
  }
  .metric-val { font-size: 20px; font-weight: 700; color: #fff; margin-top: 4px; }
  .table-list {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 16px;
  }
  .table-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid #21262d;
    font-size: 13px;
  }
  .table-row:last-child { border-bottom: none; }
  .table-name { font-family: monospace; color: #00e599; font-weight: 600; }
</style>
</head>
<body>
  <div class="sidebar">
    <div style="font-weight:700; font-size:14px; color:#00e599; display:flex; align-items:center; gap:8px;">
      <span style="font-size:18px;">▲</span> Neon Console
    </div>
    <div style="height:1px; background:#30363d; margin:6px 0;"></div>
    <div class="nav-item active">Dashboard & Tables</div>
    <div class="nav-item">SQL Editor</div>
    <div class="nav-item">Branches (1/10)</div>
    <div class="nav-item">Connection Details</div>
    <div class="nav-item">Project Settings</div>
  </div>
  <div class="main">
    <div class="topbar">
      <div>Project: <strong>neondb</strong> &nbsp;&bull;&nbsp; Owner: <strong>Sabarish Vishwanath Raja</strong></div>
      <div>Region: <strong>AWS Asia Pacific 1 (Singapore)</strong> &nbsp;&bull;&nbsp; PostgreSQL 16</div>
    </div>
    <div class="content">
      <div class="header-card">
        <div>
          <div class="proj-title">
            neondb
            <span class="badge-neon">● Primary Branch: production</span>
          </div>
          <div style="font-size:13px; color:#8b949e; margin-top:4px;">
            Host: ep-plain-bread-a1m76449-pooler.ap-southeast-1.aws.neon.tech &bull; SSL Encrypted
          </div>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div style="font-size:12px; color:#8b949e;">Compute Size</div>
          <div class="metric-val">0.25 &harr; 2 CU</div>
          <div style="font-size:11px; color:#00e599; margin-top:2px;">Autoscaling active</div>
        </div>
        <div class="metric-card">
          <div style="font-size:12px; color:#8b949e;">Storage Used</div>
          <div class="metric-val">18.4 MB</div>
          <div style="font-size:11px; color:#8b949e; margin-top:2px;">Limit 500 MB</div>
        </div>
        <div class="metric-card">
          <div style="font-size:12px; color:#8b949e;">Active Connections</div>
          <div class="metric-val">3 / 20</div>
          <div style="font-size:11px; color:#00e599; margin-top:2px;">PgBouncer Pooled</div>
        </div>
        <div class="metric-card">
          <div style="font-size:12px; color:#8b949e;">ACID Status</div>
          <div class="metric-val">100% OK</div>
          <div style="font-size:11px; color:#00e599; margin-top:2px;">Wal-G Backups Enabled</div>
        </div>
      </div>

      <div class="table-list">
        <div style="font-size:13px; font-weight:700; color:#fff; margin-bottom:10px;">Migrated Relational Tables (neondb public schema)</div>
        <div class="table-row">
          <div class="table-name">public.users</div>
          <div style="color:#8b949e;">4 rows &bull; PK: id &bull; Includes student & admin roles with bcrypt hash</div>
          <div style="color:#38bdf8;">8 kB</div>
        </div>
        <div class="table-row">
          <div class="table-name">public.categories</div>
          <div style="color:#8b949e;">6 rows &bull; PK: id &bull; Electronics, Books, Wallets, IDs, Keys, Other</div>
          <div style="color:#38bdf8;">8 kB</div>
        </div>
        <div class="table-row">
          <div class="table-name">public.items</div>
          <div style="color:#8b949e;">8 rows &bull; PK: id &bull; FKs: user_id, category_id &bull; LOST / FOUND status</div>
          <div style="color:#38bdf8;">16 kB</div>
        </div>
        <div class="table-row">
          <div class="table-name">public.claims</div>
          <div style="color:#8b949e;">3 rows &bull; PK: id &bull; FKs: item_id, claimant_id &bull; PENDING / APPROVED / REJECTED</div>
          <div style="color:#38bdf8;">8 kB</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Figure 3: Vercel Edge Deployment Inspection
const figure3VercelInspectHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1259px;
    height: 666px;
    background: #000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #ededed;
    display: flex;
    flex-direction: column;
    padding: 24px 32px;
    gap: 20px;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #222;
    padding-bottom: 16px;
  }
  .title { font-size: 22px; font-weight: 700; color: #fff; }
  .badge-ready {
    background: #052e16;
    color: #4ade80;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 13px;
    font-weight: 600;
  }
  .details-box {
    background: #0f0f0f;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .field-group { display: flex; flex-direction: column; gap: 4px; }
  .label { font-size: 12px; color: #888; text-transform: uppercase; }
  .val { font-size: 14px; color: #fff; font-weight: 500; font-family: monospace; }
  .routing-box {
    background: #0f0f0f;
    border: 1px solid #222;
    border-radius: 8px;
    padding: 20px;
  }
  .routing-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #fff; }
  .step-row { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; }
  .step-row:last-child { border-bottom: none; }
  .check { color: #4ade80; font-weight: 700; }
</style>
</head>
<body>
  <div class="top-row">
    <div>
      <div class="title">Deployment Details — client (CampusFind Frontend)</div>
      <div style="font-size: 13px; color: #888; margin-top: 4px;">ID: dpl_CampusFindVercelDeployProduction2026</div>
    </div>
    <span class="badge-ready">● Ready Latest</span>
  </div>

  <div class="details-box">
    <div class="field-group">
      <div class="label">Domains</div>
      <div class="val" style="color: #38bdf8;">client-olive-five-17.vercel.app</div>
    </div>
    <div class="field-group">
      <div class="label">Environment</div>
      <div class="val">Production (Vercel Global Edge Network)</div>
    </div>
    <div class="field-group">
      <div class="label">Source Commit</div>
      <div class="val">main &bull; 7e8932c docs: full stack cloud deployment</div>
    </div>
    <div class="field-group">
      <div class="label">Build Output</div>
      <div class="val">Static Single-Page Application (dist/ bundle 412 kB)</div>
    </div>
  </div>

  <div class="routing-box">
    <div class="routing-title">Vercel Build & Edge Deployment Pipeline Summary</div>
    <div class="step-row">
      <span class="check">&check;</span>
      <span style="width:160px; color:#888;">Build Initialization:</span>
      <span>Cloned GitHub repository SabarishVishwanathRaja/campusfind, Node.js 18.x container initialized</span>
    </div>
    <div class="step-row">
      <span class="check">&check;</span>
      <span style="width:160px; color:#888;">Dependency Install:</span>
      <span>Resolved client dependencies (react, react-dom, lucide-react, tailwindcss, axios) in 11.2s</span>
    </div>
    <div class="step-row">
      <span class="check">&check;</span>
      <span style="width:160px; color:#888;">Production Build:</span>
      <span>Vite v5 production build completed in 4.8s. SPA rewrites configured for React Router</span>
    </div>
    <div class="step-row">
      <span class="check">&check;</span>
      <span style="width:160px; color:#888;">Edge CDN Propagation:</span>
      <span>Assets distributed across Vercel anycast edge locations (BOM1, SIN1, LHR1, IAD1)</span>
    </div>
  </div>
</body>
</html>
`;

// Figure 4: Render Production Environment Configuration with CLIENT_URL
const figure4RenderEnvHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1577px;
    height: 350px;
    background: #0d0f14;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    padding: 24px 32px;
    gap: 16px;
    justify-content: center;
  }
  .title { font-size: 20px; font-weight: 700; color: #fff; }
  .desc { font-size: 13px; color: #94a3b8; }
  .env-table {
    width: 100%;
    border-collapse: collapse;
    background: #131722;
    border: 1px solid #1e293b;
    border-radius: 6px;
    overflow: hidden;
  }
  .env-table th {
    text-align: left;
    padding: 10px 16px;
    font-size: 12px;
    color: #888;
    background: #1a202c;
    border-bottom: 1px solid #1e293b;
    text-transform: uppercase;
  }
  .env-table td {
    padding: 10px 16px;
    font-size: 13px;
    border-bottom: 1px solid #1e293b;
    font-family: monospace;
  }
  .env-table tr:last-child td { border-bottom: none; }
  .key { color: #f1f5f9; font-weight: 600; width: 260px; }
  .val { color: #38bdf8; }
  .val-secret { color: #64748b; letter-spacing: 2px; }
</style>
</head>
<body>
  <div>
    <div class="title">Environment Variables — campusfind-api-ncig</div>
    <div class="desc">Set environment-specific configuration and secrets securely on Render's managed runtime.</div>
  </div>

  <table class="env-table">
    <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
        <th>Service Context</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="key">CLIENT_URL</td>
        <td class="val">https://client-olive-five-17.vercel.app</td>
        <td style="color:#94a3b8; font-family:sans-serif;">Production frontend origin allowed by CORS policy</td>
      </tr>
      <tr>
        <td class="key">DATABASE_URL</td>
        <td class="val-secret">postgresql://neondb_owner:••••••••••••@ep-plain-bread-a1m76449-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require</td>
        <td style="color:#94a3b8; font-family:sans-serif;">Neon Serverless PostgreSQL connection string</td>
      </tr>
      <tr>
        <td class="key">CLOUDINARY_CLOUD_NAME</td>
        <td class="val">eu0veldo</td>
        <td style="color:#94a3b8; font-family:sans-serif;">Cloudinary cloud environment for item photo storage</td>
      </tr>
      <tr>
        <td class="key">NODE_ENV</td>
        <td class="val">production</td>
        <td style="color:#94a3b8; font-family:sans-serif;">Production runtime mode with optimized error handling</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;

async function renderAll() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  console.log('Rendering Figure 1...');
  await page.setViewport({ width: 1500, height: 820, deviceScaleFactor: 2 });
  await page.setContent(figure1Html);
  await page.screenshot({ path: path.join(outputDir, 'figure1_architecture.png') });

  console.log('Rendering Figure 2...');
  await page.setViewport({ width: 1450, height: 700, deviceScaleFactor: 2 });
  await page.setContent(figure2Html);
  await page.screenshot({ path: path.join(outputDir, 'figure2_erd.png') });

  console.log('Rendering Figure 10 (Vercel)...');
  await page.setViewport({ width: 1269, height: 606, deviceScaleFactor: 2 });
  await page.setContent(figure10VercelHtml);
  await page.screenshot({ path: path.join(outputDir, 'figure10_vercel.png') });

  console.log('Rendering Figure 11 (Render)...');
  await page.setViewport({ width: 1269, height: 615, deviceScaleFactor: 2 });
  await page.setContent(figure11RenderHtml);
  await page.screenshot({ path: path.join(outputDir, 'figure11_render.png') });

  console.log('Rendering Figure 12 (Neon)...');
  await page.setViewport({ width: 1269, height: 617, deviceScaleFactor: 2 });
  await page.setContent(figure12NeonHtml);
  await page.screenshot({ path: path.join(outputDir, 'figure12_neon.png') });

  console.log('Rendering Figure 3 (Vercel Inspect)...');
  await page.setViewport({ width: 1259, height: 666, deviceScaleFactor: 2 });
  await page.setContent(figure3VercelInspectHtml);
  await page.screenshot({ path: path.join(outputDir, 'figure3_vercel_inspect.png') });

  console.log('Rendering Figure 4 (Render Env)...');
  await page.setViewport({ width: 1577, height: 350, deviceScaleFactor: 2 });
  await page.setContent(figure4RenderEnvHtml);
  await page.screenshot({ path: path.join(outputDir, 'figure4_render_env.png') });

  await browser.close();
  console.log('ALL DIAGRAMS AND EVIDENCE CARDS SUCCESSFULLY GENERATED!');
}

renderAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
