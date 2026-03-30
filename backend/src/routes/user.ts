import { Router } from "express";
import { applyForVolunteer, getPendingVolunteers, resolveVolunteerStatus } from "../controllers/user";

const router = Router();

router.get("/volunteers", getPendingVolunteers as any);
router.post("/:id/volunteer", applyForVolunteer as any);
router.put("/:id/role", resolveVolunteerStatus as any);

export default router;
