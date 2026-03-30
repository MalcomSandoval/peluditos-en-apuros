import { Request, Response } from "express";
import { Animal } from "../db";

export const getAnimals = async (req: Request, res: Response): Promise<void> => {
  try {
    const animals = await Animal.findAll();
    res.json(animals);
  } catch (error) {
    res.status(500).json({ error: "Error fetching animals." });
  }
};

export const getAnimalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const animal = await Animal.findByPk(req.params.id as any);
    if (!animal) res.status(404).json({ error: "Animal not found." });
    else res.json(animal);
  } catch (error) {
    res.status(500).json({ error: "Error fetching animal." });
  }
};

export const createAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({ error: "Error creating animal." });
  }
};

export const updateAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const animal = await Animal.findByPk(req.params.id as any);
    if (!animal) {
      res.status(404).json({ error: "Animal not found." });
      return;
    }
    await (animal as any).update(req.body);
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: "Error updating animal." });
  }
};

export const deleteAnimal = async (req: Request, res: Response): Promise<void> => {
  try {
    const animal = await Animal.findByPk(req.params.id as any);
    if (!animal) {
      res.status(404).json({ error: "Animal not found." });
      return;
    }
    await (animal as any).destroy();
    res.json({ message: "Animal deleted." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting animal." });
  }
};
