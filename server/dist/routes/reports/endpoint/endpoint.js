"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRawEndpoints = extractRawEndpoints;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const url_1 = require("url");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
/**
 * Reusable: parse a HAR or Postman JSON buffer into basic endpoint data
 */
function extractRawEndpoints(buffer) {
    var _a;
    const text = buffer.toString('utf8');
    const json = JSON.parse(text);
    const results = [];
    if ((_a = json.log) === null || _a === void 0 ? void 0 : _a.entries) {
        for (const entry of json.log.entries) {
            const { method, url: rawUrl } = entry.request;
            const url = new url_1.URL(rawUrl);
            results.push({ method, path: url.pathname });
        }
    }
    else if (json.item) {
        function walk(item) {
            if (item.request) {
                const m = item.request.method;
                const raw = typeof item.request.url === 'string' ? item.request.url : item.request.url.raw;
                try {
                    const url = new url_1.URL(raw);
                    results.push({ method: m, path: url.pathname });
                }
                catch (_a) { }
            }
            if (Array.isArray(item.item))
                item.item.forEach(walk);
        }
        walk(json);
    }
    else {
        throw new Error('Unrecognized file format');
    }
    // dedupe & sort
    return Array.from(new Map(results.map(e => [`${e.method}:${e.path}`, e])).values()).sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
}
// Discovery route
router.post('/discover', upload.single('apiFile'), (req, res, next) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
    }
    try {
        const raw = extractRawEndpoints(req.file.buffer);
        const items = raw.map(({ method, path }) => ({
            method,
            path,
            status: '✅',
            description: '',
            usageFrequency: undefined,
            requestExample: undefined,
            responseExample: undefined
        }));
        res.json({ items });
    }
    catch (err) {
        console.error('Discovery error:', err);
        next(err);
    }
});
exports.default = router;
