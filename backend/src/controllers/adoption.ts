import { Request, Response } from "express";
import { AdoptionRequest, Animal, User } from "../db";

export const createAdoptionRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { animalId, userId, housingType, experience, questionnaire } = req.body;
    
    const request = await AdoptionRequest.create({
      animalId,
      userId,
      housingType,
      experience,
      questionnaire
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: "Error creating adoption request." });
  }
};

import { Op } from "sequelize";

export const getAdoptionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Generate dashboard metrics
    const available = await Animal.count({ where: { status: "AVAILABLE" } });
    const adopted = await Animal.count({ where: { status: "ADOPTED" } });
    const inProcess = await Animal.count({ where: { status: "PROCESS" } });
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); 

    const recentAdoptions = await Animal.findAll({
      where: { status: "ADOPTED", updatedAt: { [Op.gte]: sixMonthsAgo } },
      attributes: ['updatedAt']
    });

    const monthNames = ["Enero", "Feb", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Sept", "Oct", "Nov", "Dic"];
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 5; i >= 0; i--) {
       const d = new Date();
       d.setMonth(d.getMonth() - i);
       labels.push(monthNames[d.getMonth()]);
       values.push(0);
    }
    
    recentAdoptions.forEach(a => {
       const d = new Date((a as any).updatedAt);
       const mIndex = labels.indexOf(monthNames[d.getMonth()]);
       if (mIndex !== -1) values[mIndex]++;
    });

    res.json({
      stats: { available, adopted, process: inProcess },
      monthly: { labels, values }
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching status stats." });
  }
};

export const getAdoptionReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.query; // monthly, quarterly, annual
    let daysToSub = 30;
    if (type === 'quarterly') daysToSub = 90;
    if (type === 'annual') daysToSub = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSub);

    const periodAdoptions = await Animal.count({ where: { status: "ADOPTED", updatedAt: { [Op.gte]: startDate } } });
    const periodIncomings = await Animal.count({ where: { createdAt: { [Op.gte]: startDate } } });

    res.json({ periodAdoptions, periodIncomings, days: daysToSub });
  } catch (error) {
    res.status(500).json({ error: "Error fetching report." });
  }
};

export const getAdoptionRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await AdoptionRequest.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Animal, attributes: ['id', 'name', 'status'] }
      ]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching adoption requests." });
  }
};

export const updateAdoptionRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const request = await AdoptionRequest.findByPk(req.params.id as any);
    
    if (!request) {
      res.status(404).json({ error: "Adoption request not found." });
      return;
    }

    await (request as any).update({ status });

    // If approved, update animal status
    if (status === "APPROVED") {
      const animal = await Animal.findByPk((request as any).animalId);
      if (animal) await (animal as any).update({ status: "ADOPTED" });
    } else if (status === "DECLINED") {
      // Optional: reset to available.
      const animal = await Animal.findByPk((request as any).animalId);
      if (animal && (animal as any).status !== "ADOPTED") {
         await (animal as any).update({ status: "AVAILABLE" });
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: "Error updating adoption request." });
  }
};
