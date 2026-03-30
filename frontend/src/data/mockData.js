export const MOCK_PETS = [
  {
    id: 1,
    name: 'Max',
    species: 'Perro',
    breed: 'Labrador Retriever Mix',
    age: '2 años',
    gender: 'Macho',
    size: 'Mediano',
    description: 'Max es un perro muy enérgico y juguetón. Le encanta correr por el parque y jugar a atrapar la pelota. Ideal para familias activas.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Disponible'
  },
  {
    id: 2,
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamés',
    age: '1 año',
    gender: 'Hembra',
    size: 'Pequeño',
    description: 'Luna es una gata muy cariñosa y charlatana. Disfruta de largas siestas al sol y de la compañía humana.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Disponible'
  },
  {
    id: 3,
    name: 'Rocky',
    species: 'Perro',
    breed: 'Mestizo',
    age: '4 meses',
    gender: 'Macho',
    size: 'Pequeño (crecerá a mediano)',
    description: 'Un cachorro rescatado lleno de amor para dar. Todavía está aprendiendo las reglas de la casa, necesita paciencia.',
    image: 'https://images.unsplash.com/photo-1537151608804-ea2d15a4eb3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'Disponible'
  },
  {
    id: 4,
    name: 'Bella',
    species: 'Gato',
    breed: 'Pelaje Corto Doméstico',
    age: '3 años',
    gender: 'Hembra',
    size: 'Mediano',
    description: 'Bella es independiente pero le gustan los mimos cuando ella los pide. Se lleva bien con otros gatos tranquilos.',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    status: 'En Proceso'
  }
];

export const MOCK_USERS = {
  admin: {
    id: 'a1',
    name: 'Marta (Administradora)',
    email: 'admin@peluditosenapuros.org',
    role: 'ADMIN'
  },
  adopter: {
    id: 'u1',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@ejemplo.com',
    phone: '555-0192',
    address: 'Calle Falsa 123, Ciudad, País',
    role: 'ADOPTER',
    identityDocument: '12345678X'
  }
};
