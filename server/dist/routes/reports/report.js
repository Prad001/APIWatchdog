"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    const report = (0, upload_1.getLastReport)();
    if (!report) {
        res.status(404).json({ error: "No report available" });
        return;
    }
    res.json(report);
});
exports.default = router;
