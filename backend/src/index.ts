import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { sequelize } from "./db";
import authRoutes from "./routes/auth";
import animalRoutes from "./routes/animal";
import adoptionRoutes from "./routes/adoption";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/users", userRoutes);

app.get("/api/seed", async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const { User, Animal, AdoptionRequest, sequelize } = require("./db");
    await sequelize.sync({ force: true });
    
    // Seed Users
    const adminUser = await User.create({ email: "admin@admin.com", name: "Admin", password: await bcrypt.hash("admin", 10), role: "ADMIN" });
    const volunteerUser = await User.create({ email: "pasante@peluditos.com", name: "Pasante Oficial", password: await bcrypt.hash("12345", 10), role: "VOLUNTEER" });
    const user1 = await User.create({ email: "juan@test.com", name: "Juan Perez", password: await bcrypt.hash("12345", 10), role: "ADOPTER" });
    const user2 = await User.create({ email: "maria@test.com", name: "Maria Gomez", password: await bcrypt.hash("12345", 10), role: "ADOPTER" });
    const user3 = await User.create({ email: "carlos@test.com", name: "Carlos Lopez", password: await bcrypt.hash("12345", 10), role: "ADOPTER" });

    // Seed Animals
    const animals = await Animal.bulkCreate([
      { name: "Toby", age: "2 años", breed: "Mestizo", size: "Mediano", healthStatus: "Vacunado", description: "Juguetón y leal, ideal para niños.", photos: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&w=800&q=80", status: "AVAILABLE" },
      { name: "Luna", age: "6 meses", breed: "Galo", size: "Pequeño", healthStatus: "Esterilizada", description: "Tranquila amante de siestas.", photos: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&w=800&q=80", status: "AVAILABLE" },
      { name: "Rocky", age: "5 años", breed: "Labrador", size: "Grande", healthStatus: "Desparasitado", description: "Protector de la casa.", photos: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&w=800&q=80", status: "PROCESS" },
      { name: "Manchas", age: "1 año", breed: "Dálmata", size: "Mediano", healthStatus: "Saludable", description: "Lleno de energía y amor.", photos: "https://images.unsplash.com/photo-1537151608804-ea2f1d71fa0b?ixlib=rb-4.0.3&w=800&q=80", status: "ADOPTED" },
      { name: "Simba", age: "3 meses", breed: "Pug", size: "Pequeño", healthStatus: "Vacunas al día", description: "Un cachorro muy curioso.", photos: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&w=800&q=80", status: "AVAILABLE" },
      { name: "Milo", age: "4 años", breed: "Beagle", size: "Mediano", healthStatus: "Controlado", description: "Le encanta investigar y oler.", photos: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-4.0.3&w=800&q=80", status: "ADOPTED" },
      { name: "Bella", age: "2 años", breed: "Gato Persa", size: "Pequeño", healthStatus: "Sana", description: "Muy elegante y reservada.", photos: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.0.3&w=800&q=80", status: "AVAILABLE" }
    ], { returning: true });

    // Seed Adoption Requests
    const q1 = JSON.stringify({ q1: "Llevarlo de inmediato al veterinario y usar fondo de ahorro.", q2: "Menos de 2 horas", q3: "Están muy emocionados." });
    const q2 = JSON.stringify({ q1: "Pedir un préstamo si es urgente.", q2: "Casi nunca solo", q3: "Es un regalo para mi mamá, le encantará." });
    const q3 = JSON.stringify({ q1: "Consultar seguro médico de mascotas.", q2: "Entre 2 y 5 horas", q3: "Toda la familia está de acuerdo, sin alergias." });
    
    await AdoptionRequest.bulkCreate([
      { housingType: "Casa propia", experience: "Tuve perros antes", status: "PENDING", userId: user1.id, animalId: animals[0].id, questionnaire: q1 },
      { housingType: "Apartamento", experience: "Primera vez", status: "APPROVED", userId: user2.id, animalId: animals[3].id, questionnaire: q2 },
      { housingType: "Casa con patio", experience: "He rescatado animales", status: "APPROVED", userId: user3.id, animalId: animals[5].id, questionnaire: q3 },
      { housingType: "Apartamento", experience: "Ninguna", status: "PROCESS", userId: user1.id, animalId: animals[2].id, questionnaire: q1 }
    ]);
    res.send("Seeded Successfully");
  } catch (err) {
    res.status(500).send(String(err));
  }
});

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.error);
