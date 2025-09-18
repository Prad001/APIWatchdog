"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastReport = getLastReport;
// server/src/routes/upload/upload.ts
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config({ path: "./.env" });
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
    console.warn("OPENROUTER_API_KEY is not set in .env");
}
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" });
// cache keyed by file hash
const reportCache = new Map();
const MAX_CACHE_SIZE = 50;
let lastReport = null;
function addToCache(hash, report) {
    if (reportCache.size >= MAX_CACHE_SIZE) {
        // delete the oldest inserted item (FIFO)
        const firstKey = reportCache.keys().next().value;
        if (firstKey !== undefined) {
            reportCache.delete(firstKey);
        }
    }
    reportCache.set(hash, report);
}
function getLastReport() {
    return lastReport;
}
// helper: compute SHA256 of file content
function fileHash(content) {
    return crypto_1.default.createHash("sha256").update(content).digest("hex");
}
// helper: chunk large content
function chunkContent(content, size = 4000) {
    const chunks = [];
    for (let i = 0; i < content.length; i += size) {
        chunks.push(content.slice(i, i + size));
    }
    return chunks;
}
/**
 * Robustly extract the first balanced JSON object from a string.
 * This parser respects quoted strings and escaped quotes so braces inside strings are ignored.
 */
function extractFirstJsonObject(raw) {
    if (!raw)
        return null;
    // Remove common markdown fences (best-effort)
    raw = raw.replace(/```json/gi, "{").replace(/```/g, "}");
    const firstBrace = raw.indexOf("{");
    if (firstBrace === -1)
        return null;
    let i = firstBrace;
    let depth = 0;
    let inString = null; // <-- FIX: should be string or null (stores the quote char)
    let escaped = false;
    for (; i < raw.length; i++) {
        const ch = raw[i];
        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (ch === "\\") {
                escaped = true;
                continue;
            }
            if (ch === inString) {
                inString = null; // string closed
                continue;
            }
            continue;
        }
        else {
            if (ch === '"' || ch === "'") {
                inString = ch;
                escaped = false;
                continue;
            }
            if (ch === "{") {
                depth++;
                continue;
            }
            if (ch === "}") {
                depth--;
                if (depth === 0) {
                    // slice from firstBrace to i inclusive
                    return raw.slice(firstBrace, i + 1);
                }
                continue;
            }
        }
    }
    // if we reach here we didn't find balanced braces
    return null;
}
/**
 * Safe parse with extra cleaning attempts.
 */
