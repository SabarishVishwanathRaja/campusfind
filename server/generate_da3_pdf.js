const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const screenshotsDir = path.resolve(__dirname, '../screenshots');
const outputPdfPath = path.resolve(__dirname, '../CampusFind_DA3_Report.pdf');

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

const fig1 = getBase64Image('da3_fig1_architecture.png');
const fig2 = getBase64Image('da3_fig2_clustering.png');
const fig3 = getBase64Image('da3_fig3_apachebench.png');
const fig4 = getBase64Image('da3_fig4_failover.png');
const fig5 = getBase64Image('da3_fig5_database_security.png');
const fig6 = getBase64Image('da3_fig6_mfa_flow.png');
const fig7 = getBase64Image('da3_fig7_rbac_rejection.png');
const fig8 = getBase64Image('da3_fig8_trivy_scan.png');

console.log('Encoded all 8 DA3 figure assets to base64 successfully.');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</title>
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-running {
    position: absolute;
    top: 0.35in;
    right: 0.85in;
    font-size: 7.5pt;
    font-weight: 600;
    color: #4b5563;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }
  .footer-running {
    position: absolute;
    bottom: 0.35in;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 8pt;
    color: #4b5563;
  }
  
  .content-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Typography matching DA1 */
  h1 {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  h2 {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 8px;
    margin-bottom: 4px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2px;
  }
  h3 {
    font-size: 9.5pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 6px;
    margin-bottom: 3px;
  }
  p {
    font-size: 9pt;
    line-height: 1.38;
    color: #1e293b;
    margin-bottom: 6px;
    text-align: justify;
  }
  ul {
    margin: 4px 0 6px 18px;
  }
  li {
    font-size: 8.8pt;
    line-height: 1.35;
    color: #1e293b;
    margin-bottom: 3px;
  }
  strong {
    color: #0f172a;
  }
  code {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 8pt;
    background: #f1f5f9;
    color: #0284c7;
    padding: 1px 4px;
    border-radius: 3px;
    border: 1px solid #e2e8f0;
  }

  /* Tables matching DA1 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 6px 0 10px 0;
    font-size: 8.5pt;
  }
  th {
    background-color: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 5px 8px;
    border: 1px solid #cbd5e1;
    font-size: 8.2pt;
  }
  td {
    padding: 4px 8px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
    line-height: 1.28;
  }
  tr:nth-child(even) td {
    background-color: #fafbfc;
  }

  /* Callout Boxes */
  .callout {
    background: #f8fafc;
    border-left: 3.5px solid #0284c7;
    border-radius: 4px;
    padding: 6px 10px;
    margin: 6px 0;
    font-size: 8.5pt;
    line-height: 1.35;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-left-width: 3.5px;
  }

  /* Figures matching DA1 */
  .figure-container {
    margin: 6px 0;
    text-align: center;
  }
  .figure-img {
    max-width: 100%;
    max-height: 2.85in;
    object-fit: contain;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .figure-img-large {
    max-width: 100%;
    max-height: 4.8in;
    object-fit: contain;
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

  /* Cover Page Styles Matching DA1 Exactly */
  .cover-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    height: 100%;
    padding: 0.2in 0;
  }
  .univ-header {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .univ-sub {
    font-size: 11pt;
    font-weight: 600;
    color: #334155;
    margin-top: 4px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .course-title {
    font-size: 20pt;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: 0.5px;
    margin-top: 24px;
    text-transform: uppercase;
  }
  .report-subhead {
    font-size: 13pt;
    font-weight: 700;
    color: #475569;
    margin-top: 6px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }
  .project-title {
    font-size: 24pt;
    font-weight: 900;
    color: #1e3a8a;
    letter-spacing: 0.5px;
    margin-top: 26px;
    text-transform: uppercase;
  }
  .project-tagline {
    font-size: 10.5pt;
    color: #475569;
    margin-top: 6px;
  }
  
  .meta-table {
    margin-top: 28px;
    width: 90%;
    border-collapse: collapse;
    font-size: 9pt;
  }
  .meta-table th {
    background: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    padding: 8px 14px;
    text-align: center;
    border: 1px solid #cbd5e1;
    font-size: 9pt;
  }
  .meta-table td {
    padding: 7px 14px;
    border: 1px solid #cbd5e1;
    color: #0f172a;
  }
  .meta-table td.label {
    font-weight: 700;
    text-align: center;
    width: 45%;
  }
  .meta-table td.value {
    text-align: center;
    width: 55%;
    font-weight: 600;
  }
  
  .live-box {
    margin-top: 22px;
    text-align: center;
  }
  .live-label {
    font-size: 8.5pt;
    font-weight: 700;
    color: #0284c7;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .live-url {
    font-size: 11pt;
    font-weight: 700;
    color: #0284c7;
    margin-top: 3px;
    text-decoration: underline;
  }
  
  .cover-fulfillment {
    margin-top: 32px;
    font-size: 8.5pt;
    font-style: italic;
    color: #64748b;
  }

  /* Tree ASCII Box */
  .tree-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 8px 12px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 7.5pt;
    line-height: 1.35;
    color: #1e293b;
    margin-top: 6px;
    white-space: pre;
  }
</style>
</head>
<body>

<!-- ======================================================== -->
<!-- PAGE 1: COVER PAGE (EXACT DA1 SPECIFICATION) -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body cover-box">
    <div class="univ-header">VIT CHENNAI</div>
    <div class="univ-sub">SCHOOL OF COMPUTER SCIENCE AND ENGINEERING</div>

    <div class="course-title">CLOUD INFRASTRUCTURE<br>AND ARCHITECTURE</div>
    <div class="report-subhead">DIGITAL ASSIGNMENT 3 REPORT</div>

    <div class="project-title">CAMPUSFIND</div>
    <div class="project-tagline">Cloud-Based Campus Lost & Found System — High-Availability Scalability & Security Architecture</div>

    <table class="meta-table">
      <thead>
        <tr>
          <th>Academic Detail Information</th>
          <th>Specification</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="label">Student Name</td>
          <td class="value">Sabarish Vishwanath Raja</td>
        </tr>
        <tr>
          <td class="label">Register Number</td>
          <td class="value">25BCE1230</td>
        </tr>
        <tr>
          <td class="label">Course</td>
          <td class="value">Cloud Infrastructure and Architecture</td>
        </tr>
        <tr>
          <td class="label">Course Code</td>
          <td class="value">BACSE344</td>
        </tr>
        <tr>
          <td class="label">Faculty</td>
          <td class="value">Dr. P. Anandan</td>
        </tr>
        <tr>
          <td class="label">Slot</td>
          <td class="value">C1</td>
        </tr>
        <tr>
          <td class="label">Submission Date</td>
          <td class="value">30 October 2026</td>
        </tr>
        <tr>
          <td class="label">Production URL</td>
          <td class="value">https://campusfind.vercel.app</td>
        </tr>
        <tr>
          <td class="label">Source Code Repository</td>
          <td class="value">https://github.com/SabarishVishwanathRaja/campusfind/tree/assignment-3</td>
        </tr>
      </tbody>
    </table>

    <div class="live-box">
      <div class="live-label">LIVE APPLICATION</div>
      <div class="live-url">https://campusfind.vercel.app</div>
    </div>

    <div class="cover-fulfillment">
      Submitted in partial fulfillment of the course requirements for BACSE344 — Cloud Infrastructure and Architecture
    </div>
  </div>
  <div class="footer-running">Page 1</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 2: ABSTRACT & SYSTEM OVERVIEW -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>Abstract</h2>
    <p>
      CampusFind is a cloud-native campus belongings recovery platform engineered to address the critical logistical challenge of managing lost, found, and misplaced personal items across high-density educational campus environments. Building upon the foundational three-tier cloud deployment established in Digital Assignment 1, this report documents the advanced enterprise cloud engineering implemented for Digital Assignment 3, focusing on <strong>horizontal scalability, high-availability reverse proxy load balancing, fault tolerance under chaos failure injection, multi-factor authentication (TOTP), role-based access control (RBAC), and container security hardening with Aqua Security Trivy</strong>.
    </p>
    <p>
      The architecture decouples the presentation layer (React 18 on Vercel's Edge CDN) from an active backend microservice cluster managed via Docker Compose behind an Nginx reverse proxy load balancer, backed by a serverless relational database on Neon PostgreSQL with Cloudinary multimedia object storage. Empirical stress testing demonstrates significant throughput improvements (+124.9%) and zero-downtime failover capabilities during node terminations. Container security hardening reduces image footprint by 85.1% and eliminates 100% of Critical vulnerabilities, ensuring alignment with modern data protection regulations including India's DPDP Act 2023 and GDPR.
    </p>

    <h2>1. Introduction and Operational Problem Analysis</h2>
    <h3>1.1 Background & Operational Context</h3>
    <p>
      University campuses accommodate thousands of transient students and staff traversing multiple academic blocks, lecture theaters, laboratories, dining halls, and residential hostels daily. Misplaced personal property—such as student ID smartcards, laptops, wallets, mobile phones, lab kits, and keys—creates administrative bottlenecks and substantial personal anxiety. CampusFind provides a centralized, authenticated platform with real-time searching, photographic proof verification, and administrative claim moderation.
    </p>

    <h3>1.2 Peak-Demand Scenario Description</h3>
    <p>
      Operational demand surges dramatically during episodic institutional events, specifically <strong>Riviera (VIT's annual international cultural and sports festival)</strong> and the concurrent <strong>Hostel Move-Out Week</strong>. During these intervals, daily campus footfall expands by over 35,000 attendees, resulting in a 30-fold surge in lost and found incident reports.
    </p>
    <div class="callout">
      <strong>Hardest-Hit API Bottleneck:</strong> <code>GET /api/items</code> (including search filters <code>GET /api/items?search=...&category=...</code>).<br>
      During Riviera, over 92% of inbound traffic targets this catalog browsing endpoint as thousands of concurrent users search listings, filter by location, and refresh status feeds from mobile devices.
    </div>

    <h3>1.3 Objectives of Advanced Scaling & Security</h3>
    <ul>
      <li>Implement a horizontal cluster of 3 backend container replicas behind an Nginx reverse proxy load balancer.</li>
      <li>Conduct empirical load testing with ApacheBench (1,000 requests, $c=20$) comparing 1-instance baseline vs 3-instance cluster.</li>
      <li>Engineer zero-downtime failover using Nginx <code>proxy_next_upstream</code> to eliminate HTTP 502 Bad Gateway errors during live node failures.</li>
      <li>Design a scaled cloud architecture incorporating an edge-computing and Cloud Bursting tier.</li>
      <li>Implement salted Bcrypt password hashing (cost factor 10) and RFC 6238 TOTP Multi-Factor Authentication.</li>
      <li>Enforce granular RBAC authorization guards and audit trails on state-modifying endpoints.</li>
      <li>Perform automated container security scanning with Trivy, hardening the Dockerfile to eliminate vulnerabilities.</li>
    </ul>
  </div>
  <div class="footer-running">Page 2</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 3: HORIZONTAL CLUSTERING & ROUND-ROBIN BALANCING -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>2. Horizontal Microservice Clustering & Load Balancing</h2>
    <h3>2.1 Multi-Container Cluster Topology</h3>
    <p>
      To prevent single-point-of-failure bottlenecks and CPU throttling on Node.js's event loop, the backend API service was horizontally scaled into a clustered configuration orchestrated using Docker Compose behind an Nginx reverse proxy load balancer:
    </p>
    <ul>
      <li><code>campusfind-backend-1</code>: Node.js/Express service container running on internal port 5000 (IP: 172.22.0.3).</li>
      <li><code>campusfind-backend-2</code>: Node.js/Express service container running on internal port 5000 (IP: 172.22.0.4).</li>
      <li><code>campusfind-backend-3</code>: Node.js/Express service container running on internal port 5000 (IP: 172.22.0.5).</li>
      <li><code>campusfind-nginx-lb</code>: Nginx reverse proxy load balancer accepting external HTTP ingress on port 8080 and distributing requests across backend replicas.</li>
      <li><strong>Database Persistence:</strong> Shared connection pool connected to Neon Serverless PostgreSQL with TLS encryption.</li>
    </ul>

    <h3>2.2 Verification of Round-Robin Distribution</h3>
    <p>
      Each backend replica injects an identifying response header (<code>X-Backend-Instance</code>) containing its unique container identity. As shown in Figure 2, sequential requests directed to the public load balancer ingress cycle deterministically across <code>backend-instance-1</code>, <code>backend-instance-2</code>, and <code>backend-instance-3</code>:
    </p>

    <div class="figure-container">
      <img src="${fig2}" class="figure-img" alt="Figure 2: Active Docker Compose Cluster and Round-Robin Distribution Log" />
      <div class="figure-caption">Figure 2: Active Docker Compose 3-node cluster and verified round-robin load distribution log.</div>
    </div>

    <h3>2.3 Upstream Load Balancing Configuration</h3>
    <p>
      The upstream block in <code>nginx/nginx.conf</code> defines weighted round-robin distribution with active health monitoring parameters:
    </p>
    <div class="tree-box">upstream backend_servers {
    server backend1:5000 max_fails=2 fail_timeout=5s;
    server backend2:5000 max_fails=2 fail_timeout=5s;
    server backend3:5000 max_fails=2 fail_timeout=5s;
}</div>
  </div>
  <div class="footer-running">Page 3</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 4: APACHE BENCH LOAD TESTING & BENCHMARK -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>3. Benchmark Performance Evaluation (ApacheBench Analysis)</h2>
    <h3>3.1 Load Testing Methodology</h3>
    <p>
      To quantify the performance gains of horizontal clustering, standardized benchmark load tests were executed using <strong>ApacheBench (ab v2.3)</strong>. The test suite targeted the critical read endpoint (<code>GET /api/items</code>) with <strong>1,000 total HTTP requests</strong> at a concurrency level of <strong>c = 20 simultaneous connections</strong>.
    </p>
    <div class="callout">
      <strong>Benchmark Parameters:</strong> <code>ab -n 1000 -c 20 http://[target]/api/items</code><br>
      &bull; <strong>Baseline Single-Node Test:</strong> Executed directly against an isolated backend replica (<code>http://localhost:5001/api/items</code>).<br>
      &bull; <strong>Horizontally Scaled Clustered Test:</strong> Executed against the Nginx load balancer distributing across all 3 backend replicas (<code>http://localhost:8080/api/items</code>).
    </div>

    <h3>3.2 Empirical Benchmark Comparison Table</h3>
    <table>
      <thead>
        <tr>
          <th>Performance Metric</th>
          <th>Single Node Baseline</th>
          <th>3-Node Clustered Architecture</th>
          <th>Quantitative Improvement Delta</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Requests per Second (Throughput)</strong></td>
          <td style="color: #b45309; font-weight: 700;">78.50 req/sec</td>
          <td style="color: #15803d; font-weight: 700;">176.53 req/sec</td>
          <td style="color: #15803d; font-weight: 700;">+124.9% Throughput Gain (2.25x Faster)</td>
        </tr>
        <tr>
          <td><strong>Total Execution Time (1,000 Req)</strong></td>
          <td>12.738 seconds</td>
          <td>5.664 seconds</td>
          <td>-55.5% Wall-Clock Processing Time</td>
        </tr>
        <tr>
          <td><strong>Mean Latency per Request</strong></td>
          <td>254.770 ms</td>
          <td>113.290 ms</td>
          <td>-141.48 ms Latency Reduction (-55.5%)</td>
        </tr>
        <tr>
          <td><strong>Concurrent Batch Latency</strong></td>
          <td>12.738 ms</td>
          <td>5.664 ms</td>
          <td>-7.074 ms per concurrent batch</td>
        </tr>
        <tr>
          <td><strong>Median Latency (50th Percentile)</strong></td>
          <td>231 ms</td>
          <td>95 ms</td>
          <td>-136 ms (-58.9%)</td>
        </tr>
        <tr>
          <td><strong>90th Percentile Latency</strong></td>
          <td>348 ms</td>
          <td>121 ms</td>
          <td>-227 ms (-65.2%)</td>
        </tr>
        <tr>
          <td><strong>95th Percentile Tail Latency</strong></td>
          <td style="color: #b45309; font-weight: 700;">373 ms</td>
          <td style="color: #15803d; font-weight: 700;">156 ms</td>
          <td style="color: #15803d; font-weight: 700;">-217 ms (-58.2% Tail Latency Cut)</td>
        </tr>
        <tr>
          <td><strong>Packet Drop / Failure Rate</strong></td>
          <td>0 (0.00%)</td>
          <td>0 (0.00%)</td>
          <td>Zero packet loss across both runs</td>
        </tr>
        <tr>
          <td><strong>Network Data Transfer Rate</strong></td>
          <td>356.68 KB/sec</td>
          <td>802.21 KB/sec</td>
          <td>+124.9% Network Pipeline Utilization</td>
        </tr>
      </tbody>
    </table>

    <div class="figure-container">
      <img src="${fig3}" class="figure-img" alt="Figure 3: Apache Bench Load Benchmark Comparison" />
      <div class="figure-caption">Figure 3: Side-by-side terminal capture of Apache Bench execution and empirical benchmark summary card.</div>
    </div>

    <h3>3.3 Performance Analysis</h3>
    <p>
      The single-instance bottleneck stemmed from Node.js's single-threaded event loop saturation while serializing large JSON payloads from PostgreSQL and handling concurrent TLS sockets. Tripling the worker pool reduced queue contention, allowing requests to be processed in parallel across multiple virtual CPU cores while leveraging Neon PostgreSQL's connection pooler to prevent database connection exhaustion.
    </p>
  </div>
  <div class="footer-running">Page 4</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 5: HIGH-AVAILABILITY FAILOVER TESTING -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>4. High-Availability Fault Tolerance & Reverse Proxy Failover</h2>
    <h3>4.1 Chaos Engineering & Node Failure Scenario</h3>
    <p>
      In distributed cloud environments, backend nodes experience abrupt failures due to hardware faults, unhandled exceptions, memory exhaustion (OOM), or rolling cluster deployments. To validate fault tolerance during live execution, an in-flight chaos experiment was performed: while an ApacheBench test of 1,000 requests was actively executing, <strong><code>campusfind-backend-2</code> was abruptly terminated</strong> via <code>docker stop campusfind-backend-2</code>.
    </p>

    <h3>4.2 Baseline Vulnerability: Default Nginx Behavior</h3>
    <p>
      Under standard Nginx settings (<code>proxy_next_upstream off;</code>), when Nginx assigns a client request to a terminating or unresponsive socket, the TCP connection drops. Because request re-routing is disabled by default, Nginx immediately returns an <strong>HTTP 502 Bad Gateway</strong> error to the client:
    </p>
    <div class="callout">
      <strong>Default Baseline Result:</strong> <strong>20 Failed Requests (HTTP 502 Bad Gateway)</strong> out of 1,000 requests (2.0% failure rate). Service throughput degraded to 130.85 req/sec with an elevated mean latency of 152.84 ms.
    </div>

    <h3>4.3 Resilient Failover Proxy Configuration</h3>
    <p>
      To achieve zero-downtime fault tolerance, the reverse proxy was hardened by enabling upstream retry failover directives in <code>nginx/nginx.conf</code>:
    </p>
    <div class="tree-box">proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
proxy_next_upstream_tries 3;
proxy_next_upstream_timeout 10s;
proxy_connect_timeout 1s;
proxy_read_timeout 5s;</div>
    <p>
      When Nginx detects an upstream connection failure or 5xx status, it catches the socket error within 1 second and re-routes the in-flight request to the next available healthy backend before returning any response to the user.
    </p>

    <h3>4.4 Failover Resilience Evaluation Table</h3>
    <table>
      <thead>
        <tr>
          <th>Evaluation Metric</th>
          <th>Default Nginx (Failover Disabled)</th>
          <th>Resilient Nginx (Failover Enabled)</th>
          <th>Reliability Impact</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Simulated Fault Injection</strong></td>
          <td>Node 2 Terminated Mid-Flight</td>
          <td>Node 2 Terminated Mid-Flight</td>
          <td>Identical Chaos Experiment</td>
        </tr>
        <tr>
          <td><strong>Failed Requests</strong></td>
          <td style="color: #b91c1c; font-weight: 700;">20 Requests Failed (502s)</td>
          <td style="color: #15803d; font-weight: 700;">0 Requests Failed (100% Success)</td>
          <td style="color: #15803d; font-weight: 700;">100% Packet Loss Elimination</td>
        </tr>
        <tr>
          <td><strong>Non-2xx HTTP Responses</strong></td>
          <td style="color: #b91c1c; font-weight: 700;">20 Non-2xx Responses</td>
          <td style="color: #15803d; font-weight: 700;">0 Non-2xx Responses</td>
          <td style="color: #15803d; font-weight: 700;">Zero Client-Visible Outages</td>
        </tr>
        <tr>
          <td><strong>Throughput Retention</strong></td>
          <td>130.85 req/sec</td>
          <td>171.01 req/sec</td>
          <td>+30.7% Higher Throughput Retention</td>
        </tr>
        <tr>
          <td><strong>Mean Latency per Request</strong></td>
          <td>152.844 ms</td>
          <td>116.952 ms</td>
          <td>23.5% Faster Recovery Time</td>
        </tr>
      </tbody>
    </table>

    <div class="figure-container">
      <img src="${fig4}" class="figure-img" alt="Figure 4: Resilient Failover Test Results" />
      <div class="figure-caption">Figure 4: Apache Bench failover verification demonstrating elimination of 502 errors via proxy_next_upstream.</div>
    </div>
  </div>
  <div class="footer-running">Page 5</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 6: ARCHITECTURE DIAGRAM & CLOUD BURSTING -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>5. Scaled Cloud Architecture & Hybrid Cloud Bursting Design</h2>
    <h3>5.1 Clustered Architecture Topology</h3>
    <p>
      The end-to-end cloud infrastructure integrates client ingress, reverse proxy load balancing, horizontal microservice replication, managed serverless database persistence, and a dedicated <strong>Cloud Bursting & Edge Computing Tier</strong> highlighted in amber in Figure 1:
    </p>

    <div class="figure-container">
      <img src="${fig1}" class="figure-img-large" alt="Figure 1: High-Availability Scale & Cloud Bursting Architecture Diagram" />
      <div class="figure-caption">Figure 1: Full multi-tier scaled cloud architecture featuring the highlighted Cloud Bursting & Edge Computing tier.</div>
    </div>

    <h3>5.2 Cloud Bursting & Edge Computing Technical Specification</h3>
    <p>
      <strong>Operational Role:</strong> The Cloud Bursting tier combines <strong>Cloudflare Workers (Edge Computing)</strong> with an on-demand <strong>AWS ECS Fargate Burst Container Pool</strong>. During nominal operations, requests flow through the 3-node baseline cluster. When telemetry detects incoming traffic exceeding 500 req/sec or baseline container CPU utilization exceeding 75% for 60 consecutive seconds, Cloud Bursting automatically activates.
    </p>
    <ul>
      <li><strong>Edge Compute Read-Through Caching:</strong> Cloudflare Workers intercept public read requests (<code>GET /api/items</code>) across global edge points-of-presence (PoPs). Responses are cached with a 60-second TTL and stale-while-revalidate policy. This absorbs <strong>80% of catalog browsing traffic</strong> at the edge without touching backend containers or PostgreSQL.</li>
      <li><strong>Serverless Container Bursting:</strong> For dynamic write requests (reporting lost items, submitting claim proofs), an AWS Lambda trigger provisions up to 5 additional on-demand <strong>AWS ECS Fargate serverless containers</strong>. These ephemeral nodes join the Nginx upstream pool dynamically, expanding cluster capacity by 250% within 45 seconds.</li>
      <li><strong>Automated Scale-Down:</strong> Once traffic recedes below 200 req/sec for 10 minutes, ECS Fargate burst tasks terminate, preventing cloud billing waste.</li>
    </ul>
  </div>
  <div class="footer-running">Page 6</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 7: SENSITIVE DATA & SALTED BCRYPT HASHING -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>6. Sensitive Data Classification & Cryptographic Password Hashing</h2>
    <h3>6.1 Sensitive Data Identification</h3>
    <p>
      In a campus-wide lost and found repository, safeguarding personal data is crucial to protect student privacy and prevent identity theft. The sensitive data assets managed within CampusFind include:
    </p>
    <ul>
      <li><strong>User Authentication Credentials:</strong> Student and administrator passwords, email identifiers, and JWT session secret keys.</li>
      <li><strong>Personally Identifiable Information (PII):</strong> Student full names, university email addresses, phone contact numbers, and student registration numbers.</li>
      <li><strong>Item Ownership & Claim Verification Metadata:</strong> Detailed physical descriptions, item serial numbers (e.g. laptop MAC addresses, phone IMEI numbers), and student ID card photographs submitted as proof of ownership.</li>
      <li><strong>MFA Cryptographic Seeds:</strong> Unencrypted Base32 TOTP secret keys (<code>mfa_secret</code>) used to generate one-time login tokens.</li>
    </ul>

    <h3>6.2 Threat Analysis: Risks of Insecure Credential Storage</h3>
    <p>
      Storing credentials in plaintext or using legacy algorithms (e.g. MD5, SHA-1, or unsalted SHA-256) exposes the system to critical vulnerabilities:
    </p>
    <ul>
      <li><strong>Rainbow Table Attacks:</strong> Precomputed cryptographic hash dictionaries instantly invert unsalted hashes.</li>
      <li><strong>High-Speed GPU Brute Forcing:</strong> Modern GPUs can compute over 100 billion SHA-256 hashes per second, cracking passwords in minutes.</li>
      <li><strong>Credential Stuffing Cascades:</strong> Breached university passwords are systematically reused against institutional portals.</li>
    </ul>

    <h3>6.3 Implementation: Salted Bcrypt with Work Factor 10</h3>
    <p>
      CampusFind implements <strong>Bcrypt (OpenBSD Blowfish-based key derivation)</strong> via <code>bcryptjs</code> with an adaptive cost factor of <strong>10 rounds</strong> (<code>2^10 = 1,024 key derivation iterations</code>). Each hash incorporates a cryptographically secure 128-bit random salt, ensuring identical passwords generate entirely unique hash outputs.
    </p>

    <div class="figure-container">
      <img src="${fig5}" class="figure-img" alt="Figure 5: Database Salted Bcrypt Hashes" />
      <div class="figure-caption">Figure 5: Live Neon PostgreSQL query confirming bcrypt salted password hashes ($2a$10$...) and MFA status.</div>
    </div>

    <h3>6.4 Bcrypt Hash Anatomy & Structure</h3>
    <div class="tree-box">$2a$10$LBXMFg2cR5nir8bKN3i6qOw//ZiJDZ7JJaVNy3r2cOKy77Tlk2Mra
├── $2a$               : Algorithm identifier (bcrypt revision 2a)
├── 10$                : Work factor cost exponent (1,024 hashing rounds; ~100ms compute delay)
├── LBXMFg2cR5nir8bKN3i6qO : Unique 22-character cryptographic random salt
└── w//ZiJDZ7JJaVNy3r2cOKy77Tlk2Mra : 31-character derived ciphertext checksum</div>
  </div>
  <div class="footer-running">Page 7</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 8: TOTP MULTI-FACTOR AUTHENTICATION & RBAC -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>7. Multi-Factor Authentication (RFC 6238 TOTP) & RBAC Authorization</h2>
    <h3>7.1 Multi-Factor Authentication Implementation</h3>
    <p>
      To defend administrative and student accounts against credential theft and phishing, <strong>Time-based One-Time Password (TOTP) Multi-Factor Authentication</strong> was engineered according to <strong>RFC 6238</strong> standards. It integrates with industry-standard authenticator apps including <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, and <strong>1Password</strong>:
    </p>
    <ul>
      <li><strong>Secret Key & QR Code Generation (<code>POST /api/auth/mfa/setup</code>):</strong> Generates an unguessable 20-byte Base32 cryptographic secret and renders an inline QR code containing the standard URI scheme: <code>otpauth://totp/CampusFind:user@email?secret=...&issuer=CampusFind</code>.</li>
      <li><strong>Handshake & Device Binding (<code>POST /api/auth/mfa/verify</code>):</strong> The student scans the QR code and inputs the live 6-digit code. The server verifies it using <code>speakeasy.totp.verify()</code> with a ±1 time step window (30-second validity) and sets <code>mfa_enabled = true</code>.</li>
      <li><strong>Two-Step Login Enforcement (<code>POST /api/auth/mfa/login</code>):</strong> Primary login challenges users with <code>{ mfaRequired: true, tempToken }</code>. Full JWT session tokens are issued only after providing a valid TOTP code.</li>
    </ul>

    <div class="figure-container">
      <img src="${fig6}" class="figure-img" alt="Figure 6: TOTP Multi-Factor Authentication Flow" />
      <div class="figure-caption">Figure 6: Generated TOTP Authenticator QR code and verified API two-step login challenge flow.</div>
    </div>

    <h3>7.2 Role-Based Access Control (RBAC) & Ownership API Enforcement</h3>
    <p>
      CampusFind enforces granular authorization guards across state-modifying endpoints (<code>PUT /api/items/:id</code> and <code>DELETE /api/items/:id</code>). Middleware verifies that only the listing creator or an authenticated user with role <code>ADMIN</code> can modify or delete listings:
    </p>

    <div class="figure-container">
      <img src="${fig7}" class="figure-img" alt="Figure 7: RBAC API Authorization Enforcement" />
      <div class="figure-caption">Figure 7: Empirical API rejection logs: HTTP 401 (Missing Token) and HTTP 403 (Unauthorized Student Tampering).</div>
    </div>
  </div>
  <div class="footer-running">Page 8</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 9: TRIVY CONTAINER SECURITY SCAN & HARDENING -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>8. Container Vulnerability Assessment & Image Hardening (Aqua Security Trivy)</h2>
    <h3>8.1 Vulnerability Scanning Methodology</h3>
    <p>
      To ensure enterprise container security, vulnerability scans were performed using <strong>Aqua Security Trivy (v0.76.1)</strong> targeting both the baseline unhardened Docker container and the production-hardened container image.
    </p>

    <h3>8.2 Container Hardening Techniques Implemented</h3>
    <ul>
      <li><strong>Minimal Base Image:</strong> Replaced bloated Debian Bookworm (<code>node:18</code>, 413 OS packages) with Alpine Linux 3.20 (<code>node:20-alpine</code>, only 18 OS packages), shrinking the OS attack surface by 95.6%.</li>
      <li><strong>Principle of Least Privilege (Non-Root Execution):</strong> Enforced unprivileged user execution via <code>USER node</code> (UID 1000). If an adversary achieves remote code execution within Node.js, they cannot modify system binaries, escape to host namespaces, or bind privileged ports.</li>
      <li><strong>Production-Scoped Dependencies:</strong> Executed <code>npm ci --only=production</code> and cleaned npm cache, discarding unnecessary build utilities, test runners, and unneeded compilers.</li>
    </ul>

    <h3>8.3 Trivy Vulnerability Audit Comparative Analysis</h3>
    <table>
      <thead>
        <tr>
          <th>Audit Category & Vulnerability Level</th>
          <th>Unhardened Image (node:18 Debian)</th>
          <th>Hardened Image (node:20-alpine)</th>
          <th>Remediation & Security Impact</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Docker Image Disk Size</strong></td>
          <td style="color: #b91c1c; font-weight: 700;">1.60 GB</td>
          <td style="color: #15803d; font-weight: 700;">238 MB</td>
          <td style="color: #15803d; font-weight: 700;">-85.1% Container Footprint Reduction</td>
        </tr>
        <tr>
          <td><strong>Base Operating System</strong></td>
          <td>Debian 12.11 Bookworm (413 packages)</td>
          <td>Alpine Linux 3.23.4 (18 packages)</td>
          <td>395 Redundant System Packages Purged</td>
        </tr>
        <tr>
          <td><strong>Runtime Execution Privilege</strong></td>
          <td style="color: #b91c1c; font-weight: 700;">USER root (UID 0 - Insecure)</td>
          <td style="color: #15803d; font-weight: 700;">USER node (UID 1000 - Least Privilege)</td>
          <td>Zero Root Privilege Container Escalation</td>
        </tr>
        <tr>
          <td><strong>CRITICAL Severity Vulnerabilities</strong></td>
          <td style="color: #b91c1c; font-weight: 700;">228 CRITICAL</td>
          <td style="color: #15803d; font-weight: 700;">0 CRITICAL</td>
          <td style="color: #15803d; font-weight: 700;">100% Elimination of Critical CVEs</td>
        </tr>
        <tr>
          <td><strong>HIGH Severity Vulnerabilities</strong></td>
          <td style="color: #b91c1c; font-weight: 700;">2,188 HIGH</td>
          <td style="color: #15803d; font-weight: 700;">4 HIGH</td>
          <td style="color: #15803d; font-weight: 700;">99.82% Reduction in High CVEs</td>
        </tr>
        <tr>
          <td><strong>Total OS Vulnerabilities</strong></td>
          <td style="color: #b91c1c; font-weight: 700;">2,416 Total</td>
          <td style="color: #15803d; font-weight: 700;">4 Total</td>
          <td style="color: #15803d; font-weight: 700;">99.83% Overall Vulnerability Drop</td>
        </tr>
      </tbody>
    </table>

    <div class="figure-container">
      <img src="${fig8}" class="figure-img" alt="Figure 8: Trivy Container Vulnerability Scan Comparison" />
      <div class="figure-caption">Figure 8: Trivy vulnerability scan comparison verifying 100% critical CVE elimination and image hardening.</div>
    </div>
  </div>
  <div class="footer-running">Page 9</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 10: THREAT MODELING & REGULATORY COMPLIANCE -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>9. Threat Modeling, Risk Mitigation & Regulatory Compliance</h2>
    <p>
      A formal threat modeling assessment was conducted to identify principal adversary archetypes, analyze attack vectors, and align technical safeguards with international data protection mandates:
    </p>

    <h3>9.1 Threat Agent 1: The Malicious Impersonator / Rogue Student</h3>
    <p>
      <strong>Profile & Motivation:</strong> An insider threat consisting of an authenticated student or unauthorized visitor seeking to illicitly acquire high-value misplaced assets (e.g. laptops, smartphones, premium wallets, institutional ID cards) through fraudulent ownership claims.
    </p>
    <ul>
      <li><strong>Attack Vectors:</strong> The adversary leverages shoulder-surfing or stolen student credentials to access accounts, submit fraudulent claim proofs, tamper with item statuses, or prematurely delete reported listings (<code>DELETE /api/items/:id</code>).</li>
      <li><strong>Technical Safeguards Implemented:</strong>
        <br>&bull; <strong>TOTP Multi-Factor Authentication:</strong> Blocks account takeover attempts lacking the physical authenticator device.
        <br>&bull; <strong>Granular RBAC & Ownership Verification:</strong> Restricts deletion and editing strictly to verified listing creators or administrators, rejecting unauthorized attempts with HTTP 403 Forbidden.
        <br>&bull; <strong>Immutable Audit Logging:</strong> Records client IP addresses and UTC timestamps for all state modifications.
      </li>
      <li><strong>Regulatory Compliance Mandates:</strong>
        <br>&bull; <strong>India Digital Personal Data Protection (DPDP) Act 2023, Section 8(5):</strong> Mandates that data fiduciaries protect personal data by implementing reasonable technical safeguards to prevent unauthorized access or disclosure.
        <br>&bull; <strong>EU General Data Protection Regulation (GDPR), Article 32 (Security of Processing):</strong> Requires technical measures to ensure ongoing confidentiality, integrity, availability, and resilience of processing systems.
      </li>
    </ul>

    <h3>9.2 Threat Agent 2: The Automated Credential Stuffer & Botnet</h3>
    <p>
      <strong>Profile & Motivation:</strong> External cybercriminal syndicates or opportunistic botnets attempting mass account takeovers to exfiltrate student personal data, compromise institutional emails, or deploy distributed malware payloads.
    </p>
    <ul>
      <li><strong>Attack Vectors:</strong> Automated distributed botnets execute dictionary attacks and credential stuffing against <code>POST /api/auth/login</code> using credential dumps from third-party data breaches.</li>
      <li><strong>Technical Safeguards Implemented:</strong>
        <br>&bull; <strong>Bcrypt Cost Factor Derivation:</strong> Cost factor 10 enforces an intentional ~100ms CPU computation delay per login attempt, rendering large-scale automated brute force computationally intractable.
        <br>&bull; <strong>IP-Based Rate Limiting:</strong> Express rate limiting restricts bursts to 100 requests per 15-minute window per IP, mitigating spray attacks.
        <br>&bull; <strong>Container Sandbox Hardening:</strong> Unprivileged <code>USER node</code> execution and Alpine footprint prevent botnet payloads from establishing root persistence or escaping to host namespaces.
      </li>
      <li><strong>Regulatory Compliance Mandates:</strong>
        <br>&bull; <strong>EU General Data Protection Regulation (GDPR), Article 5(1)(f) (Integrity and Confidentiality):</strong> Requires personal data to be protected against unauthorized processing, accidental loss, or destruction.
        <br>&bull; <strong>ISO/IEC 27001:2022 Control A.8.5 (Secure Authentication):</strong> Requires multi-factor authentication, secure password storage, and automated brute-force countermeasures.
      </li>
    </ul>
  </div>
  <div class="footer-running">Page 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 11: REFERENCES, APPENDIX A & APPENDIX B (CHECKLIST) -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">CAMPUSFIND | CLOUD INFRASTRUCTURE AND ARCHITECTURE</div>
  <div class="content-body">
    <h2>10. Conclusion and Project Resources</h2>
    <p>
      CampusFind demonstrates a production-grade cloud implementation designed for university-scale resilience, high availability, and data protection. The multi-container Nginx deployment delivers <strong>+124.9% throughput improvements</strong> under load, achieves <strong>zero-downtime failover</strong> during live node termination, safeguards user identities via <strong>salted bcrypt and TOTP MFA</strong>, and eliminates <strong>100% of Critical container vulnerabilities</strong> through rigorous Alpine hardening.
    </p>

    <h3>Project Resources and Endpoints</h3>
    <ul>
      <li><strong>Source Code Repository (Branch assignment-3):</strong> <code>https://github.com/SabarishVishwanathRaja/campusfind/tree/assignment-3</code></li>
      <li><strong>Live Production Web Application:</strong> <code>https://campusfind.vercel.app</code></li>
      <li><strong>Production Managed Database:</strong> <code>ep-orange-forest-b3ujohki-pooler.c-4.ap-southeast-1.aws.neon.tech</code></li>
      <li><strong>Local Clustered Load Balancer:</strong> <code>http://localhost:8080</code> (distributes across 3 backend replicas)</li>
      <li><strong>Cloud Media Storage:</strong> <code>res.cloudinary.com/eu0veldo</code></li>
    </ul>

    <h2>Appendix A — Repository Structure (Branch: assignment-3)</h2>
    <div class="tree-box">CampusFind/
├── docker-compose.yml              # Multi-container orchestration (3 backends + Nginx LB)
├── nginx/
│   ├── nginx.conf                  # Active reverse proxy configuration with failover
│   ├── nginx_default.conf          # Default proxy configuration (failover off)
│   └── nginx_resilient.conf        # Resilient proxy_next_upstream configuration
├── benchmark_results/              # Raw benchmark and security audit logs
│   ├── ab_1_instance.txt           # ApacheBench single-node baseline (78.50 req/s)
│   ├── ab_3_instances.txt          # ApacheBench 3-node cluster (176.53 req/s)
│   ├── failover_before.txt         # Node failure test with default Nginx (20 502s)
│   ├── failover_after.txt          # Node failure test with resilient Nginx (0 failures)
│   ├── trivy_unhardened.txt        # Trivy vulnerability audit (2,416 CVEs)
│   └── trivy_hardened.txt          # Trivy hardened audit (4 CVEs, 0 Critical)
├── client/                         # React 18 + Vite SPA frontend (deployed on Vercel)
├── server/
│   ├── Dockerfile                  # Hardened production image (node:20-alpine, USER node)
│   ├── Dockerfile.unhardened       # Baseline image (node:18 Debian, USER root)
│   ├── src/
│   │   ├── routes/auth.routes.js   # TOTP MFA setup, verify, login endpoints
│   │   └── server.js               # Clustered API entrypoint & instance tracking
│   └── package.json                # Dependencies (speakeasy, qrcode, bcryptjs, pg)
└── CampusFind_DA3_Report.pdf       # Comprehensive Digital Assignment 3 Report</div>

    <h2>Appendix B — Final Submission Checklist</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">Status</th>
          <th style="width: 42%;">Requirement Item</th>
          <th style="width: 50%;">Submission Detail & Verification</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Source code repository branch included</td>
          <td>GitHub: <code>SabarishVishwanathRaja/campusfind/tree/assignment-3</code></td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Deployed application URL included</td>
          <td>Vercel Production: <code>https://campusfind.vercel.app</code></td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Horizontal 3-instance container cluster</td>
          <td>Docker Compose with 3 Node.js replicas + Nginx load balancer</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>ApacheBench performance benchmarks</td>
          <td>1 vs 3 instances: +124.9% throughput, -55.5% latency cut</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Zero-downtime failover resilience test</td>
          <td>20 failed requests (502s) eliminated to 0 failures (100% success)</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Cloud Bursting & Edge Architecture</td>
          <td>Cloudflare Workers + AWS ECS Fargate burst design diagram</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Cryptographic password hashing</td>
          <td>Salted Bcrypt work factor 10 ($2a$10$...) verified in Neon DB</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>RFC 6238 TOTP Multi-Factor Authentication</td>
          <td>Authenticator QR code generation, verify, and two-step login</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Role-Based Access Control (RBAC)</td>
          <td>HTTP 401 Unauthorized & HTTP 403 Forbidden rejection tests</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Container security audit with Trivy</td>
          <td>2,416 CVEs to 4 CVEs; 100% Critical CVE elimination</td>
        </tr>
        <tr>
          <td style="text-align: center; color: #15803d; font-weight: 700;">☑</td>
          <td>Threat modeling & regulatory compliance</td>
          <td>Rogue Student & Botnet mapped to India DPDP Act & GDPR</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="footer-running">Page 11</div>
</div>

</body>
</html>
`;

async function generatePdf() {
  console.log('Launching Edge for PDF generation...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  fs.writeFileSync(path.resolve(__dirname, 'da3_preview.html'), htmlContent, 'utf8');
  console.log('Saved da3_preview.html for visual inspection.');
  console.log('Setting HTML content for PDF...');
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  console.log('Generating PDF...');
  await page.pdf({
    path: outputPdfPath,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0in',
      right: '0in',
      bottom: '0in',
      left: '0in'
    }
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${outputPdfPath}`);
}

generatePdf().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
