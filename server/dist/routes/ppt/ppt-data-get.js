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
const ppt_data_1 = __importDefault(require("../../model/ppt-data"));
const router = express_1.default.Router();
// Type guard to check if a PptContent is a mermaid object
function isMermaid(content) {
    return content.type === 'mermaid' && 'script' in content;
}
const generateMermaidImage = (script, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const outputDir = path_1.default.join(__dirname, "../../public/diagrams");
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    const browser = yield puppeteer_1.default.launch({ headless: true });
    const page = yield browser.newPage();
    yield page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 2 // high resolution
    });
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
    yield page.setContent(html, { waitUntil: "networkidle0" });
    yield page.waitForSelector(".mermaid > svg", { timeout: 10000 });
    yield new Promise(resolve => setTimeout(resolve, 1000));
    const element = yield page.$(".mermaid");
    const imagePath = path_1.default.join(outputDir, `${filename}.png`);
    yield (element === null || element === void 0 ? void 0 : element.screenshot({ path: imagePath }));
    yield browser.close();
    return `/diagrams/${filename}.png`;
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mermaidCount = 0;
        for (const slide of ppt_data_1.default.slides) {
            for (const content of slide.contents) {
                if (isMermaid(content)) {
                    const filename = `mermaid-diagram-${mermaidCount++}`;
                    const imagePath = yield generateMermaidImage(content.script, filename);
                    const imageUrl = `http://localhost:3000/diagrams/${filename}.png`;
                    content.imagePath = imageUrl; // safe due to type guard
                }
            }
        }
        res.json({ data: ppt_data_1.default });
        console.log("Data :", ppt_data_1.default);
    }
    catch (error) {
        console.error("Error generating Mermaid diagrams:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
