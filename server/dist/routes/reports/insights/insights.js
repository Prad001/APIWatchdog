"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractInsights = extractInsights;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * Utility to extract security issues from a full report
 */
function extractInsights(report) {
    var _a;
    return ((_a = report.security) === null || _a === void 0 ? void 0 : _a.issues) || [];
}
/**
 * POST /api/insights
 * Accepts full AI-generated APIWatchdogReport JSON in request body
 * Returns only the SecuritySection to the client
 */
router.post('/insights', express_1.default.json(), (req, res, next) => {
    var _a;
    try {
        const report = req.body;
        if (!((_a = report === null || report === void 0 ? void 0 : report.security) === null || _a === void 0 ? void 0 : _a.issues)) {
            res.status(400).json({ error: 'Invalid report: security section missing.' });
            return;
        }
        // Optionally enforce fallback/defaults for newly added fields (if needed)
        const issuesWithDefaults = report.security.issues.map(issue => (Object.assign(Object.assign({}, issue), { severityBadge: issue.severityBadge || getSeverityBadge(issue.severity), resourceLink: issue.resourceLink })));
        const securitySection = Object.assign(Object.assign({}, report.security), { issues: issuesWithDefaults });
        res.json(securitySection);
    }
    catch (err) {
        console.error('Error extracting security insights:', err);
        next(err);
    }
});
/**
 * Optional helper to generate badge emoji based on severity
 */
function getSeverityBadge(severity) {
    switch (severity) {
        case 'High': return '❌';
        case 'Medium': return '⚠️';
        case 'Low': return '✅';
        default: return '';
    }
}
exports.default = router;
