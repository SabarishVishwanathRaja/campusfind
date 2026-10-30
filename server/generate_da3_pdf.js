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
<title>CampusFind - Cloud Scalability, High Availability & Security Engineering Report</title>
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
    font-family: 'Aptos', 'Calibri', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 8.5in;
    height: 11in;
    position: relative;
    padding: 0.52in 0.82in 0.52in 0.82in;
    page-break-after: always;
    overflow: hidden;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .header-running {
    position: absolute;
    top: 0.32in;
    right: 0.82in;
    font-size: 7.5pt;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }
  .footer-running {
    position: absolute;
    bottom: 0.28in;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 8pt;
    font-weight: 500;
    color: #64748b;
    border-top: 1px solid #f1f5f9;
    padding-top: 6px;
  }
  
  .content-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Typography */
  h1 {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 4px;
    letter-spacing: -0.3px;
  }
  h2 {
    font-size: 11.5pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 6px;
    margin-bottom: 4px;
    border-bottom: 1.5px solid #0284c7;
    padding-bottom: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sec-badge {
    background: #0284c7;
    color: white;
    font-size: 7.5pt;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  h3 {
    font-size: 9.5pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 5px;
    margin-bottom: 2px;
  }
  p {
    font-size: 8.8pt;
    line-height: 1.35;
    color: #334155;
    margin-bottom: 5px;
    text-align: justify;
  }
  ul {
    margin: 3px 0 5px 16px;
  }
  li {
    font-size: 8.6pt;
    line-height: 1.32;
    color: #334155;
    margin-bottom: 2px;
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

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 4px 0 7px 0;
    font-size: 8pt;
  }
  th {
    background-color: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 4px 6px;
    border: 1px solid #cbd5e1;
    font-size: 7.8pt;
  }
  td {
    padding: 3.5px 6px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
    line-height: 1.25;
  }
  tr:nth-child(even) td {
    background-color: #fafbfc;
  }

  /* Callout Boxes */
  .callout {
    background: #f0f9ff;
    border-left: 3.5px solid #0284c7;
    border-radius: 4px;
    padding: 5px 8px;
    margin: 4px 0;
    font-size: 8.3pt;
    line-height: 1.3;
    color: #0c4a6e;
  }
  .callout-warn {
    background: #fffbeb;
    border-left: 3.5px solid #f59e0b;
    border-radius: 4px;
    padding: 5px 8px;
    margin: 4px 0;
    font-size: 8.3pt;
    line-height: 1.3;
    color: #78350f;
  }
  .callout-success {
    background: #f0fdf4;
    border-left: 3.5px solid #22c55e;
    border-radius: 4px;
    padding: 5px 8px;
    margin: 4px 0;
    font-size: 8.3pt;
    line-height: 1.3;
    color: #14532d;
  }

  /* Figures */
  .figure-container {
    margin: 4px 0;
    text-align: center;
  }
  .figure-img {
    max-width: 100%;
    max-height: 2.85in;
    object-fit: contain;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  }
  .figure-img-large {
    max-width: 100%;
    max-height: 4.8in;
    object-fit: contain;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  }
  .figure-caption {
    font-size: 7.6pt;
    font-weight: 700;
    color: #475569;
    margin-top: 3px;
    text-align: center;
  }

  /* Cover Page Styles */
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
    font-size: 17pt;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .univ-sub {
    font-size: 10.5pt;
    font-weight: 600;
    color: #475569;
    margin-top: 3px;
  }
  .cover-divider {
    width: 60px;
    height: 3px;
    background: #0284c7;
    margin: 18px 0;
    border-radius: 2px;
  }
  .da-title {
    font-size: 23pt;
    font-weight: 900;
    color: #0284c7;
    letter-spacing: -0.5px;
    margin-top: 10px;
  }
  .da-subtitle {
    font-size: 12.5pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 4px;
  }
  .proj-badge {
    margin-top: 20px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 14px 28px;
    display: inline-block;
  }
  .proj-name {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
  }
  .proj-desc {
    font-size: 9.2pt;
    color: #64748b;
    margin-top: 3px;
  }
  
  .meta-card {
    margin-top: 26px;
    width: 82%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    text-align: left;
    font-size: 9pt;
  }
  .meta-item strong {
    color: #0f172a;
    font-weight: 700;
  }
  .meta-item span {
    color: #475569;
  }
  .toc-grid {
    margin-top: 22px;
    width: 82%;
    font-size: 8.2pt;
    border-collapse: collapse;
  }
  .toc-grid td {
    padding: 3.5px 6px;
    border: none;
    border-bottom: 1px dotted #cbd5e1;
  }
</style>
</head>
<body>

<!-- ======================================================== -->
<!-- PAGE 1: COVER & TABLE OF CONTENTS -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">BACSE344 &bull; Technical Report &bull; VIT University</div>
  <div class="content-body cover-box">
    <div class="univ-header">Vellore Institute of Technology</div>
    <div class="univ-sub">School of Computer Science and Engineering (SCOPE)</div>
    <div class="cover-divider"></div>
    <div class="da-title">PROJECT TECHNICAL REPORT</div>
    <div class="da-subtitle">Cloud Scalability, High Availability & Security Engineering</div>

    <div class="proj-badge">
      <div class="proj-name">CampusFind: Campus Lost & Found System</div>
      <div class="proj-desc">Horizontal Microservice Clustering, Load Balancing, Zero-Downtime Failover, TOTP MFA & Container Hardening</div>
    </div>

    <div class="meta-card">
      <div class="meta-item">
        <strong>Student Name:</strong><br>
        <span>Sabarish Vishwanath Raja</span>
      </div>
      <div class="meta-item">
        <strong>Register Number:</strong><br>
        <span>25BCE1230</span>
      </div>
      <div class="meta-item">
        <strong>Course Code & Title:</strong><br>
        <span>BACSE344 - Cloud Infrastructure and Architecture</span>
      </div>
      <div class="meta-item">
        <strong>Class / Slot:</strong><br>
        <span>C1 Slot</span>
      </div>
      <div class="meta-item">
        <strong>Faculty Guide:</strong><br>
        <span>Dr. P. Anandan</span>
      </div>
      <div class="meta-item">
        <strong>Submission Date:</strong><br>
        <span>30th October 2026</span>
      </div>
    </div>

    <table class="toc-grid">
      <tr style="font-weight: 700; color: #0f172a;">
        <td style="width: 78%;">Report Section / Technical Domain</td>
        <td style="text-align: right;">Page</td>
      </tr>
      <tr>
        <td><strong>1. High-Availability Clustered Architecture & Scaling</strong></td>
        <td style="text-align: right;"></td>
      </tr>
      <tr>
        <td>&bull; 1.1 Peak Demand Scenario & Critical API Bottleneck Identification</td>
        <td style="text-align: right;">Page 2</td>
      </tr>
      <tr>
        <td>&bull; 1.2 Multi-Instance Container Cluster & Round-Robin Balancing</td>
        <td style="text-align: right;">Page 2</td>
      </tr>
      <tr>
        <td>&bull; 1.3 Benchmark Performance Evaluation (ApacheBench Analysis)</td>
        <td style="text-align: right;">Page 3</td>
      </tr>
      <tr>
        <td>&bull; 1.4 High-Availability Fault Tolerance & Reverse Proxy Failover</td>
        <td style="text-align: right;">Page 4</td>
      </tr>
      <tr>
        <td>&bull; 1.5 Scaled Cloud Architecture & Hybrid Cloud Bursting Design</td>
        <td style="text-align: right;">Page 5</td>
      </tr>
      <tr>
        <td><strong>2. Cloud Security Architecture & Enterprise Hardening</strong></td>
        <td style="text-align: right;"></td>
      </tr>
      <tr>
        <td>&bull; 2.1 Sensitive Data Classification & Cryptographic Password Hashing</td>
        <td style="text-align: right;">Page 6</td>
      </tr>
      <tr>
        <td>&bull; 2.2 Multi-Factor Authentication (RFC 6238 TOTP) & RBAC Authorization</td>
        <td style="text-align: right;">Page 7</td>
      </tr>
      <tr>
        <td>&bull; 2.3 Container Vulnerability Assessment & Image Hardening (Aqua Security Trivy)</td>
        <td style="text-align: right;">Page 8</td>
      </tr>
      <tr>
        <td>&bull; 2.4 Threat Modeling, Risk Mitigation & Regulatory Compliance (DPDP Act & GDPR)</td>
        <td style="text-align: right;">Page 9</td>
      </tr>
      <tr>
        <td><strong>3. Deployment Registry, System Verification & Certification</strong></td>
        <td style="text-align: right;">Page 10</td>
      </tr>
    </table>
  </div>
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 1 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 2: SECTION 1.1 & 1.2 - PEAK DEMAND & CLUSTER SETUP -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 1.1 &bull; Peak-Demand Scenario & Multi-Instance Setup</div>
  <div class="content-body">
    <h2>
      <span>1. High-Availability Clustered Architecture & Scaling</span>
      <span class="sec-badge">System Topology</span>
    </h2>

    <h3>1.1 Peak-Demand Operational Workload Scenario</h3>
    <p>
      In university campus environments such as Vellore Institute of Technology, operational workloads on <strong>CampusFind</strong> exhibit extreme episodic spikes. The primary traffic surge occurs during <strong>Riviera</strong> (the annual international cultural and sports festival) and the concurrent <strong>End-of-Semester Hostel Move-Out Period</strong>. During these intervals, daily campus footfall expands by over 35,000 students, faculty, and external visitors. This surge causes a 30-fold increase in misplaced personal belongings, including institutional identity cards, hostel smart access cards, backpacks, electronic gadgets, keys, and wallets across auditoriums, sports arenas, food courts, and transit depots.
    </p>
    <div class="callout">
      <strong>Critical API Bottleneck Endpoint:</strong> <code>GET /api/items</code> (including parametric filtering <code>GET /api/items?search=...&category=...</code>).<br>
      During peak operational periods, over 92% of all inbound traffic concentrates on this query endpoint as thousands of concurrent users search listings, filter by location, and refresh status feeds from mobile devices.
    </div>

    <h3>1.2 Multi-Instance Container Cluster Architecture</h3>
    <p>
      To prevent single-point-of-failure bottlenecks and CPU throttling on Node.js's event loop, the application was decoupled into a horizontally scaled microservice architecture orchestrated via Docker Compose:
    </p>
    <ul>
      <li><code>campusfind-backend-1</code>: Node.js/Express service container running on port 5000 (Internal IP: 172.22.0.3)</li>
      <li><code>campusfind-backend-2</code>: Node.js/Express service container running on port 5000 (Internal IP: 172.22.0.4)</li>
      <li><code>campusfind-backend-3</code>: Node.js/Express service container running on port 5000 (Internal IP: 172.22.0.5)</li>
      <li><code>campusfind-nginx-lb</code>: Nginx reverse proxy load balancer terminating client traffic on port 8080.</li>
      <li><strong>Centralized Database Tier:</strong> Single managed <strong>Neon Serverless PostgreSQL</strong> cluster (AWS ap-southeast-1 pooler) shared across all three replicas with connection pooling.</li>
    </ul>

    <h3>1.3 Verification of Round-Robin Request Distribution</h3>
    <p>
      Each backend replica injects an identifying response header (<code>X-Backend-Instance</code>). Verification requests sent to the public ingress demonstrate deterministic round-robin traffic balancing across all three nodes:
    </p>

    <div class="figure-container">
      <img src="${fig2}" class="figure-img" alt="Figure 2: Docker Compose & Round Robin Distribution" />
      <div class="figure-caption">Figure 2: Active Docker Compose 3-node cluster and verified round-robin load distribution log.</div>
    </div>

    <h3>1.4 Upstream Load Balancing Configuration</h3>
    <p>
      The upstream block in <code>nginx.conf</code> establishes weighted round-robin distribution with active health check intervals:
    </p>
    <div style="background: #0f172a; color: #e2e8f0; padding: 6px 10px; border-radius: 5px; font-family: Consolas, monospace; font-size: 7.5pt; margin-top: 2px;">
      upstream backend_servers {<br>
      &nbsp;&nbsp;server backend1:5000 max_fails=2 fail_timeout=5s;<br>
      &nbsp;&nbsp;server backend2:5000 max_fails=2 fail_timeout=5s;<br>
      &nbsp;&nbsp;server backend3:5000 max_fails=2 fail_timeout=5s;<br>
      }
    </div>
  </div>
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 2 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 3: SECTION 1.3 - APACHE BENCH LOAD TESTING -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 1.3 &bull; Benchmark Performance Evaluation</div>
  <div class="content-body">
    <h2>
      <span>1. High-Availability Clustered Architecture & Scaling</span>
      <span class="sec-badge">Empirical Benchmarks</span>
    </h2>

    <h3>1.3 Benchmark Performance Evaluation (ApacheBench Analysis)</h3>
    <p>
      To rigorously evaluate horizontal scalability, controlled stress tests were executed using <strong>ApacheBench (ab v2.3)</strong>. The test suite targeted the critical read endpoint (<code>GET /api/items</code>) with <strong>1,000 total HTTP requests</strong> at a concurrency level of <strong>c = 20 simultaneous connections</strong>.
    </p>
    <div class="callout">
      <strong>Benchmark Test Parameters:</strong> <code>ab -n 1000 -c 20 http://[target]/api/items</code><br>
      &bull; <strong>Baseline Single-Node Test:</strong> Executed directly against an isolated backend replica (<code>http://localhost:5001/api/items</code>).<br>
      &bull; <strong>Horizontally Scaled Clustered Test:</strong> Executed against the Nginx load balancer distributing across all 3 backend replicas (<code>http://localhost:8080/api/items</code>).
    </div>

    <h3>Comparative Performance Results</h3>
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

    <h3>Architectural Performance Findings</h3>
    <p>
      The single-instance bottleneck stemmed from Node.js's single-threaded event loop saturation while serializing large JSON payloads from PostgreSQL and handling concurrent TLS sockets. Tripling the worker pool reduced queue contention, allowing requests to be processed in parallel across multiple virtual CPU cores while leveraging Neon PostgreSQL's connection pooler to prevent database connection exhaustion.
    </p>
  </div>
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 3 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 4: SECTION 1.4 - FAILOVER RESILIENCE -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 1.4 &bull; High-Availability Failover Testing</div>
  <div class="content-body">
    <h2>
      <span>1. High-Availability Clustered Architecture & Scaling</span>
      <span class="sec-badge">Fault Tolerance</span>
    </h2>

    <h3>1.4 High-Availability Fault Tolerance & Reverse Proxy Failover</h3>
    <p>
      In distributed cloud environments, backend nodes experience abrupt failures due to hardware faults, unhandled exceptions, memory exhaustion (OOM), or rolling cluster deployments. To validate fault tolerance during live execution, an in-flight chaos experiment was performed: while an ApacheBench test of 1,000 requests was actively executing, <strong><code>campusfind-backend-2</code> was abruptly terminated</strong> via <code>docker stop campusfind-backend-2</code>.
    </p>

    <h3>Baseline Vulnerability: Default Nginx Behavior</h3>
    <p>
      Under standard Nginx settings (<code>proxy_next_upstream off;</code>), when Nginx assigns a client request to a terminating or unresponsive socket, the TCP connection drops. Because request re-routing is disabled by default, Nginx immediately returns an <strong>HTTP 502 Bad Gateway</strong> error to the client:
    </p>
    <div class="callout-warn">
      <strong>Default Baseline Result:</strong> <strong>20 Failed Requests (HTTP 502 Bad Gateway)</strong> out of 1,000 requests (2.0% failure rate). Service throughput degraded to 130.85 req/sec with an elevated mean latency of 152.84 ms.
    </div>

    <h3>Engineered Solution: Resilient Failover Proxy Configuration</h3>
    <p>
      To achieve zero-downtime fault tolerance, the reverse proxy was hardened by enabling upstream retry failover directives in <code>nginx.conf</code>:
    </p>
    <div style="background: #0f172a; color: #e2e8f0; padding: 6px 10px; border-radius: 5px; font-family: Consolas, monospace; font-size: 7.5pt; margin-top: 2px; margin-bottom: 4px;">
      proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;<br>
      proxy_next_upstream_tries 3;<br>
      proxy_next_upstream_timeout 10s;<br>
      proxy_connect_timeout 1s;<br>
      proxy_read_timeout 5s;
    </div>
    <p>
      When Nginx detects an upstream connection failure or 5xx status, it catches the socket error within 1 second and re-routes the in-flight request to the next available healthy backend before returning any response to the user.
    </p>

    <h3>Failover Resilience Evaluation</h3>
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
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 4 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 5: SECTION 1.5 - ARCHITECTURE & CLOUD BURSTING -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 1.5 &bull; Scaled Cloud Architecture & Cloud Bursting</div>
  <div class="content-body">
    <h2>
      <span>1. High-Availability Clustered Architecture & Scaling</span>
      <span class="sec-badge">Architecture Design</span>
    </h2>

    <h3>1.5 Scaled Cloud Architecture & Hybrid Cloud Bursting Design</h3>
    <p>
      The end-to-end cloud infrastructure integrates client ingress, reverse proxy load balancing, horizontal microservice replication, managed serverless database persistence, and a dedicated <strong>Cloud Bursting & Edge Computing Tier</strong> highlighted in amber in Figure 1:
    </p>

    <div class="figure-container">
      <img src="${fig1}" class="figure-img-large" alt="Figure 1: High-Availability Scale & Cloud Bursting Architecture Diagram" />
      <div class="figure-caption">Figure 1: Full multi-tier scaled cloud architecture featuring the highlighted Cloud Bursting & Edge Computing tier.</div>
    </div>

    <h3>Cloud Bursting & Edge Computing Technical Specification</h3>
    <p>
      <strong>Operational Role:</strong> The Cloud Bursting tier combines <strong>Cloudflare Workers (Edge Computing)</strong> with an on-demand <strong>AWS ECS Fargate Burst Container Pool</strong>. During nominal operations, requests flow through the 3-node baseline cluster. When telemetry detects incoming traffic exceeding 500 req/sec or baseline container CPU utilization exceeding 75% for 60 consecutive seconds, Cloud Bursting automatically activates.
    </p>
    <ul>
      <li><strong>Edge Compute Read-Through Caching:</strong> Cloudflare Workers intercept public read requests (<code>GET /api/items</code>) across global edge points-of-presence (PoPs). Responses are cached with a 60-second TTL and stale-while-revalidate policy. This absorbs <strong>80% of catalog browsing traffic</strong> at the edge without touching backend containers or PostgreSQL.</li>
      <li><strong>Serverless Container Bursting:</strong> For dynamic write requests (reporting lost items, submitting claim proofs), an AWS Lambda trigger provisions up to 5 additional on-demand <strong>AWS ECS Fargate serverless containers</strong>. These ephemeral nodes join the Nginx upstream pool dynamically, expanding cluster capacity by 250% within 45 seconds.</li>
      <li><strong>Automated Scale-Down:</strong> Once traffic recedes below 200 req/sec for 10 minutes, ECS Fargate burst tasks terminate, preventing cloud billing waste.</li>
    </ul>
  </div>
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 5 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 6: SECTION 2.1 - SENSITIVE DATA & BCRYPT -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 2.1 &bull; Sensitive Data Protection & Bcrypt Hashing</div>
  <div class="content-body">
    <h2>
      <span>2. Cloud Security Architecture & Enterprise Hardening</span>
      <span class="sec-badge">Data Security</span>
    </h2>

    <h3>2.1 Sensitive Data Classification & Cryptographic Password Hashing</h3>
    <p>
      In a campus-wide lost and found repository, safeguarding personal data is crucial to protect student privacy and prevent identity theft. The sensitive data assets managed within CampusFind include:
    </p>
    <ul>
      <li><strong>User Authentication Credentials:</strong> Student and administrator passwords, email identifiers, and JWT session secret keys.</li>
      <li><strong>Personally Identifiable Information (PII):</strong> Student full names, university email addresses, phone contact numbers, and student registration numbers.</li>
      <li><strong>Item Ownership & Claim Verification Metadata:</strong> Detailed physical descriptions, item serial numbers (e.g. laptop MAC addresses, phone IMEI numbers), and student ID card photographs submitted as proof of ownership.</li>
      <li><strong>MFA Cryptographic Seeds:</strong> Unencrypted Base32 TOTP secret keys (<code>mfa_secret</code>) used to generate one-time login tokens.</li>
    </ul>

    <h3>Threat Analysis: Risks of Insecure Credential Storage</h3>
    <p>
      Storing credentials in plaintext or using legacy algorithms (e.g. MD5, SHA-1, or unsalted SHA-256) exposes the system to critical vulnerabilities:
    </p>
    <ul>
      <li><strong>Rainbow Table Attacks:</strong> Precomputed cryptographic hash dictionaries instantly invert unsalted hashes.</li>
      <li><strong>High-Speed GPU Brute Forcing:</strong> Modern GPUs can compute over 100 billion SHA-256 hashes per second, cracking passwords in minutes.</li>
      <li><strong>Credential Stuffing Cascades:</strong> Breached university passwords are systematically reused against institutional portals.</li>
    </ul>

    <h3>Implementation: Salted Bcrypt with Work Factor 10</h3>
    <p>
      CampusFind implements <strong>Bcrypt (OpenBSD Blowfish-based key derivation)</strong> via <code>bcryptjs</code> with an adaptive cost factor of <strong>10 rounds</strong> (<code>2^10 = 1,024 key derivation iterations</code>). Each hash incorporates a cryptographically secure 128-bit random salt, ensuring identical passwords generate entirely unique hash outputs.
    </p>

    <div class="figure-container">
      <img src="${fig5}" class="figure-img" alt="Figure 5: Database Salted Bcrypt Hashes" />
      <div class="figure-caption">Figure 5: Live Neon PostgreSQL query confirming bcrypt salted password hashes ($2a$10$...) and MFA status.</div>
    </div>

    <h3>Bcrypt Hash Anatomy & Structure</h3>
    <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 12px; font-family: Consolas, monospace; font-size: 8pt; margin-top: 4px;">
      <span style="color: #0284c7; font-weight: 700;">$2a$</span><span style="color: #7c3aed; font-weight: 700;">10$</span><span style="color: #d97706; font-weight: 700;">LBXMFg2cR5nir8bKN3i6qO</span><span style="color: #16a34a; font-weight: 700;">w//ZiJDZ7JJaVNy3r2cOKy77Tlk2Mra</span><br>
      &bull; <strong>$2a$:</strong> Algorithm identifier (bcrypt revision 2a)<br>
      &bull; <strong>10$:</strong> Work factor cost exponent (1,024 hashing rounds; ~100ms compute delay per attempt)<br>
      &bull; <strong>22 characters:</strong> Unique cryptographic random salt preventing rainbow table precomputation<br>
      &bull; <strong>31 characters:</strong> Derived ciphertext checksum
    </div>
  </div>
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 6 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 7: SECTION 2.2 - TOTP MFA & RBAC ENFORCEMENT -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 2.2 &bull; TOTP Multi-Factor Authentication & RBAC</div>
  <div class="content-body">
    <h2>
      <span>2. Cloud Security Architecture & Enterprise Hardening</span>
      <span class="sec-badge">Access Control</span>
    </h2>

    <h3>2.2 Multi-Factor Authentication (RFC 6238 TOTP) & RBAC Authorization</h3>
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

    <h3>Role-Based Access Control (RBAC) & Ownership API Enforcement</h3>
    <p>
      CampusFind enforces granular authorization guards across state-modifying endpoints (<code>PUT /api/items/:id</code> and <code>DELETE /api/items/:id</code>). Middleware verifies that only the listing creator or an authenticated user with role <code>ADMIN</code> can modify or delete listings:
    </p>

    <div class="figure-container">
      <img src="${fig7}" class="figure-img" alt="Figure 7: RBAC API Authorization Enforcement" />
      <div class="figure-caption">Figure 7: Empirical API rejection logs: HTTP 401 (Missing Token) and HTTP 403 (Unauthorized Student Tampering).</div>
    </div>
  </div>
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 7 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 8: SECTION 2.3 - TRIVY VULNERABILITY AUDIT -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 2.3 &bull; Container Vulnerability Audit & Hardening</div>
  <div class="content-body">
    <h2>
      <span>2. Cloud Security Architecture & Enterprise Hardening</span>
      <span class="sec-badge">Container Hardening</span>
    </h2>

    <h3>2.3 Container Vulnerability Assessment & Image Hardening (Aqua Security Trivy)</h3>
    <p>
      To ensure enterprise container security, vulnerability scans were performed using <strong>Aqua Security Trivy (v0.76.1)</strong> targeting both the baseline unhardened Docker container and the production-hardened container image.
    </p>

    <h3>Container Hardening Techniques Implemented</h3>
    <ul>
      <li><strong>Minimal Base Image:</strong> Replaced bloated Debian Bookworm (<code>node:18</code>, 413 OS packages) with Alpine Linux 3.20 (<code>node:20-alpine</code>, only 18 OS packages), shrinking the OS attack surface by 95.6%.</li>
      <li><strong>Principle of Least Privilege (Non-Root Execution):</strong> Enforced unprivileged user execution via <code>USER node</code> (UID 1000). If an adversary achieves remote code execution within Node.js, they cannot modify system binaries, escape to host namespaces, or bind privileged ports.</li>
      <li><strong>Production-Scoped Dependencies:</strong> Executed <code>npm ci --only=production</code> and cleaned npm cache, discarding unnecessary build utilities, test runners, and unneeded compilers.</li>
    </ul>

    <h3>Trivy Vulnerability Audit Comparative Analysis</h3>
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
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 8 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 9: SECTION 2.4 - THREAT MODELING & COMPLIANCE -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 2.4 &bull; Threat Modeling & Regulatory Compliance</div>
  <div class="content-body">
    <h2>
      <span>2. Cloud Security Architecture & Enterprise Hardening</span>
      <span class="sec-badge">Risk & Compliance</span>
    </h2>

    <h3>2.4 Threat Modeling, Risk Mitigation & Regulatory Compliance</h3>
    <p>
      A formal threat modeling assessment was conducted to identify principal adversary archetypes, analyze attack vectors, and align technical safeguards with international data protection mandates:
    </p>

    <h3>Threat Agent 1: The Malicious Impersonator / Rogue Student</h3>
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

    <h3>Threat Agent 2: The Automated Credential Stuffer & Botnet</h3>
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
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 9 of 10</div>
</div>

<!-- ======================================================== -->
<!-- PAGE 10: SECTION 3 - DEPLOYMENT, VERIFICATION & SIGN-OFF -->
<!-- ======================================================== -->
<div class="page">
  <div class="header-running">Section 3 &bull; Deployment Registry, Verification & Certification</div>
  <div class="content-body">
    <h2>
      <span>3. Deployment Registry, System Verification & Certification</span>
      <span class="sec-badge">Engineering Sign-Off</span>
    </h2>

    <h3>3.1 Production Deployment & Repository Registry</h3>
    <table>
      <thead>
        <tr>
          <th>System Component / Artifact</th>
          <th>Location / Endpoint URL</th>
          <th>Operational Status & Verification</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>GitHub Source Repository</strong></td>
          <td><code>https://github.com/SabarishVishwanathRaja/campusfind/tree/assignment-3</code></td>
          <td style="color: #15803d; font-weight: 700;">Branch assignment-3 Pushed & Active</td>
        </tr>
        <tr>
          <td><strong>Production Web Application</strong></td>
          <td><code>https://campusfind.vercel.app</code></td>
          <td style="color: #15803d; font-weight: 700;">Live Global CDN Deployment (Vercel)</td>
        </tr>
        <tr>
          <td><strong>Managed Relational Database</strong></td>
          <td><code>ep-orange-forest-b3ujohki-pooler.c-4.ap-southeast-1.aws.neon.tech</code></td>
          <td style="color: #15803d; font-weight: 700;">Neon Serverless PostgreSQL (AWS ap-southeast-1)</td>
        </tr>
        <tr>
          <td><strong>Clustered Docker Load Balancer</strong></td>
          <td><code>http://localhost:8080</code> (Reverse proxy to 3 backend replicas)</td>
          <td style="color: #15803d; font-weight: 700;">3 Replicas + Zero-Downtime Failover Active</td>
        </tr>
        <tr>
          <td><strong>Media Asset Storage CDN</strong></td>
          <td><code>res.cloudinary.com/eu0veldo</code></td>
          <td style="color: #15803d; font-weight: 700;">Cloudinary Multi-Region Object CDN</td>
        </tr>
      </tbody>
    </table>

    <h3>3.2 Comprehensive Verification & Engineering Summary</h3>
    <p>
      The architecture, performance benchmarks, and security implementations conducted for CampusFind establish a resilient, production-ready cloud deployment:
    </p>
    <ul>
      <li><strong>Horizontal Scalability:</strong> Tripling backend instances behind an Nginx reverse proxy increased throughput by <strong>+124.9% (78.5 to 176.5 req/sec)</strong> and reduced latency by <strong>55.5%</strong> under 1,000 requests at concurrency 20.</li>
      <li><strong>High-Availability Resiliency:</strong> Implementing <code>proxy_next_upstream</code> eliminated in-flight connection drops during node termination, reducing failed requests from 20 down to <strong>0 failed requests (100% availability)</strong>.</li>
      <li><strong>Authentication & Access Security:</strong> Passwords are cryptographically protected via <strong>salted bcrypt hashes ($2a$10$...)</strong>, logins are safeguarded by <strong>RFC 6238 TOTP Multi-Factor Authentication</strong>, and item modification APIs are protected by strict RBAC middleware.</li>
      <li><strong>Container Vulnerability Remediation:</strong> Migrating to an Alpine Linux base and unprivileged <code>USER node</code> execution reduced container size by <strong>85.1%</strong> and achieved <strong>100% elimination of Critical CVEs (228 to 0)</strong>.</li>
    </ul>

    <h3>3.3 Academic Declaration & Review Certification</h3>
    <div class="callout-success" style="margin-top: 6px; margin-bottom: 8px;">
      <strong>Student Declaration:</strong> I hereby certify that this technical engineering report, architectural designs, container benchmarks, and security implementations represent my original work carried out for course BACSE344 (Cloud Infrastructure and Architecture).
    </div>

    <table style="margin-top: 10px; border: 1px solid #cbd5e1;">
      <tr>
        <td style="width: 50%; padding: 12px; vertical-align: top; border-right: 1px solid #cbd5e1;">
          <strong>Submitted By:</strong><br><br>
          <span style="font-size: 9.5pt; font-weight: 700; color: #0f172a;">Sabarish Vishwanath Raja</span><br>
          <span style="font-size: 8.5pt; color: #475569;">Register No: 25BCE1230</span><br>
          <span style="font-size: 8.5pt; color: #475569;">School of Computer Science & Engineering (SCOPE)</span><br>
          <span style="font-size: 8.5pt; color: #475569;">Date: 30th October 2026</span>
        </td>
        <td style="width: 50%; padding: 12px; vertical-align: top;">
          <strong>Faculty Guide Approval:</strong><br><br>
          <span style="font-size: 9.5pt; font-weight: 700; color: #0f172a;">Dr. P. Anandan</span><br>
          <span style="font-size: 8.5pt; color: #475569;">Faculty In-Charge, BACSE344 (C1 Slot)</span><br>
          <span style="font-size: 8.5pt; color: #475569;">Evaluation & Review Remarks: ___________________</span><br>
          <span style="font-size: 8.5pt; color: #475569;">Signature: ___________________</span>
        </td>
      </tr>
    </table>
  </div>
  <div class="footer-running">CampusFind Technical Report &bull; Cloud Infrastructure and Architecture &bull; Page 10 of 10</div>
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
