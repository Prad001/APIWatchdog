import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import PptxGenJS from "pptxgenjs";



import uploadRouter from "./routes/upload/upload.js";
import reportRouter from "./routes/reports/report.js";



const app = express();

// Set up static folder to serve images
app.use('/diagrams', express.static(path.join(__dirname, '../../public/diagrams')));




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
    origin: function(origin: any, callback: any){
      const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
      callback(null, isWhitelisted);
    },
    credentials:true
  };

  app.use(cors(corsOptions));
  
  
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));


  app.use("/api/upload", uploadRouter);
  app.use("/api/report", reportRouter);


  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    // err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err:any, req:any, res:any, next:any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({});
  });

 





export default app;