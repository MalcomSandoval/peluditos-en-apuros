import { Router } from "express";
import { getAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal } from "../controllers/animal";

const router = Router();
router.get("/", getAnimals as any);
router.get("/:id", getAnimalById as any);
router.post("/", createAnimal as any);
router.put("/:id", updateAnimal as any);
router.delete("/:id", deleteAnimal as any);

export default router;
