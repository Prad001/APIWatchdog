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
  status: 'success' | 'warning' | 'error';          // e.g. "✅", "❗️Missing schema"
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
