import { Request, Response } from "express";
import { User } from "../db";

export const applyForVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id as any);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await (user as any).update({ volunteerStatus: "PENDING" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error applying for volunteer." });
  }
};

export const getPendingVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({ where: { volunteerStatus: "PENDING" } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending volunteers." });
  }
};

export const resolveVolunteerStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // "APPROVED" or "REJECTED"
    const user = await User.findByPk(req.params.id as any);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (status === "APPROVED") {
      await (user as any).update({ volunteerStatus: "APPROVED", role: "VOLUNTEER" });
    } else {
      await (user as any).update({ volunteerStatus: "REJECTED" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error resolving volunteer status." });
  }
};
