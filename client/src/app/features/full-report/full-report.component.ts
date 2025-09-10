import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import mermaid from 'mermaid';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // optional if using bundler to include CSS
// html2canvas is used internally by jsPDF.html but we import for types / availability
import html2canvas from 'html2canvas';
import { ApiService } from '../../core/service/api.service';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface APIWatchdogReport {
  meta: any;
  endpoints: any;
  spec: any;
  flows: any;
  security: any;
}

@Component({
  selector: 'app-full-report',
  imports: [],
  templateUrl: './full-report.component.html',
  styleUrl: './full-report.component.scss',
})
export class FullReportComponent implements OnInit {
   error: string | null = null;
   
  // You already have the JSON; I'm including it here as sampleReport.
  // Replace this with your actual report data (from backend).


  report: APIWatchdogReport | any = null;
//   report: APIWatchdogReport = {
//   "meta": {
//     "title": "APIWatchdog Analysis Report",
//     "heading": "Comprehensive API Analysis",
//     "description": "Analysis of API endpoints, OpenAPI spec, flows, and security insights from the uploaded file.",
//     "stats": {
//       "totalEndpoints": 5,
//       "totalFlows": 2,
//       "totalIssues": 3
//     }
//   },
//   "endpoints": {
//     "title": "Discovered Endpoints",
//     "heading": "1. Discover Endpoints",
//     "description": "List of all API endpoints extracted from the file.",
//     "items": [
//       {
//         "method": "GET",
//         "path": "/users",
//         "status": "success",
//         "description": "Retrieve a list of users",
//         "usageFrequency": 150,
//         "requestExample": { "headers": { "Authorization": "Bearer token" } },
//         "responseExample": { "data": [{ "id": 1, "name": "John Doe" }] }
//       },
//       {
//         "method": "POST",
//         "path": "/users",
//         "status": "warning",
//         "description": "Create a new user - missing validation in request",
//         "usageFrequency": 80,
//         "requestExample": { "body": { "name": "Jane Doe" } },
//         "responseExample": { "id": 2, "name": "Jane Doe" }
//       },
//       {
//         "method": "GET",
//         "path": "/users/:id",
//         "status": "success",
//         "description": "Get user by ID",
//         "usageFrequency": 200,
//         "requestExample": { "params": { "id": 1 } },
//         "responseExample": { "id": 1, "name": "John Doe" }
//       },
//       {
//         "method": "PUT",
//         "path": "/users/:id",
//         "status": "error",
//         "description": "Update user - insecure parameter handling",
//         "usageFrequency": 60,
//         "requestExample": { "body": { "name": "Updated Name" } },
//         "responseExample": { "id": 1, "name": "Updated Name" }
//       },
//       {
//         "method": "DELETE",
//         "path": "/users/:id",
//         "status": "warning",
//         "description": "Delete user - no confirmation step",
//         "usageFrequency": 40,
//         "requestExample": { "params": { "id": 1 } },
//         "responseExample": { "message": "User deleted" }
//       }
//     ]
//   },
//   "spec": {
//     "title": "OpenAPI Specification",
//     "description": "Generated OpenAPI spec based on the analyzed endpoints",
//     "version": "1.0.0",
//     "endpoints": [
//       {
//         "method": "GET",
//         "path": "/users",
//         "description": "Get all users",
//         "parameters": [
//           {
//             "name": "limit",
//             "type": "integer",
//             "required": false,
//             "description": "Number of users to return"
//           }
//         ],
//         "responses": [
//           {
//             "code": 200,
//             "description": "Successful response with user list"
//           }
//         ]
//       },
//       {
//         "method": "POST",
//         "path": "/users",
//         "description": "Create a new user",
//         "parameters": [],
//         "responses": [
//           {
//             "code": 201,
//             "description": "User created successfully"
//           }
//         ]
//       }
//     ],
//     "specScript": "openapi: 3.0.0\ninfo:\n  title: User API\n  description: API for managing users\n  version: 1.0.0\npaths:\n  /users:\n    get:\n      summary: Get all users\n      parameters:\n        - name: limit\n          in: query\n          schema:\n            type: integer\n      responses:\n        '200':\n          description: OK\n    post:\n      summary: Create a user\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: '#/components/schemas/User'\n      responses:\n        '201':\n          description: Created\ncomponents:\n  schemas:\n    User:\n      type: object\n      properties:\n        id:\n          type: integer\n        name:\n          type: string"
//   },
//   "flows": {
//     "title": "Sequence Flows",
//     "heading": "3. Sequence Diagram Flows",
//     "description": "Visualized API interaction flows using Mermaid syntax",
//     "availableFlows": [
//       {
//         "id": "flow1",
//         "title": "User Authentication Flow"
//       },
//       {
//         "id": "flow2",
//         "title": "User CRUD Flow"
//       }
//     ],
//     "flows": [
//       {
//         "id": "flow1",
//         "title": "User Authentication Flow",
//         "description": "Flow for user login and token generation",
//         "mermaidScript": "sequenceDiagram\n    participant Client\n    participant AuthAPI\n    Client->>AuthAPI: POST /login with credentials\n    AuthAPI-->>Client: 200 OK with JWT token\n    Client->>AuthAPI: GET /profile with token\n    AuthAPI-->>Client: 200 OK with user data"
//       },
//       {
//         "id": "flow2",
//         "title": "User CRUD Flow",
//         "description": "Flow for creating, reading, updating, and deleting users",
//         "mermaidScript": "sequenceDiagram\n    participant User\n    participant API\n    User->>API: POST /users (create)\n    API-->>User: 201 Created\n    User->>API: GET /users (list)\n    API-->>User: 200 OK\n    User->>API: PUT /users/:id (update)\n    API-->>User: 200 OK\n    User->>API: DELETE /users/:id (delete)\n    API-->>User: 200 OK"
//       }
//     ]
//   },
//   "security": {
//     "title": "Security Insights",
//     "heading": "4. Security Section",
//     "description": "Security issues and recommendations identified",
//     "issues": [
//       {
//         "id": "sec1",
//         "title": "Missing Rate Limiting on /login",
//         "description": "The /login endpoint does not implement rate limiting, making it vulnerable to brute-force attacks.",
//         "endpoint": "/login",
//         "severity": "High",
//         "severityBadge": "❌",
//         "recommendation": "Implement rate limiting to prevent abuse.",
//         "remediationSteps": [
//           "Add rate limiting middleware (e.g., express-rate-limit)",
//           "Set thresholds for failed login attempts",
//           "Monitor and alert on suspicious activity"
//         ],
//         "tag": "authentication",
//         "resourceLink": "https://owasp.org/www-community/controls/Rate_Limiting"
//       },
//       {
//         "id": "sec2",
//         "title": "Insecure Direct Object Reference (IDOR) in /users/:id",
//         "description": "The endpoint allows users to access or modify data without proper authorization checks.",
//         "endpoint": "/users/:id",
//         "severity": "Medium",
//         "severityBadge": "⚠️",
//         "recommendation": "Add authorization checks to ensure users can only access their own data.",
//         "remediationSteps": [
//           "Implement role-based access control (RBAC)",
//           "Validate user permissions before processing requests",
//           "Use UUIDs instead of sequential IDs where possible"
//         ],
//         "tag": "authorization",
//         "resourceLink": "https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control"
//       },
//       {
//         "id": "sec3",
//         "title": "Sensitive Data Exposure in Responses",
//         "description": "User responses include unnecessary sensitive information like internal IDs.",
//         "endpoint": "/users",
//         "severity": "Low",
//         "severityBadge": "⚠️",
//         "recommendation": "Sanitize responses to exclude sensitive data.",
//         "remediationSteps": [
//           "Use data masking or filtering in response serialization",
//           "Review and minimize data returned in API responses",
//           "Implement GDPR/compliance checks"
//         ],
//         "tag": "data_protection",
//         "resourceLink": "https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"
//       }
//     ]
//   }
// }