function safeParseJsonFromAiResponse(rawContent) {
    if (!rawContent)
        return null;
    // Quick strip of code fences
    let cleaned = rawContent.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    // Try direct parse first (fast path)
    try {
        return JSON.parse(cleaned);
    }
    catch (e) {
        // Try extracting first balanced JSON object
        const extracted = extractFirstJsonObject(rawContent);
        if (extracted) {
            try {
                return JSON.parse(extracted);
            }
            catch (err) {
                // as a last resort try a loose regex fallback to extract {...}
                const regexMatch = rawContent.match(/\{[\s\S]*\}/);
                if (regexMatch) {
                    try {
                        return JSON.parse(regexMatch[0]);
                    }
                    catch (err2) {
                        // Give up below
                        return null;
                    }
                }
                return null;
            }
        }
        // No extraction possible
        return null;
    }
}
router.post("/", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const filePath = req.file.path;
        const content = fs_1.default.readFileSync(filePath, "utf-8");
        const hash = fileHash(content);
        // Return cached report if file was analyzed before
        if (reportCache.has(hash)) {
            res.json({ success: true, report: reportCache.get(hash), cached: true });
            return;
        }
        // Chunk content instead of slicing 5000 chars
        const chunks = chunkContent(content, 20000);
        const limitedContent = chunks.slice(0, 6).join("\n---CHUNK SPLIT---\n");
        const aiPrompt = `
You are an AI assistant specialized in API analysis. Your task is to analyze the provided file content, which is expected to be from a .har, .json, or .log file containing API-related data.
**Important:** Return only JSON—either the full report or an error object—with no additional text.
**Instructions:**

1. **Check Content Validity:**  
   - If the content does not appear to be API-related (e.g., it lacks HTTP methods, endpoints, or is in an unrecognized format), return a JSON object with the structure:  
     { "error": "The file content does not contain valid API information. Please upload a HAR file, JSON with API data, or a log file with API calls." }

2. **If Content is Valid:**  
   - Extract the following:  
     - Endpoints with methods, paths, status, etc. (matching EndpointItem).  
     - Generate an OpenAPI spec (matching SpecsApiDocs).  
     - Identify sequence flows (matching FlowItem).  
     - Provide security insights (matching SecurityIssue).  
   - Return the output strictly as a JSON object that conforms to the APIWatchdogReport interface defined below.

3. **Normalization notes:**
   - Replace every ID-like segment with {id}. If multiple id-like segments exist, replace each with {id} (e.g., /a/123/b/456 -> /a/{id}/b/{id}).
   - Preserve query parameters; do not convert them to path params.
   - For mixed-case path inconsistencies, choose a consistent lowercase form for spec paths but include a security.issues entry warning about mixed-case paths.

**Full TypeScript Interface Definition for APIWatchdogReport:**

\`\`\`typescript
/**
 * APIWatchdogReport model for backend (Express + TypeScript)
 * Defines the structure of the JSON payload sent to the client.
 */

/**
 * Top-level APIWatchdog report
 */
export interface APIWatchdogReport {
  meta: ReportMeta;
  endpoints: EndpointsSection;
  spec: SpecsApiDocs;
  flows: FlowsSection;
  security: SecuritySection;
}

/**
 * Overall report metadata
 */
export interface ReportMeta {
  title: string;        // e.g. "APIWatchdog Analysis Report"
  heading: string;      // e.g. "Comprehensive API Analysis"
  description: string;  // High-level summary
  stats: ReportStats;   // counts for quick overview
}

export interface ReportStats {
  totalEndpoints: number;
  totalFlows: number;
  totalIssues: number;
}

/**
 * Common header for each report section
 */
export interface SectionHeader {
  title: string;        // e.g. "Discovered Endpoints"
  heading: string;      // e.g. "1. Discover Endpoints"
  description: string;  // Short note about this section
}

/**
 * 1. Endpoint Discovery section
 */
export interface EndpointsSection extends SectionHeader {
  items: EndpointItem[];
}

/**
 * Represents a single API endpoint
 */
export interface EndpointItem {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';          // HTTP method, e.g. "GET"
  path: string;              // URL path, e.g. "/users/:id"
  status: 'success' | 'warning' | 'error';          // e.g. "✅", "❗Missing schema"
  description?: string;      // Optional descriptive text
  usageFrequency?: number;   // Optional usage count
  requestExample?: object;
  responseExample?: object;
}

/**
 * 2. OpenAPI spec generation section
 */
export interface SpecsApiDocs {
  title: string;
  description: string;
  version: string;
  endpoints: SpecsApiEndpoint[];
  specScript:string;
}

export interface SpecsApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: SpecsApiParameter[];
  responses?: SpecsApiResponse[];
}

export interface SpecsApiParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface SpecsApiResponse {
  code: number;
  description: string;
}

/**
 * 3. Sequence diagram flows section
 */
export interface FlowsSection extends SectionHeader {
  availableFlows?: FlowOverview[];
  flows: FlowItem[];
}

export interface FlowOverview {
  id: string;
  title: string;
}

/**
 * Single sequence flow item
 */
export interface FlowItem {
  id: string;            // Unique flow ID
  title: string;         // e.g. "User Login Flow"
  description?: string;  // Optional summary
  mermaidScript: string; // Raw Mermaid script
}

/**
 * 4. Security insights section
 */
export interface SecuritySection extends SectionHeader {
  issues: SecurityIssue[];
}

/**
 * Single security issue
 */
export interface SecurityIssue {
  id: string;            // Unique issue ID
  title: string;         // e.g. "No rate limiting"
  description: string;   // Explanation of issue
  endpoint: string;      // Affected endpoint path
  severity: 'High' | 'Medium' | 'Low';
  severityBadge?: string;   // e.g. "❌", "⚠️"
  recommendation: string;
  remediationSteps:string[];
  tag:string;
  resourceLink?: string;     // Link to best-practice or OWASP doc
}
\`\`\`

**Content to Analyze (chunked, up to 6 chunks):**
\`\`\`
${limitedContent}
\`\`\`


`;
        // send request to OpenRouter / model
        const aiResponse = yield axios_1.default.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "deepseek/deepseek-chat-v3.1:free",
            messages: [{ role: "user", content: aiPrompt }],
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            timeout: 120000, // 120s in case the model takes time
        });
        // Pull possible locations for the model text
        const choices = (_a = aiResponse === null || aiResponse === void 0 ? void 0 : aiResponse.data) === null || _a === void 0 ? void 0 : _a.choices;
        if (!choices || choices.length === 0) {
            console.error("AI response has no choices:", aiResponse === null || aiResponse === void 0 ? void 0 : aiResponse.data);
            res.status(502).json({ error: "Empty AI response" });
            return;
        }
        // Try different places the model might place the content
        let rawContent;
        // openrouter style: choices[0].message.content
        rawContent = (_d = (_c = (_b = choices[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : (_g = (_f = (_e = choices[0]) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.toString();
        // fallback: choices[0].text
        if (!rawContent && ((_h = choices[0]) === null || _h === void 0 ? void 0 : _h.text))
            rawContent = choices[0].text;
        // fallback: choices[0].delta?.content (streaming style)
        if (!rawContent && ((_k = (_j = choices[0]) === null || _j === void 0 ? void 0 : _j.delta) === null || _k === void 0 ? void 0 : _k.content))
            rawContent = choices[0].delta.content;
        // If still not present, as a last fallback stringify the entire response body
        if (!rawContent)
            rawContent = JSON.stringify(aiResponse.data);
        // Try to sanitize and parse JSON robustly
        const parsedReport = safeParseJsonFromAiResponse(rawContent);
        if (!parsedReport) {
            // Write a small debug snippet to disk for inspection (do not dump huge outputs)
            try {
                const dbgPath = path_1.default.join(process.cwd(), "ai_response_debug_snippet.txt");
                const snippet = rawContent.slice(0, 20000); // first 20k chars
                fs_1.default.writeFileSync(dbgPath, snippet, { encoding: "utf-8" });
                console.error(`Failed to parse JSON from AI response. Debug snippet written to ${dbgPath}`);
            }
            catch (fsErr) {
                console.error("Failed to write debug snippet:", fsErr);
            }
            console.error("❌ Failed to parse AI JSON. Raw content preview:", rawContent.slice(0, 500));
            res.status(500).json({ error: "Invalid AI response - unable to extract JSON. A debug snippet was saved on server." });
            return;
        }
        // At this point parsedReport is an object
        lastReport = parsedReport;
        addToCache(hash, parsedReport);
        res.json({ success: true, report: parsedReport });
    }
    catch (err) {
        console.error("Processing failed:", (_l = err === null || err === void 0 ? void 0 : err.message) !== null && _l !== void 0 ? _l : err);
        res.status(500).json({ error: "Processing failed", detail: (_m = err === null || err === void 0 ? void 0 : err.message) !== null && _m !== void 0 ? _m : String(err) });
    }
    finally {
        // optionally remove uploaded file to avoid disk growth
        try {
            if (req.file && req.file.path) {
                fs_1.default.unlink(req.file.path, () => { });
            }
        }
        catch (e) {
            // ignore
        }
    }
}));
exports.default = router;
// import express, { Request, Response } from "express";
// import multer from "multer";
// import fs from "fs";
// import axios from "axios";
// import dotenv from "dotenv";
// import crypto from "crypto";
// dotenv.config({ path: "./.env" });
// const apiKey = process.env.OPENROUTER_API_KEY;
// const router = express.Router();
// const upload = multer({ dest: "uploads/" });
// // cache keyed by file hash
// const reportCache: Map<string, any> = new Map();
// const MAX_CACHE_SIZE = 50;
// let lastReport: any = null;
// function addToCache(hash: string, report: any) {
//   if (reportCache.size >= MAX_CACHE_SIZE) {
//     // delete the oldest inserted item (FIFO)
//     const firstKey = reportCache.keys().next().value as string | undefined;
//     if (firstKey !== undefined) {
//       reportCache.delete(firstKey);
//     }
//   }
//   reportCache.set(hash, report);
// }
// export function getLastReport() {
//   return lastReport;
// }
// // helper: compute SHA256 of file content
// function fileHash(content: string) {
//   return crypto.createHash("sha256").update(content).digest("hex");
// }
// // helper: chunk large content
// function chunkContent(content: string, size = 4000): string[] {
//   const chunks: string[] = [];
//   for (let i = 0; i < content.length; i += size) {
//     chunks.push(content.slice(i, i + size));
//   }
//   return chunks;
// }
// router.post("/", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
//   try {
//     if (!req.file) {
//       res.status(400).json({ error: "No file uploaded" });
//       return;
//     }
//     const filePath = req.file.path;
//     const content = fs.readFileSync(filePath, "utf-8");
//     const hash = fileHash(content);
//     // 🔑 Return cached report if file was analyzed before
//     if (reportCache.has(hash)) {
//   res.json({ success: true, report: reportCache.get(hash), cached: true });
//   return;
// }
//     // 🔑 Chunk content instead of slicing 5000 chars
//     const chunks = chunkContent(content, 20000);
//     const limitedContent = chunks.slice(0, 6).join("\n---CHUNK SPLIT---\n"); 
//     // (send first 2 chunks, or implement loop to merge AI results if needed)
//        const aiPrompt = `
// You are an AI assistant specialized in API analysis. Your task is to analyze the provided file content, which is expected to be from a .har, .json, or .log file containing API-related data.
// **Important:** Return only JSON—either the full report or an error object—with no additional text.
// **Instructions:**
// 1. **Check Content Validity:**  
//    - If the content does not appear to be API-related (e.g., it lacks HTTP methods, endpoints, or is in an unrecognized format), return a JSON object with the structure:  
//      { "error": "The file content does not contain valid API information. Please upload a HAR file, JSON with API data, or a log file with API calls." }
// 2. **If Content is Valid:**  
//    - Extract the following:  
//      - Endpoints with methods, paths, status, etc. (matching EndpointItem).  
//      - Generate an OpenAPI spec (matching SpecsApiDocs).  
//      - Identify sequence flows (matching FlowItem).  
//      - Provide security insights (matching SecurityIssue).  
//    - Return the output strictly as a JSON object that conforms to the APIWatchdogReport interface defined below.
// 3. **Normalization notes:**
//    - Replace every ID-like segment with {id}. If multiple id-like segments exist, replace each with {id} (e.g., /a/123/b/456 -> /a/{id}/b/{id}).
//    - Preserve query parameters; do not convert them to path params.
//    - For mixed-case path inconsistencies, choose a consistent lowercase form for spec paths but include a security.issues entry warning about mixed-case paths.
// **Full TypeScript Interface Definition for APIWatchdogReport:**
// \`\`\`typescript
// /**
//  * APIWatchdogReport model for backend (Express + TypeScript)
//  * Defines the structure of the JSON payload sent to the client.
//  */
// /**
//  * Top-level APIWatchdog report
//  */
// export interface APIWatchdogReport {
//   meta: ReportMeta;
//   endpoints: EndpointsSection;
//   spec: SpecsApiDocs;
//   flows: FlowsSection;
//   security: SecuritySection;
// }
// /**
//  * Overall report metadata
//  */
// export interface ReportMeta {
//   title: string;        // e.g. "APIWatchdog Analysis Report"
//   heading: string;      // e.g. "Comprehensive API Analysis"
//   description: string;  // High-level summary
//   stats: ReportStats;   // counts for quick overview
// }
// export interface ReportStats {
//   totalEndpoints: number;
//   totalFlows: number;
//   totalIssues: number;
// }
// /**
//  * Common header for each report section
//  */
// export interface SectionHeader {
//   title: string;        // e.g. "Discovered Endpoints"
//   heading: string;      // e.g. "1. Discover Endpoints"
//   description: string;  // Short note about this section
// }
// /**
//  * 1. Endpoint Discovery section
//  */
// export interface EndpointsSection extends SectionHeader {
//   items: EndpointItem[];
// }
// /**
//  * Represents a single API endpoint
//  */
// export interface EndpointItem {
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';          // HTTP method, e.g. "GET"
//   path: string;              // URL path, e.g. "/users/:id"
//   status: 'success' | 'warning' | 'error';          // e.g. "✅", "❗Missing schema"
//   description?: string;      // Optional descriptive text
//   usageFrequency?: number;   // Optional usage count
//   requestExample?: object;
//   responseExample?: object;
// }
// /**
//  * 2. OpenAPI spec generation section
//  */
// export interface SpecsApiDocs {
//   title: string;
//   description: string;
//   version: string;
//   endpoints: SpecsApiEndpoint[];
//   specScript:string;
// }
// export interface SpecsApiEndpoint {
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE';
//   path: string;
//   description: string;
//   parameters?: SpecsApiParameter[];
//   responses?: SpecsApiResponse[];
// }
// export interface SpecsApiParameter {
//   name: string;
//   type: string;
//   required?: boolean;
//   description?: string;
// }
// export interface SpecsApiResponse {
//   code: number;
//   description: string;
// }
// /**
//  * 3. Sequence diagram flows section
//  */
// export interface FlowsSection extends SectionHeader {
//   availableFlows?: FlowOverview[];
//   flows: FlowItem[];
// }
// export interface FlowOverview {
//   id: string;
//   title: string;
// }
// /**
//  * Single sequence flow item
//  */
// export interface FlowItem {
//   id: string;            // Unique flow ID
//   title: string;         // e.g. "User Login Flow"
//   description?: string;  // Optional summary
//   mermaidScript: string; // Raw Mermaid script
// }
// /**
//  * 4. Security insights section
//  */
// export interface SecuritySection extends SectionHeader {
//   issues: SecurityIssue[];
// }
// /**
//  * Single security issue
//  */
// export interface SecurityIssue {
//   id: string;            // Unique issue ID
//   title: string;         // e.g. "No rate limiting"
//   description: string;   // Explanation of issue
//   endpoint: string;      // Affected endpoint path
//   severity: 'High' | 'Medium' | 'Low';
//   severityBadge?: string;   // e.g. "❌", "⚠️"
//   recommendation: string;
//   remediationSteps:string[];
//   tag:string;
//   resourceLink?: string;     // Link to best-practice or OWASP doc
// }
// \`\`\`
// **Content to Analyze (chunked, up to 6 chunks):**
// \`\`\`
// ${limitedContent}
// \`\`\`
// `;
//     const aiResponse = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "deepseek/deepseek-chat-v3.1:free",
//         messages: [{ role: "user", content: aiPrompt }],
//         temperature: 0,   // deterministic
//         top_p: 1,
//         frequency_penalty: 0,
//         presence_penalty: 0,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     let parsedReport: any;
//     try {
//       let rawContent = aiResponse.data.choices[0].message.content;
//       rawContent = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
//       const startIdx = rawContent.indexOf("{");
//       const endIdx = rawContent.lastIndexOf("}");
//       if (startIdx !== -1 && endIdx !== -1) {
//         rawContent = rawContent.slice(startIdx, endIdx + 1);
//       }
//       parsedReport = JSON.parse(rawContent);
//     } catch (err) {
//       console.error("❌ Failed to parse AI JSON:", err);
//       parsedReport = { error: "Invalid AI response" };
//     }
//     if (parsedReport.error) {
//       res.status(400).json({ error: parsedReport.error });
//     } else {
//       lastReport = parsedReport;
//      addToCache(hash, parsedReport);
//       res.json({ success: true, report: parsedReport });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Processing failed" });
//   }
// });
// export default router;
