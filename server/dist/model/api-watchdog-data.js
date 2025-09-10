"use strict";
// {
// "meta": {
// "title": "APIWatchdog Analysis Report",
// "heading": "Comprehensive API Analysis",
// "description": "Detailed analysis of API endpoints, specifications, flows, and security insights",
// "stats": {
// "totalEndpoints": 6,
// "totalFlows": 2,
// "totalIssues": 3
// }
// },
// "endpoints": {
// "title": "Discovered Endpoints",
// "heading": "1. Discover Endpoints",
// "description": "List of all identified API endpoints with their status and metadata",
// "items": [
// {
// "method": "GET",
// "path": "/users/:id",
// "status": "success",
// "description": "Retrieve user details by ID",
// "usageFrequency": 1500,
// "requestExample": { "id": 123 },
// "responseExample": { "id": 123, "name": "John Doe", "email": "john@example.com" }
// },
// {
// "method": "POST",
// "path": "/users",
// "status": "warning",
// "description": "Create new user",
// "usageFrequency": 800,
// "requestExample": { "name": "Jane Smith", "email": "jane@example.com" },
// "responseExample": { "id": 456, "name": "Jane Smith", "email": "jane@example.com" }
// },
// {
// "method": "PUT",
// "path": "/users/:id",
// "status": "success",
// "description": "Update user information",
// "usageFrequency": 600,
// "requestExample": { "name": "Updated Name", "email": "updated@example.com" },
// "responseExample": { "id": 123, "name": "Updated Name", "email": "updated@example.com" }
// },
// {
// "method": "DELETE",
// "path": "/users/:id",
// "status": "error",
// "description": "Delete user account",
// "usageFrequency": 200,
// "requestExample": { "id": 123 },
// "responseExample": { "message": "User deleted successfully" }
// },
// {
// "method": "GET",
// "path": "/products",
// "status": "success",
// "description": "List all products",
// "usageFrequency": 2500,
// "requestExample": { "page": 1, "limit": 10 },
// "responseExample": { "products": [], "total": 100, "page": 1 }
// },
// {
// "method": "POST",
// "path": "/auth/login",
// "status": "warning",
// "description": "User authentication",
// "usageFrequency": 1200,
// "requestExample": { "email": "user@example.com", "password": "********" },
// "responseExample": { "token": "jwt_token_here", "expiresIn": 3600 }
// }
// ]
// },
// "spec": {
// "title": "API Specification",
// "description": "OpenAPI-compliant specification for discovered endpoints",
// "version": "1.0.0",
// "specScript": "openapi: 3.0.0\ninfo:\n title: API Specification\n description: OpenAPI-compliant specification for the API\n version: 1.0.0\npaths:\n /users/{id}:\n get:\n summary: Retrieve user by ID\n parameters:\n - name: id\n in: path\n required: true\n schema:\n type: integer\n responses:\n '200':\n description: User details retrieved successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n email:\n type: string\n '404':\n description: User not found\n put:\n summary: Update user information\n parameters:\n - name: id\n in: path\n required: true\n schema:\n type: integer\n requestBody:\n required: true\n content:\n application/json:\n schema:\n type: object\n properties:\n name:\n type: string\n email:\n type: string\n responses:\n '200':\n description: User updated successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n email:\n type: string\n delete:\n summary: Delete user account\n parameters:\n - name: id\n in: path\n required: true\n schema:\n type: integer\n responses:\n '200':\n description: User deleted successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n message:\n type: string\n /users:\n post:\n summary: Create a new user\n requestBody:\n required: true\n content:\n application/json:\n schema:\n type: object\n properties:\n name:\n type: string\n email:\n type: string\n responses:\n '201':\n description: User created successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n email:\n type: string\n /products:\n get:\n summary: List all products\n parameters:\n - name: page\n in: query\n required: false\n schema:\n type: integer\n - name: limit\n in: query\n required: false\n schema:\n type: integer\n responses:\n '200':\n description: Products retrieved successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n products:\n type: array\n items:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n total:\n type: integer\n page:\n type: integer\n /auth/login:\n post:\n summary: User authentication\n requestBody:\n required: true\n content:\n application/json:\n schema:\n type: object\n properties:\n email:\n type: string\n password:\n type: string\n responses:\n '200':\n description: Login successful\n content:\n application/json:\n schema:\n type: object\n properties:\n token:\n type: string\n expiresIn:\n type: integer\n '401':\n description: Unauthorized",
// "endpoints": [
// {
// "method": "GET",
// "path": "/users/{id}",
// "description": "Retrieve user details by ID",
// "parameters": [
// {
// "name": "id",
// "type": "integer",// {
// "meta": {
// "title": "APIWatchdog Analysis Report",
// "heading": "Comprehensive API Analysis",
// "description": "Detailed analysis of API endpoints, specifications, flows, and security insights",
// "stats": {
// "totalEndpoints": 6,
// "totalFlows": 2,
// "totalIssues": 3
// }
// },
// "endpoints": {
// "title": "Discovered Endpoints",
// "heading": "1. Discover Endpoints",
// "description": "List of all identified API endpoints with their status and metadata",
// "items": [
// {
// "method": "GET",
// "path": "/users/:id",
// "status": "success",
// "description": "Retrieve user details by ID",
// "usageFrequency": 1500,
// "requestExample": { "id": 123 },
// "responseExample": { "id": 123, "name": "John Doe", "email": "john@example.com" }
// },
// {
// "method": "POST",
// "path": "/users",
// "status": "warning",
// "description": "Create new user",
// "usageFrequency": 800,
// "requestExample": { "name": "Jane Smith", "email": "jane@example.com" },
// "responseExample": { "id": 456, "name": "Jane Smith", "email": "jane@example.com" }
// },
// {
// "method": "PUT",
// "path": "/users/:id",
// "status": "success",
// "description": "Update user information",
// "usageFrequency": 600,
// "requestExample": { "name": "Updated Name", "email": "updated@example.com" },
// "responseExample": { "id": 123, "name": "Updated Name", "email": "updated@example.com" }
// },
// {
// "method": "DELETE",
// "path": "/users/:id",
// "status": "error",
// "description": "Delete user account",
// "usageFrequency": 200,
// "requestExample": { "id": 123 },
// "responseExample": { "message": "User deleted successfully" }
// },
// {
// "method": "GET",
// "path": "/products",
// "status": "success",
// "description": "List all products",
// "usageFrequency": 2500,
// "requestExample": { "page": 1, "limit": 10 },
// "responseExample": { "products": [], "total": 100, "page": 1 }
// },
// {
// "method": "POST",
// "path": "/auth/login",
// "status": "warning",
// "description": "User authentication",
// "usageFrequency": 1200,
// "requestExample": { "email": "user@example.com", "password": "********" },
// "responseExample": { "token": "jwt_token_here", "expiresIn": 3600 }
// }
// ]
// },
// "spec": {
// "title": "API Specification",
// "description": "OpenAPI-compliant specification for discovered endpoints",
// "version": "1.0.0",
// "specScript": "openapi: 3.0.0\ninfo:\n title: API Specification\n description: OpenAPI-compliant specification for the API\n version: 1.0.0\npaths:\n /users/{id}:\n get:\n summary: Retrieve user by ID\n parameters:\n - name: id\n in: path\n required: true\n schema:\n type: integer\n responses:\n '200':\n description: User details retrieved successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n email:\n type: string\n '404':\n description: User not found\n put:\n summary: Update user information\n parameters:\n - name: id\n in: path\n required: true\n schema:\n type: integer\n requestBody:\n required: true\n content:\n application/json:\n schema:\n type: object\n properties:\n name:\n type: string\n email:\n type: string\n responses:\n '200':\n description: User updated successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n email:\n type: string\n delete:\n summary: Delete user account\n parameters:\n - name: id\n in: path\n required: true\n schema:\n type: integer\n responses:\n '200':\n description: User deleted successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n message:\n type: string\n /users:\n post:\n summary: Create a new user\n requestBody:\n required: true\n content:\n application/json:\n schema:\n type: object\n properties:\n name:\n type: string\n email:\n type: string\n responses:\n '201':\n description: User created successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n email:\n type: string\n /products:\n get:\n summary: List all products\n parameters:\n - name: page\n in: query\n required: false\n schema:\n type: integer\n - name: limit\n in: query\n required: false\n schema:\n type: integer\n responses:\n '200':\n description: Products retrieved successfully\n content:\n application/json:\n schema:\n type: object\n properties:\n products:\n type: array\n items:\n type: object\n properties:\n id:\n type: integer\n name:\n type: string\n total:\n type: integer\n page:\n type: integer\n /auth/login:\n post:\n summary: User authentication\n requestBody:\n required: true\n content:\n application/json:\n schema:\n type: object\n properties:\n email:\n type: string\n password:\n type: string\n responses:\n '200':\n description: Login successful\n content:\n application/json:\n schema:\n type: object\n properties:\n token:\n type: string\n expiresIn:\n type: integer\n '401':\n description: Unauthorized",
// "endpoints": [
// {
// "method": "GET",
// "path": "/users/{id}",
// "description": "Retrieve user details by ID",
// "parameters": [
// {
// "name": "id",
// "type": "integer",
// "required": true,
// "description": "User identifier"
// }
// ],
// "responses": [
// {
// "code": 200,
// "description": "User details retrieved successfully"
// },
// {
// "code": 404,
// "description": "User not found"
// }
// ]
// }
// ]
// },
// "flows": {
// "title": "API Flows",
// "heading": "3. Sequence Flows",
// "description": "Visual representation of API interaction sequences",
// "availableFlows": [
// {
// "id": "user-registration",
// "title": "User Registration Flow"
// },
// {
// "id": "order-processing",
// "title": "Order Processing Flow"
// }
// ],
// "flows": [
// {
// "id": "user-registration",
// "title": "User Registration Flow",
// "description": "Complete user registration and onboarding process",
// "mermaidScript": "sequenceDiagram\n participant User\n participant Frontend\n participant Backend\n participant Database\n User->>Frontend: Submit registration form\n Frontend->>Backend: POST /users\n Backend->>Database: Create user record\n Database-->>Backend: User created\n Backend-->>Frontend: 201 Created\n Frontend-->>User: Registration successful",
// }
// ]
// },
// "security": {
// "title": "Security Insights",
// "heading": "4. Security Analysis",
// "description": "Identified security vulnerabilities and recommendations",
// "issues": [
// {
// "id": "sec-001",
// "title": "No rate limiting",
// "description": "Endpoint lacks rate limiting protection against brute force attacks",
// "endpoint": "/auth/login",
// "severity": "High",
// "severityBadge": "❌",
// "recommendation": "Implement rate limiting with exponential backoff",
// "remediationSteps": [
// "Add rate limiting middleware",
// "Configure limits per IP address",
// "Implement exponential backoff strategy"
// ],
// "tag": "authentication",
// "resourceLink": "https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks"
// },
// {
// "id": "sec-002",
// "title": "Missing authentication",
// "description": "Endpoint does not require authentication for sensitive operations",
// "endpoint": "/users/:id",
// "severity": "Medium",
// "severityBadge": "⚠️",
// "recommendation": "Add JWT token validation middleware",
// "remediationSteps": [
// "Require Authorization header",
// "Validate JWT tokens",
// "Check user permissions"
// ],
// "tag": "authorization",
// "resourceLink": "https://auth0.com/docs/secure/tokens/json-web-tokens"
// },
// {
// "id": "sec-003",
// "title": "SQL injection vulnerability",
// "description": "User input is directly concatenated into SQL queries",
// "endpoint": "/products",
// "severity": "High",
// "severityBadge": "❌",
// "recommendation": "Use parameterized queries or ORM",
// "remediationSteps": [
// "Replace string concatenation with parameterized queries",
// "Use prepared statements",
// "Implement input validation"
// ],
// "tag": "injection",
// "resourceLink": "https://owasp.org/www-community/attacks/SQL_Injection"
// }
// ]
// }
// }
// "required": true,
// "description": "User identifier"
// }
// ],
// "responses": [
// {
// "code": 200,
// "description": "User details retrieved successfully"
// },
// {
// "code": 404,
// "description": "User not found"
// }
// ]
// }
// ]
// },
// "flows": {
// "title": "API Flows",
// "heading": "3. Sequence Flows",
// "description": "Visual representation of API interaction sequences",
// "availableFlows": [
// {
// "id": "user-registration",
// "title": "User Registration Flow"
// },
// {
// "id": "order-processing",
// "title": "Order Processing Flow"
// }
// ],
// "flows": [
// {
// "id": "user-registration",
// "title": "User Registration Flow",
// "description": "Complete user registration and onboarding process",
// "mermaidScript": "sequenceDiagram\n participant User\n participant Frontend\n participant Backend\n participant Database\n User->>Frontend: Submit registration form\n Frontend->>Backend: POST /users\n Backend->>Database: Create user record\n Database-->>Backend: User created\n Backend-->>Frontend: 201 Created\n Frontend-->>User: Registration successful",
// }
// ]
// },
// "security": {
// "title": "Security Insights",
// "heading": "4. Security Analysis",
// "description": "Identified security vulnerabilities and recommendations",
// "issues": [
// {
// "id": "sec-001",
// "title": "No rate limiting",
// "description": "Endpoint lacks rate limiting protection against brute force attacks",
// "endpoint": "/auth/login",
// "severity": "High",
// "severityBadge": "❌",
// "recommendation": "Implement rate limiting with exponential backoff",
// "remediationSteps": [
// "Add rate limiting middleware",
// "Configure limits per IP address",
// "Implement exponential backoff strategy"
// ],
// "tag": "authentication",
// "resourceLink": "https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks"
// },
// {
// "id": "sec-002",
// "title": "Missing authentication",
// "description": "Endpoint does not require authentication for sensitive operations",
// "endpoint": "/users/:id",
// "severity": "Medium",
// "severityBadge": "⚠️",
// "recommendation": "Add JWT token validation middleware",
// "remediationSteps": [
// "Require Authorization header",
// "Validate JWT tokens",
// "Check user permissions"
// ],
// "tag": "authorization",
// "resourceLink": "https://auth0.com/docs/secure/tokens/json-web-tokens"
// },
// {
// "id": "sec-003",
// "title": "SQL injection vulnerability",
// "description": "User input is directly concatenated into SQL queries",
// "endpoint": "/products",
// "severity": "High",
// "severityBadge": "❌",
// "recommendation": "Use parameterized queries or ORM",
// "remediationSteps": [
// "Replace string concatenation with parameterized queries",
// "Use prepared statements",
// "Implement input validation"
// ],
// "tag": "injection",
// "resourceLink": "https://owasp.org/www-community/attacks/SQL_Injection"
// }
// ]
// }
// }