  // Provide a logo URL or base64 string; replace with your actual logo path or base64 data
  logoUrl = 'assets/images/logo.png'; // place your logo under assets/ or use data:image/png;base64,...

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // initialize mermaid
    mermaid.initialize({ startOnLoad: false, theme: 'default' });

        // ✅ Fetch report from service
    this.apiService.getReport().subscribe({
      next: (data) => {
        this.report = data;

      },
      error: (err) => {
        console.error('Error fetching report:', err);
      },
    });
  }

  // Called when user clicks the button
  async onGenerateReport() {
    try {
      await this.generatePdfFromReport(this.report, this.logoUrl);
    } catch (err) {
      console.error('PDF generation error', err);
      alert('Failed to generate PDF: ' + (err as any).message);
    }
  }

  // ----- Core PDF generation function -----
  // ----- Core PDF generation function (updated) -----
  // Replace your existing generatePdfFromReport(...) with this function
  async generatePdfFromReport(
    report: APIWatchdogReport,
    logoUrl?: string
  ): Promise<void> {
    // --- Build container (offscreen but renderable) ---
    const container = document.createElement('div');
    container.style.width = '1000px';
    container.style.maxWidth = '1000px';
    container.style.padding = '24px';
    container.style.background = '#fff';
    container.style.color = '#111';
    container.className = 'pdf-report-container';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.zIndex = '2147483647';
    container.style.transform = 'translateX(-200vw)';
    container.style.opacity = '1';
    container.style.pointerEvents = 'none';

    const style = document.createElement('style');
    style.innerHTML = `
    .pdf-report-container { font-family: Arial, Helvetica, sans-serif; color:#111; }
    .pdf-logo { text-align: center; margin-bottom: 12px; }
    .report-title { text-align:center; font-size:22px; font-weight:700; margin-bottom:6px }
    .report-sub { text-align:center; color:#555; margin-bottom:18px; }
    .section-heading { font-size:18px; margin-top:20px; margin-bottom:8px; color:#2b2b2b; border-bottom:1px solid #eee; padding-bottom:6px; }
    table.endpoints { width:100%; border-collapse: collapse; font-size:12px; }
    table.endpoints th, table.endpoints td { border:1px solid #ddd; padding:8px; vertical-align: top; }
    table.endpoints th { background:#f7f7f7; text-align:left; }
    pre.spec-block { white-space: pre-wrap; word-wrap: break-word; font-size:11px; padding:12px; border-radius:6px; border:1px solid #e1e1e1; overflow:auto; }
    .diagram { margin: 10px 0 16px 0; border: 1px solid #eee; padding: 8px; border-radius:6px; }
    .security-issue { margin-bottom:10px; padding:10px; border-radius:6px; border:1px solid #eee; }
    .severity-High { border-left:6px solid #d64545; }
    .severity-Medium { border-left:6px solid #e6a800; }
    .severity-Low { border-left:6px solid #2c9f45; }
    .code-title { font-size:13px; font-weight:600; margin-bottom:6px; }
    .recommendations { margin-top:6px; margin-bottom:6px; padding-left:18px; }
    a { color:#0b5cff; text-decoration: underline; }
  `;
    container.appendChild(style);

    // Logo
    if (logoUrl) {
      const logoWrap = document.createElement('div');
      logoWrap.className = 'pdf-logo';
      const logoImg = document.createElement('img');
      logoImg.src = logoUrl;
      logoImg.style.maxWidth = '160px';
      logoImg.style.height = 'auto';
      logoImg.alt = 'Logo';
      logoWrap.appendChild(logoImg);
      container.appendChild(logoWrap);
    }

    // Title / subtitle / stats
    const title = document.createElement('div');
    title.className = 'report-title';
    title.innerText = report.meta?.title ?? 'API Report';
    container.appendChild(title);

    const sub = document.createElement('div');
    sub.className = 'report-sub';
    sub.innerText = report.meta?.heading
      ? `${report.meta.heading} — ${report.meta.description ?? ''}`
      : report.meta?.description ?? '';
    container.appendChild(sub);

    const statsDiv = document.createElement('div');
    statsDiv.style.display = 'flex';
    statsDiv.style.gap = '16px';
    statsDiv.style.justifyContent = 'center';
    statsDiv.style.marginBottom = '14px';
    const s = report.meta?.stats ?? {};
    ['totalEndpoints', 'totalFlows', 'totalIssues'].forEach((k) => {
      const statEl = document.createElement('div');
      statEl.style.textAlign = 'center';
      statEl.innerHTML = `<div style="font-weight:700; font-size:18px">${
        (s as any)[k] ?? '-'
      }</div><div style="font-size:12px; color:#666">${k.toUpperCase()}</div>`;
      statsDiv.appendChild(statEl);
    });
    container.appendChild(statsDiv);

    // Endpoints table
    const epHeading = document.createElement('div');
    epHeading.className = 'section-heading';
    epHeading.textContent = report.endpoints?.heading ?? 'Discovered Endpoints';
    container.appendChild(epHeading);
    const epDesc = document.createElement('div');
    epDesc.style.marginBottom = '8px';
    epDesc.style.color = '#555';
    epDesc.textContent = report.endpoints?.description ?? '';
    container.appendChild(epDesc);

    const table = document.createElement('table');
    table.className = 'endpoints';
    const thead = document.createElement('thead');
    thead.innerHTML = `
    <tr>
      <th>Method</th><th>Path</th><th>Status</th><th>Description</th><th>Usage</th><th>Request Example</th><th>Response Example</th>
    </tr>
  `;
    table.appendChild(thead);
    const tbody = document.createElement('tbody');

    for (const item of report.endpoints?.items || []) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td style="font-weight:700">${item.method}</td>
      <td>${item.path}</td>
      <td>${item.status ?? ''}</td>
      <td>${item.description ?? ''}</td>
      <td>${item.usageFrequency ?? ''}</td>
      <td><pre style="white-space:pre-wrap">${this.safeJson(
        item.requestExample
      )}</pre></td>
      <td><pre style="white-space:pre-wrap">${this.safeJson(
        item.responseExample
      )}</pre></td>
    `;
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);

    // Spec
    const specHeading = document.createElement('div');
    specHeading.className = 'section-heading';
    specHeading.textContent = report.spec?.title ?? 'API Specification';
    container.appendChild(specHeading);
    const specDesc = document.createElement('div');
    specDesc.style.marginBottom = '8px';
    specDesc.style.color = '#555';
    specDesc.textContent = report.spec?.description ?? '';
    container.appendChild(specDesc);

    const codeWrap = document.createElement('div');
    codeWrap.style.marginBottom = '12px';
    const codeTitle = document.createElement('div');
    codeTitle.className = 'code-title';
    codeTitle.textContent = `Spec (version ${report.spec?.version ?? 'n/a'})`;
    codeWrap.appendChild(codeTitle);
    const pre = document.createElement('pre');
    pre.className = 'spec-block';
    const code = document.createElement('code');
    code.className = 'language-yaml';
    code.textContent = report.spec?.specScript ?? 'No spec script available';
    pre.appendChild(code);
    codeWrap.appendChild(pre);
    container.appendChild(codeWrap);

    // Flows (mermaid nodes)
    const flowsHeading = document.createElement('div');
    flowsHeading.className = 'section-heading';
    flowsHeading.textContent = report.flows?.heading ?? 'Sequence Flows';
    container.appendChild(flowsHeading);

    if (Array.isArray(report.flows?.flows)) {
      for (const flow of report.flows.flows) {
        const fTitle = document.createElement('div');
        fTitle.style.fontWeight = '700';
        fTitle.style.marginTop = '8px';
        fTitle.textContent = flow.title || flow.id || 'Flow';
        container.appendChild(fTitle);
        const fDesc = document.createElement('div');
        fDesc.style.color = '#555';
        fDesc.style.marginBottom = '8px';
        fDesc.textContent = flow.description ?? '';
        container.appendChild(fDesc);

        const diagramWrap = document.createElement('div');
        diagramWrap.className = 'diagram';
        const mermaidNode = document.createElement('div');
        mermaidNode.className = 'mermaid';
        mermaidNode.textContent = flow.mermaidScript || '';
        diagramWrap.appendChild(mermaidNode);
        container.appendChild(diagramWrap);
      }
    }

    // --- Security (with bullet recommendations and clickable links) ---
    const secHeading = document.createElement('div');
    secHeading.className = 'section-heading';
    secHeading.textContent = report.security?.heading ?? 'Security Insights';
    container.appendChild(secHeading);
    const secDesc = document.createElement('div');
    secDesc.style.color = '#555';
    secDesc.style.marginBottom = '8px';
    secDesc.textContent = report.security?.description ?? '';
    container.appendChild(secDesc);

    for (const issue of report.security?.issues || []) {
      const issueDiv = document.createElement('div');
      issueDiv.className = `security-issue severity-${issue.severity}`;
      issueDiv.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:700">${
          issue.title
        } <span style="font-weight:600; color:#888; font-size:12px">[${
        issue.tag
      }]</span></div>
        <div style="font-size:13px">${
          issue.severityBadge ?? issue.severity
        }</div>
      </div>
      <div style="color:#444; margin-top:6px">${issue.description}</div>
      <div style="margin-top:6px"><strong>Affected:</strong> ${
        issue.endpoint
      }</div>
    `;

      // Recommendation(s) as bullet points
      const recWrap = document.createElement('div');
      recWrap.style.marginTop = '6px';
      recWrap.innerHTML = `<strong>Recommendation(s):</strong>`;
      const recUl = document.createElement('ul');
      recUl.className = 'recommendations';
      // If recommendation is a string, show single li; if it's array-like, add multiple
      if (Array.isArray((issue as any).recommendation)) {
        for (const r of (issue as any).recommendation) {
          const li = document.createElement('li');
          li.textContent = r;
          recUl.appendChild(li);
        }
      } else {
        const li = document.createElement('li');
        li.textContent = issue.recommendation ?? '';
        recUl.appendChild(li);
      }
      recWrap.appendChild(recUl);
      issueDiv.appendChild(recWrap);

      // remediation steps (also unordered bullets)
      if (
        Array.isArray(issue.remediationSteps) &&
        issue.remediationSteps.length
      ) {
        const remWrap = document.createElement('div');
        remWrap.style.marginTop = '6px';
        remWrap.innerHTML = `<strong>Remediation Steps:</strong>`;
        const remUl = document.createElement('ul');
        remUl.className = 'recommendations';
        for (const step of issue.remediationSteps) {
          const li = document.createElement('li');
          li.textContent = step;
          remUl.appendChild(li);
        }
        remWrap.appendChild(remUl);
        issueDiv.appendChild(remWrap);
      }

      // clickable resource link (anchor)
      if (issue.resourceLink) {
        const linkDiv = document.createElement('div');
        linkDiv.style.marginTop = '6px';
        // open in new tab when clicked in browser
        linkDiv.innerHTML = `<a href="${issue.resourceLink}" target="_blank" rel="noopener noreferrer">${issue.resourceLink}</a>`;
        issueDiv.appendChild(linkDiv);
      }

      container.appendChild(issueDiv);
    }

    // Add to DOM
    document.body.appendChild(container);

    // Highlight spec
    try {
      await this.wait(30);
      hljs.highlightElement(code);
    } catch (e) {
      console.warn('highlight failed', e);
    }

    // Render mermaid diagrams (init parses .mermaid nodes)
    try {
      (mermaid as any).init(undefined, container.querySelectorAll('.mermaid'));
    } catch (err) {
      console.warn('mermaid.init failed, attempting per-node render', err);
      const nodes = container.querySelectorAll('.mermaid');
      for (const n of Array.from(nodes)) {
        const txt = (n as HTMLElement).textContent || '';
        try {
          const id = 'mmd-' + Math.random().toString(36).slice(2, 9);
          const out = (mermaid as any).render
            ? await (mermaid as any).render(id, txt)
            : await (mermaid as any).mermaidAPI.render(id, txt);
          (n as HTMLElement).innerHTML =
            typeof out === 'string'
              ? out
              : (out && (out.svg || out.svgStr)) || '';
        } catch (e) {
          console.warn('mermaid render failed for one node', e);
        }
      }
    }

    // Wait for images & svgs to settle
    try {
      await this.waitForImages(container, 5000);
    } catch (e) {
      console.warn('waitForImages timeout or error', e);
    }

    // Small delay to ensure layout settled
    await this.wait(120);

    // Ensure container is renderable in viewport (we moved it off-screen earlier)
    container.style.transform = 'translateX(0)';
    container.style.left = '0';
    container.style.top = '0';
    container.style.opacity = '1';

    // Capture with html2canvas
    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true,
        windowWidth: container.scrollWidth,
      });
      console.log(
        '[generatePdfFromReport] html2canvas produced',
        canvas.width,
        canvas.height
      );
    } catch (err) {
      console.error('html2canvas capture failed', err);
      try {
        document.body.removeChild(container);
      } catch {}
      throw err;
    }

    // Convert canvas -> multi-page PDF using JPEG slices
    try {
      const pdf = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const usableW = pdfW - margin * 2;
      const usableH = pdfH - margin * 2;

      // scaled image width in PDF coordinates and corresponding height
      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const imgType = 'JPEG';
      const quality = 0.92;

      if (imgH <= usableH) {
        const imgData = canvas.toDataURL('image/jpeg', quality);
        pdf.addImage(
          imgData,
          imgType,
          margin,
          margin,
          imgW,
          imgH,
          undefined,
          'FAST'
        );
        const safeTitle = (report.meta?.title || 'api-report')
          .replace(/\s+/g, '-')
          .toLowerCase();
        pdf.save(`${safeTitle}.pdf`);
      } else {
        // split into vertical slices
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        // height in source pixels that maps to one PDF page
        const sliceHt = Math.floor((canvas.width * usableH) / imgW);
        pageCanvas.height = sliceHt;

        let y = 0;
        let pageIndex = 0;
        while (y < canvas.height) {
          const ctx = pageCanvas.getContext('2d')!;
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          const drawH = Math.min(sliceHt, canvas.height - y);
          ctx.drawImage(
            canvas,
            0,
            y,
            canvas.width,
            drawH,
            0,
            0,
            pageCanvas.width,
            drawH
          );

          // if last slice shorter, make a temporary shorter canvas to avoid white gap
          let dataUrl: string;
          if (drawH < sliceHt) {
            const tmp = document.createElement('canvas');
            tmp.width = pageCanvas.width;
            tmp.height = drawH;
            tmp
              .getContext('2d')!
              .drawImage(
                pageCanvas,
                0,
                0,
                pageCanvas.width,
                drawH,
                0,
                0,
                pageCanvas.width,
                drawH
              );
            dataUrl = tmp.toDataURL('image/jpeg', quality);
          } else {
            dataUrl = pageCanvas.toDataURL('image/jpeg', quality);
          }

          const thisImgH = (drawH * imgW) / canvas.width;
          if (pageIndex > 0) pdf.addPage();
          pdf.addImage(
            dataUrl,
            imgType,
            margin,
            margin,
            imgW,
            thisImgH,
            undefined,
            'FAST'
          );

          y += drawH;
          pageIndex++;
        }

        const safeTitle = (report.meta?.title || 'api-report')
          .replace(/\s+/g, '-')
          .toLowerCase();
        pdf.save(`${safeTitle}.pdf`);
      }
    } catch (err) {
      console.error('Canvas->PDF conversion failed', err);
      alert(
        'PDF generation failed during Canvas->PDF step. See console for details.'
      );
    } finally {
      // cleanup DOM
      try {
        document.body.removeChild(container);
      } catch {}
    }
  }

  // Wait for images inside element to load (resolves or times out)
  async waitForImages(el: HTMLElement, timeoutMs = 3000) {
    const imgs = Array.from(el.querySelectorAll('img'));
    if (!imgs.length) return;
    await Promise.race([
      Promise.all(
        imgs.map(
          (img) =>
            new Promise((res) => {
              if ((img as HTMLImageElement).complete) return res(true);
              (img as HTMLImageElement).addEventListener('load', () =>
                res(true)
              );
              (img as HTMLImageElement).addEventListener('error', () =>
                res(true)
              );
            })
        )
      ),
      new Promise((res, rej) => setTimeout(() => res(true), timeoutMs)),
    ]);
  }

  // Detect a simple cross-origin URL (very basic heuristic)
  isCrossOriginUrl(url?: string) {
    if (!url) return false;
    try {
      const u = new URL(url, window.location.href);
      return u.origin !== window.location.origin;
    } catch {
      return false;
    }
  }

  // safeJson, escapeHtml, wait remain unchanged...

  // Utility: JSON -> pretty string safely
  safeJson(obj: any) {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj ?? '');
    }
  }

  // Utility: escape html so raw mermaid script or code show safely if mermaid fails
  escapeHtml(str: string) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return (
        {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;',
        } as any
      )[m];
    });
  }

  wait(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // -----------------------------
  // Add these methods to your class
  // -----------------------------

  /**
   * Build a small header element (title/subtitle + right aligned logo)
   * used on all partial exports.
   */
  private buildHeaderElement(
    report: APIWatchdogReport,
    logoUrl?: string
  ): HTMLElement {
    const header = document.createElement('div');
    header.className = 'pdf-header';
    header.style.display = 'flex';
    header.style.flexDirection = 'column'; // stack logo and header
    header.style.alignItems = 'flex-start'; // logo aligns left
    header.style.width = '100%';
    header.style.padding = '8px 0 16px 0';
    header.style.marginBottom = '6px';
    header.style.boxSizing = 'border-box';

    // Logo on top (left aligned)
    if (logoUrl) {
      const logoWrap = document.createElement('div');
      logoWrap.style.marginBottom = '12px'; // spacing below logo

      const img = document.createElement('img');
      img.src = logoUrl;
      img.alt = 'Logo';
      img.style.maxWidth = '160px';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.maxHeight = '64px';

      logoWrap.appendChild(img);
      header.appendChild(logoWrap);
    }

    // Header block (centered below logo)
    const centerBlock = document.createElement('div');
    centerBlock.style.display = 'flex';
    centerBlock.style.flexDirection = 'column';
    centerBlock.style.alignItems = 'center';
    centerBlock.style.justifyContent = 'center';
    centerBlock.style.width = '100%';
    centerBlock.style.textAlign = 'center';

    const title = document.createElement('div');
    title.style.fontSize = '22px';
    title.style.fontWeight = '700';
    title.style.color = '#111';
    title.textContent = report.meta?.title ?? 'API Report';
    centerBlock.appendChild(title);

    const sub = document.createElement('div');
    sub.style.fontSize = '12px';
    sub.style.color = '#555';
    sub.style.marginTop = '6px';
    sub.textContent = report.meta?.heading
      ? `${report.meta.heading} — ${report.meta.description ?? ''}`
      : report.meta?.description ?? '';
    centerBlock.appendChild(sub);

    header.appendChild(centerBlock);

    return header;
  }

  /**
   * Generic capture: html2canvas -> jsPDF multi-page (JPEG)
   * Returns a Promise that resolves when saved (or rejects on error).
   */
  private async captureElementToPdf(
    element: HTMLElement,
    filename = 'export.pdf'
  ): Promise<void> {
    // place element into an off-DOM container so it's not visible / affects layout
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.transform = 'translateX(-200vw)'; // off-screen but renderable
    wrapper.style.opacity = '1';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.background = '#fff';
    wrapper.style.padding = '24px';
    wrapper.appendChild(element);

    document.body.appendChild(wrapper);
    // Wait a tick for rendering (images / fonts / svg)
    await this.wait(80);
    await this.waitForImages(wrapper, 4000);

    // Ensure mermaid svgs (if any) are rendered (if scripts inserted raw)
    try {
      (mermaid as any).init?.(undefined, wrapper.querySelectorAll('.mermaid'));
    } catch (e) {
      // try per-node render
      const nodes = wrapper.querySelectorAll('.mermaid');
      for (const n of Array.from(nodes)) {
        const txt = (n as HTMLElement).textContent || '';
        try {
          const id = 'mmd-' + Math.random().toString(36).slice(2, 9);
          const out = (mermaid as any).render
            ? await (mermaid as any).render(id, txt)
            : await (mermaid as any).mermaidAPI.render(id, txt);
          (n as HTMLElement).innerHTML =
            typeof out === 'string'
              ? out
              : (out && (out.svg || out.svgStr)) || '';
        } catch {
          // leave as-is
        }
      }
    }

    // final settle
    await this.wait(120);

    try {
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        windowWidth: wrapper.scrollWidth,
      });

      // create PDF with jsPDF and add slices if tall
      const pdf = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait',
        compress: true,
      });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const margin = 18;
      const usableW = pdfW - margin * 2;
      const usableH = pdfH - margin * 2;

      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const quality = 0.92;
      const imgType = 'JPEG';

      if (imgH <= usableH) {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        pdf.addImage(
          dataUrl,
          imgType,
          margin,
          margin,
          imgW,
          imgH,
          undefined,
          'FAST'
        );
      } else {
        // split into pages vertically
        const sliceHt = Math.floor((canvas.width * usableH) / imgW);
        let y = 0;
        let pageIndex = 0;
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHt;
        const ctx = pageCanvas.getContext('2d')!;

        while (y < canvas.height) {
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          const drawH = Math.min(sliceHt, canvas.height - y);
          ctx.drawImage(
            canvas,
            0,
            y,
            canvas.width,
            drawH,
            0,
            0,
            pageCanvas.width,
            drawH
          );

          let dataUrl: string;
          if (drawH < sliceHt) {
            const tmp = document.createElement('canvas');
            tmp.width = pageCanvas.width;
            tmp.height = drawH;
            tmp
              .getContext('2d')!
              .drawImage(
                pageCanvas,
                0,
                0,
                pageCanvas.width,
                drawH,
                0,
                0,
                pageCanvas.width,
                drawH
              );
            dataUrl = tmp.toDataURL('image/jpeg', quality);
          } else {
            dataUrl = pageCanvas.toDataURL('image/jpeg', quality);
          }

          const partImgH = (drawH * imgW) / canvas.width;
          if (pageIndex > 0) pdf.addPage();
          pdf.addImage(
            dataUrl,
            imgType,
            margin,
            margin,
            imgW,
            partImgH,
            undefined,
            'FAST'
          );

          y += drawH;
          pageIndex++;
        }
      }

      pdf.save(filename);
    } finally {
      // cleanup
      try {
        document.body.removeChild(wrapper);
      } catch {}
    }
  }

  /**
   * Build a container specifically for the security section (header + security)
   * and trigger a download
   */
  async downloadSecurityPdf(): Promise<void> {
    // create container element with styling similar to main report
    const container = document.createElement('div');
    container.style.width = '1000px';
    container.style.maxWidth = '1000px';
    container.style.background = '#fff';
    container.style.color = '#111';
    container.style.fontFamily = 'Arial, Helvetica, sans-serif';
    container.style.padding = '18px';

    // header
    container.appendChild(this.buildHeaderElement(this.report, this.logoUrl));

    // Add a section heading
    const secHeading = document.createElement('div');
    secHeading.style.fontSize = '18px';
    secHeading.style.marginTop = '4px';
    secHeading.style.marginBottom = '8px';
    secHeading.style.fontWeight = '700';
    secHeading.textContent =
      this.report.security?.heading ?? 'Security Insights';
    container.appendChild(secHeading);

    // Add description
    const secDesc = document.createElement('div');
    secDesc.style.color = '#555';
    secDesc.style.marginBottom = '8px';
    secDesc.textContent = this.report.security?.description ?? '';
    container.appendChild(secDesc);

    // Add each issue similarly to your main renderer
    for (const issue of this.report.security?.issues || []) {
      const issueDiv = document.createElement('div');
      issueDiv.style.marginBottom = '10px';
      issueDiv.style.padding = '10px';
      issueDiv.style.borderRadius = '6px';
      issueDiv.style.border = '1px solid #eee';
      issueDiv.style.display = 'block';
      const badge = issue.severityBadge ?? issue.severity;

      issueDiv.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:700">${issue.title} <span style="font-weight:600; color:#888; font-size:12px">[${issue.tag}]</span></div>
        <div style="font-size:13px">${badge}</div>
      </div>
      <div style="color:#444; margin-top:6px">${issue.description}</div>
      <div style="margin-top:6px"><strong>Affected:</strong> ${issue.endpoint}</div>
    `;
      // recommendations (bullet)
      const recWrap = document.createElement('div');
      recWrap.style.marginTop = '8px';
      recWrap.innerHTML = `<strong>Recommendation(s):</strong>`;
      const recUl = document.createElement('ul');
      recUl.style.paddingLeft = '18px';
      recUl.style.marginTop = '6px';
      if (Array.isArray((issue as any).recommendation)) {
        for (const r of (issue as any).recommendation) {
          const li = document.createElement('li');
          li.textContent = r;
          recUl.appendChild(li);
        }
      } else {
        const li = document.createElement('li');
        li.textContent = issue.recommendation ?? '';
        recUl.appendChild(li);
      }
      recWrap.appendChild(recUl);
      issueDiv.appendChild(recWrap);

      // remediation steps bullet
      if (
        Array.isArray(issue.remediationSteps) &&
        issue.remediationSteps.length
      ) {
        const remWrap = document.createElement('div');
        remWrap.style.marginTop = '6px';
        remWrap.innerHTML = `<strong>Remediation Steps:</strong>`;
        const remUl = document.createElement('ul');
        remUl.style.paddingLeft = '18px';
        remUl.style.marginTop = '6px';
        for (const step of issue.remediationSteps) {
          const li = document.createElement('li');
          li.textContent = step;
          remUl.appendChild(li);
        }
        remWrap.appendChild(remUl);
        issueDiv.appendChild(remWrap);
      }

      // resource link (clickable)
      if (issue.resourceLink) {
        const aWrap = document.createElement('div');
        aWrap.style.marginTop = '6px';
        const a = document.createElement('a');
        a.href = issue.resourceLink;
        a.textContent = issue.resourceLink;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        aWrap.appendChild(a);
        issueDiv.appendChild(aWrap);
      }

      container.appendChild(issueDiv);
    }

    // capture to PDF
    const safeTitle = (this.report.meta?.title || 'security-report')
      .replace(/\s+/g, '-')
      .toLowerCase();
    await this.captureElementToPdf(container, `${safeTitle}-security.pdf`);
  }

  /**
   * Build container for endpoints & header and download PDF
   */
  async downloadEndpointsPdf(): Promise<void> {
    const container = document.createElement('div');
    container.style.width = '1000px';
    container.style.maxWidth = '1000px';
    container.style.background = '#fff';
    container.style.color = '#111';
    container.style.fontFamily = 'Arial, Helvetica, sans-serif';
    container.style.padding = '18px';

    container.appendChild(this.buildHeaderElement(this.report, this.logoUrl));

    // endpoints heading + description
    const epHeading = document.createElement('div');
    epHeading.style.fontSize = '18px';
    epHeading.style.fontWeight = '700';
    epHeading.style.marginBottom = '8px';
    epHeading.textContent =
      this.report.endpoints?.heading ?? 'Discovered Endpoints';
    container.appendChild(epHeading);

    const epDesc = document.createElement('div');
    epDesc.style.color = '#555';
    epDesc.style.marginBottom = '8px';
    epDesc.textContent = this.report.endpoints?.description ?? '';
    container.appendChild(epDesc);

    // table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '12px';
    table.innerHTML = `
    <thead>
      <tr>
        <th style="border:1px solid #ddd; padding:8px; background:#f7f7f7; text-align:left">Method</th>
        <th style="border:1px solid #ddd; padding:8px; background:#f7f7f7; text-align:left">Path</th>
        <th style="border:1px solid #ddd; padding:8px; background:#f7f7f7; text-align:left">Status</th>
        <th style="border:1px solid #ddd; padding:8px; background:#f7f7f7; text-align:left">Description</th>
        <th style="border:1px solid #ddd; padding:8px; background:#f7f7f7; text-align:left">Usage</th>
        <th style="border:1px solid #ddd; padding:8px; background:#f7f7f7; text-align:left">Request Example</th>
        <th style="border:1px solid #ddd; padding:8px; background:#f7f7f7; text-align:left">Response Example</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
    const tbody = table.querySelector('tbody')!;
    for (const item of this.report.endpoints?.items || []) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td style="border:1px solid #ddd; padding:8px; vertical-align:top; font-weight:700">${
        item.method
      }</td>
      <td style="border:1px solid #ddd; padding:8px; vertical-align:top">${
        item.path
      }</td>
      <td style="border:1px solid #ddd; padding:8px; vertical-align:top">${
        item.status ?? ''
      }</td>
      <td style="border:1px solid #ddd; padding:8px; vertical-align:top">${
        item.description ?? ''
      }</td>
      <td style="border:1px solid #ddd; padding:8px; vertical-align:top">${
        item.usageFrequency ?? ''
      }</td>
      <td style="border:1px solid #ddd; padding:8px; vertical-align:top"><pre style="white-space:pre-wrap; margin:0">${this.safeJson(
        item.requestExample
      )}</pre></td>
      <td style="border:1px solid #ddd; padding:8px; vertical-align:top"><pre style="white-space:pre-wrap; margin:0">${this.safeJson(
        item.responseExample
      )}</pre></td>
    `;
      tbody.appendChild(tr);
    }
    container.appendChild(table);

    const safeTitle = (this.report.meta?.title || 'api-documentation')
      .replace(/\s+/g, '-')
      .toLowerCase();
    await this.captureElementToPdf(container, `${safeTitle}-endpoints.pdf`);
  }

  /**
   * Download specScript as YAML file
   */
  downloadSpecFile(): void {
    const spec = this.report.spec?.specScript ?? '';
    const blob = new Blob([spec], { type: 'application/x-yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    this.downloadDataUrl(
      `${(this.report.meta?.title || 'openapi-spec')
        .replace(/\s+/g, '-')
        .toLowerCase()}.yaml`,
      url
    );
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  /**
   * Simple modal: choose a flow and download it as PNG or SVG.
   */
  openSequenceDialog(): void {
    // ensure only one modal present
    const existing = document.getElementById('sequence-export-modal');
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'sequence-export-modal';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.zIndex = '2147483647';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.background = 'rgba(0,0,0,0.45)';

    const box = document.createElement('div');
    box.style.width = '420px';
    box.style.maxWidth = '92%';
    box.style.background = '#fff';
    box.style.borderRadius = '8px';
    box.style.padding = '18px';
    box.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
    box.style.color = '#111';

    const title = document.createElement('div');
    title.style.fontSize = '16px';
    title.style.fontWeight = '700';
    title.style.marginBottom = '8px';
    title.textContent = 'Export Sequence Diagram';
    box.appendChild(title);

    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.fontSize = '12px';
    label.style.color = '#444';
    label.textContent = 'Choose diagram';
    box.appendChild(label);

    const select = document.createElement('select');
    select.style.width = '100%';
    select.style.padding = '8px';
    select.style.marginTop = '6px';
    select.style.marginBottom = '12px';
    select.style.border = '1px solid #ddd';
    select.style.borderRadius = '4px';

    const flows = this.report.flows?.flows ?? [];
    for (const f of flows) {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.text = f.title || f.id;
      select.appendChild(opt);
    }
    box.appendChild(select);

    // format radio / buttons
    // format buttons row
    const formatRow = document.createElement('div');
    formatRow.style.display = 'flex';
    formatRow.style.gap = '8px';
    formatRow.style.marginBottom = '12px';
    formatRow.style.justifyContent = 'flex-start'; // keeps buttons aligned in one line

    const btnPng = document.createElement('button');
    btnPng.textContent = 'Download PNG';
    btnPng.style.padding = '8px 12px';
    btnPng.style.background = '#111';
    btnPng.style.color = '#fff';
    btnPng.style.border = 'none';
    btnPng.style.borderRadius = '4px';
    btnPng.style.cursor = 'pointer';

    const btnSvg = document.createElement('button');
    btnSvg.textContent = 'Download SVG';
    btnSvg.style.padding = '8px 12px';
    btnSvg.style.background = '#fff';
    btnSvg.style.color = '#111';
    btnSvg.style.border = '1px solid #ddd';
    btnSvg.style.borderRadius = '4px';
    btnSvg.style.cursor = 'pointer';

    const cancel = document.createElement('button');
    cancel.textContent = 'Close';
    cancel.style.padding = '8px 12px';
    cancel.style.background = '#f3f3f3';
    cancel.style.border = '1px solid #ddd';
    cancel.style.borderRadius = '4px';
    cancel.style.cursor = 'pointer';

    formatRow.appendChild(btnPng);
    formatRow.appendChild(btnSvg);
    formatRow.appendChild(cancel);
    box.appendChild(formatRow);

    modal.appendChild(box);
    document.body.appendChild(modal);

    const closeModal = () => {
      try {
        modal.remove();
      } catch {}
    };

    cancel.onclick = closeModal;

    const findFlowById = (id: string) => flows.find((f: any) => f.id === id);

    // helper to render mermaid and return svg string
    const renderMermaidToSvg = async (script: string) => {
      const id = 'mmd-export-' + Math.random().toString(36).slice(2, 9);
      try {
        if ((mermaid as any).render) {
          const out = await (mermaid as any).render(id, script);
          if (typeof out === 'string') return out;
          return out?.svg || out?.svgStr || '';
        } else if ((mermaid as any).mermaidAPI?.render) {
          const out = await (mermaid as any).mermaidAPI.render(id, script);
          return typeof out === 'string' ? out : out?.svg || out?.svgStr || '';
        }
        throw new Error('Mermaid render not available');
      } catch (e) {
        // fallback: place script into a temporary mermaid container and try init
        const tmp = document.createElement('div');
        tmp.className = 'mermaid';
        tmp.textContent = script;
        document.body.appendChild(tmp);
        try {
          (mermaid as any).init?.(undefined, tmp);
          // now attempt to read innerHTML (svg)
          const svg = tmp.innerHTML || '';
          tmp.remove();
          return svg;
        } catch {
          tmp.remove();
          throw e;
        }
      }
    };

    // download svg string as file
    const downloadSvgString = (name: string, svgStr: string) => {
      // ensure xml header and namespace
      if (!svgStr.includes('<?xml')) {
        // try to ensure <svg ...> exists
        svgStr = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgStr;
      }
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      this.downloadDataUrl(name, url);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };

    // convert svg to png via Image + canvas
    const downloadSvgAsPng = (name: string, svgStr: string) => {
      const svg64 = encodeURIComponent(svgStr);
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + svg64;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        // clear white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL('image/png');
        this.downloadDataUrl(name, png);
      };
      img.onerror = (err) => {
        console.error('Failed to load svg into image for PNG conversion', err);
        alert('Failed to convert SVG to PNG. Check console.');
      };
      img.crossOrigin = 'anonymous';
      img.src = dataUrl;
    };

    btnSvg.onclick = async () => {
      const id = select.value || flows[0]?.id;
      const flow = findFlowById(id);
      if (!flow) {
        alert('No flow selected');
        return;
      }
      try {
        const svg = await renderMermaidToSvg(flow.mermaidScript || '');
        const safeName = `${(flow.title || flow.id).replace(/\s+/g, '-')}.svg`;
        downloadSvgString(safeName, svg);
        closeModal();
      } catch (e) {
        console.error('Mermaid render/download SVG failed', e);
        alert('Failed to render flow SVG. See console.');
      }
    };

    btnPng.onclick = async () => {
      const id = select.value || flows[0]?.id;
      const flow = findFlowById(id);
      if (!flow) {
        alert('No flow selected');
        return;
      }
      try {
        const svg = await renderMermaidToSvg(flow.mermaidScript || '');
        const safeName = `${(flow.title || flow.id).replace(/\s+/g, '-')}.png`;
        downloadSvgAsPng(safeName, svg);
        closeModal();
      } catch (e) {
        console.error('Mermaid render/download PNG failed', e);
        alert('Failed to render flow PNG. See console.');
      }
    };
  }

  /**
   * Small util used by spec + sequence to trigger a download from a data URL
   */
  private downloadDataUrl(filename: string, dataUrl: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
