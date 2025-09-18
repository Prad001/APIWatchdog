"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const fs_1 = __importDefault(require("fs"));
const upload_js_1 = __importDefault(require("./routes/upload/upload.js"));
const report_js_1 = __importDefault(require("./routes/reports/report.js"));
const app = (0, express_1.default)();
// Set up static folder to serve images
app.use('/diagrams', express_1.default.static(path_1.default.join(__dirname, '../../public/diagrams')));
const originsWhitelist = [
    'http://localhost:4200', // development
    'http://localhost:9000', // test
    'http://localhost:3000', // test
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:5111',
    'http://localhost:7100'
];
const corsOptions = {
    origin: function (origin, callback) {
        const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use("/api/upload", upload_js_1.default);
app.use("/api/report", report_js_1.default);
// ----------- CLEANUP JOB FOR UPLOADS ------------
const UPLOADS_DIR = path_1.default.join(process.cwd(), "uploads");
// Run every hour: delete files older than 1 hour
node_cron_1.default.schedule("0 * * * *", () => {
    fs_1.default.readdir(UPLOADS_DIR, (err, files) => {
        if (err)
            return;
        files.forEach((file) => {
            const filePath = path_1.default.join(UPLOADS_DIR, file);
            fs_1.default.stat(filePath, (err, stats) => {
                if (err)
                    return;
                const oneHourAgo = Date.now() - 60 * 60 * 1000;
                if (stats.mtimeMs < oneHourAgo) {
                    fs_1.default.unlink(filePath, () => { });
                }
            });
        });
    });
});
// -----------------------------------------------
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    // err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({});
});
exports.default = app;
