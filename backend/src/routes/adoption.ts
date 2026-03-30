import { Router } from "express";
import { createAdoptionRequest, getAdoptionStatus, getAdoptionRequests, updateAdoptionRequest, getAdoptionReport } from "../controllers/adoption";

const router = Router();
router.post("/", createAdoptionRequest as any);
router.get("/status", getAdoptionStatus as any);
router.get("/report", getAdoptionReport as any);
router.get("/", getAdoptionRequests as any);
router.put("/:id", updateAdoptionRequest as any);

export default router;
