"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
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
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    // err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json({});
});
exports.default = app;
