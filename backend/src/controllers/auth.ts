import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "El usuario ya existe" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || "ADOPTER"
    });

    const token = jwt.sign({ userId: (user as any).id, role: (user as any).role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: (user as any).id, name: (user as any).name, email: (user as any).email, role: (user as any).role } });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor al registrarse." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const isValid = await bcrypt.compare(password, (user as any).password);
    if (!isValid) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign({ userId: (user as any).id, role: (user as any).role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: (user as any).id, name: (user as any).name, email: (user as any).email, role: (user as any).role } });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor al iniciar sesión." });
  }
};
