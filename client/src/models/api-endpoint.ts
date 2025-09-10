// src/app/types/api-endpoint.ts
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: 'success' | 'warning' | 'error';
  description: string;
  usageFrequency: number;
  sampleRequest?: object;
  sampleResponse?: object;
}
