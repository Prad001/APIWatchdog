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
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const router = express_1.default.Router();
/**
 * Generate a PNG from Mermaid script and save to server
 */
function generateMermaidImage(script, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputDir = path_1.default.join(__dirname, '../../public/diagrams');
        if (!fs_1.default.existsSync(outputDir))
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        const browser = yield puppeteer_1.default.launch({ headless: true });
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
        const html = `
    <html>
      <head>
        <style>body { margin: 0; }</style>
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
          mermaid.initialize({ startOnLoad: true });
        </script>
      </head>
      <body>
        <div class="mermaid">${script}</div>
      </body>
    </html>`;
        yield page.setContent(html, { waitUntil: 'networkidle0' });
        yield page.waitForSelector('.mermaid > svg', { timeout: 10000 });
        yield new Promise((r) => setTimeout(r, 500));
        const element = yield page.$('.mermaid');
        const imageFilename = `${filename}.png`;
        const imagePath = path_1.default.join(outputDir, imageFilename);
        yield (element === null || element === void 0 ? void 0 : element.screenshot({ path: imagePath }));
        yield browser.close();
        return `/diagrams/${imageFilename}`; // relative public path
    });
}
/**
 * POST /api/flows
 * Accepts full AI-generated APIWatchdogReport in request body,
 * converts each mermaidScript to image, populates availableFlows,
 * and returns updated FlowsSection
 */
router.post('/flows', express_1.default.json(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const report = req.body;
        if (!((_a = report === null || report === void 0 ? void 0 : report.flows) === null || _a === void 0 ? void 0 : _a.flows)) {
            res.status(400).json({ error: 'Invalid report: flows section missing.' });
            return;
        }
        const flowsSection = report.flows;
        // Populate availableFlows from flows list
        flowsSection.availableFlows = flowsSection.flows.map((f) => ({ id: f.id, title: f.title }));
        let count = 0;
        // Render each flow diagram
        for (const flow of flowsSection.flows) {
            const filename = `flow-${flow.id || count++}`;
            const relativePath = yield generateMermaidImage(flow.mermaidScript, filename);
            const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;
            flow.imageUrl = fullUrl;
            flow.exportUrl = `/downloads/${filename}.svg`;
        }
        res.json(flowsSection);
    }
    catch (err) {
        console.error('Error processing flows:', err);
        next(err);
    }
}));
exports.default = router;
