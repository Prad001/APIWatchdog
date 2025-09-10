import express, { Request, Response } from "express";
import { getLastReport } from "../upload/upload";

const router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  const report = getLastReport();
  if (!report) {
    res.status(404).json({ error: "No report available" });
    return;
  }
  res.json(report);
});


export default router;
