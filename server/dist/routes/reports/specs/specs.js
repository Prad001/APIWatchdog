"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const endpoint_1 = require("../endpoint/endpoint");
const js_yaml_1 = __importDefault(require("js-yaml"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
/**
 * Builds a minimal OpenAPI object from a list of endpoints
 */
function generateOpenApi(endpoints) {
    const paths = {};
    endpoints.forEach(({ method, path }) => {
        if (!paths[path])
            paths[path] = {};
        paths[path][method.toLowerCase()] = {
            summary: `Auto-generated stub for ${method} ${path}`,
            responses: { '200': { description: 'Success' } }
        };
    });
    return {
        openapi: '3.0.0',
        info: {
            title: 'APIWatchdog Generated API',
            version: '1.0.0',
            description: 'OpenAPI spec generated from your uploaded file'
        },
        paths
    };
}
/**
 * POST /api/generate-spec
 * Accepts uploaded API file, returns full SpecSection
 */
router.post('/generate-spec', upload.single('apiFile'), (req, res, next) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
    }
    try {
        // parse raw endpoints
        const raw = (0, endpoint_1.extractRawEndpoints)(req.file.buffer);
        const endpoints = raw.map(({ method, path }) => ({ method, path }));
        // generate OpenAPI object and YAML
        const openapiObj = generateOpenApi(endpoints);
        const rawYaml = js_yaml_1.default.dump(openapiObj);
        // construct SpecSection per updated interface
        const specSection = {
            title: 'Generated OpenAPI Specification',
            heading: '2. Generate Specs',
            description: 'Auto‑generated OpenAPI 3.0 spec for your API.',
            openapi: openapiObj,
            rawYaml,
            download: {
                jsonUrl: '/downloads/spec.json',
                yamlUrl: '/downloads/spec.yaml'
            }
        };
        res.json(specSection);
    }
    catch (err) {
        console.error('Spec generation error:', err);
        next(err);
    }
});
exports.default = router;
