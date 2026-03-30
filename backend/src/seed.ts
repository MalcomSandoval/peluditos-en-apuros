import { sequelize, User, Animal } from "./db";
import bcrypt from "bcryptjs";

const seed = async () => {
  await sequelize.sync({ force: true });

  const adminPassword = await bcrypt.hash("admin", 10);
  await User.create({
    email: "admin@admin.com",
    name: "Administrador Principal",
    password: adminPassword,
    role: "ADMIN"
  });

  await User.create({
    email: "usuario@test.com",
    name: "Usuario Adoptante",
    password: await bcrypt.hash("12345", 10),
    role: "ADOPTER"
  });

  await Animal.bulkCreate([
    {
      name: "Toby",
      age: "2 años",
      breed: "Mestizo",
      size: "Mediano",
      healthStatus: "Vacunado y desparasitado",
      description: "Es muy juguetón y amoroso, le encanta correr por el patio.",
      photos: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "AVAILABLE"
    },
    {
      name: "Luna",
      age: "6 meses",
      breed: "Gato Común",
      size: "Pequeño",
      healthStatus: "Esterilizada",
      description: "Tranquila, duerme todo el día en el sofá, ideal para casa.",
      photos: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "AVAILABLE"
    },
    {
      name: "Rocky",
      age: "5 años",
      breed: "Labrador",
      size: "Grande",
      healthStatus: "Vacunado",
      description: "El perro más fiel. Protector y excelente con niños.",
      photos: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "AVAILABLE"
    },
    {
      name: "Simba",
      age: "1 año",
      breed: "Golden",
      size: "Grande",
      healthStatus: "Saludable",
      description: "Un sol de mascota, siempre feliz y dispuesto a jugar a la pelota.",
      photos: "https://images.unsplash.com/photo-1537151608804-ea2f1d71fa0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "PROCESS"
    }
  ]);

  console.log("Database seeded successfully!");
  process.exit(0);
};

seed().catch(console.error);
