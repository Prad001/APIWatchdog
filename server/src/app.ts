import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import PptxGenJS from "pptxgenjs";
import cron from "node-cron";
import fs from "fs";

import uploadRouter from "./routes/upload/upload.js";
import reportRouter from "./routes/reports/report.js";

const app = express();

app.set('trust proxy', 1);

// Set up static folder to serve images
app.use('/diagrams', express.static(path.join(__dirname, '../../public/diagrams')));

// CORS: allow Angular frontend
const allowedOrigins = [
  'https://apiwatchdog.shelkepradeep.in',
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // reject others
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.options('*', (req, res) => {
  res.status(204).send(); 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/upload", uploadRouter);
app.use("/api/report", reportRouter);

// ----------- CLEANUP JOB FOR UPLOADS ------------
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Run every hour: delete files older than 1 hour
cron.schedule("0 * * * *", () => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) return;

    files.forEach((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;

        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        if (stats.mtimeMs < oneHourAgo) {
          fs.unlink(filePath, () => {});
        }
      });
    });
  });
});
// -----------------------------------------------

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  // err.status = 404;
  next(err);
});

// error handler
app.use(function(err:any, req:any, res:any, next:any) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({});
});

export default app;
