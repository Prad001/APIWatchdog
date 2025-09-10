// models/api-watchdog-report.ts

/** Represents the full AIWatchdog analysis report */
export interface APIWatchdogReport {
  /** Overall report metadata */
  meta: {
    title: string;        // e.g. "APIWatchdog Analysis Report"
    heading: string;      // e.g. "Comprehensive API Analysis"
    description: string;  // High‑level summary
  };
  
  /** 1. Endpoint Discovery section */
  endpoints: EndpointsSection;
  
  /** 2. OpenAPI spec generation section */
  spec: SpecSection;
  
  /** 3. Sequence diagram flows section */
  flows: FlowsSection;
  
  /** 4. Security insights section */
  security: SecuritySection;
}

/** Common header for each section */
interface SectionHeader {
  title: string;       // e.g. "Discovered Endpoints"
  heading: string;     // e.g. "1. Discover Endpoints"
  description: string; // Short note about this section
}

export interface EndpointsSection extends SectionHeader {
  items: EndpointItem[];
}

export interface EndpointItem {
  method: string;      // HTTP method, e.g. "GET"
  path: string;        // URL path, e.g. "/users/:id"
  description?: string;// Optional human‑friendly label
}

export interface SpecSection extends SectionHeader {
  openapi: unknown;    // The full OpenAPI JSON/YAML object
}

export interface FlowsSection extends SectionHeader {
  flows: FlowItem[];
}

export interface FlowItem {
  id: string;           // Unique flow ID
  title: string;        // e.g. "User Login Flow"
  description?: string; // Short flow summary
  mermaidScript: string;// The raw Mermaid script
  imageUrl: string;     // URL to the rendered diagram image
}

export interface SecuritySection extends SectionHeader {
  issues: SecurityIssue[];
}

export interface SecurityIssue {
  id: string;           // Unique issue ID
  title: string;        // e.g. "No rate limiting"
  description: string;  // What’s wrong
  endpoint: string;     // Affected endpoint path
  severity: 'High'|'Medium'|'Low';
  recommendation: string;
}
