import React, { useState } from 'react';
import { MOCK_PETS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Syringe, UserCheck, ShieldCheck, Heart } from 'lucide-react';

const AnimalsGallery = () => {
  const [filter, setFilter] = useState('Todos');
  const { isAdopter, user } = useAuth();
  const navigate = useNavigate();

  const filteredPets = MOCK_PETS.filter(pet => {
    if (filter === 'Todos') return true;
    return pet.species === filter;
  });

  const handleApply = (petId) => {
    if (!user) {
      alert("Por favor inicia sesión (simula el rol en la barra superior) para solicitar adopción.");
      return;
    }
    // Si ya está logueado como adoptante, simulamos que generamos su contrato para revisar
    navigate(`/contrato/${petId}`);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-primary mb-4">Nuestros Peluditos</h1>
        <p className="text-text-light text-lg">
          Ellos están esperando ansiosos encontrar a su familia para siempre.
          Conoce a nuestros amigos disponibles.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-10">
        {['Todos', 'Perro', 'Gato'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === cat 
                ? 'bg-secondary text-white shadow-md' 
                : 'bg-white text-text-light hover:bg-gray-100 border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="card relative transform transition-all hover:-translate-y-2 hover:shadow-xl">
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                pet.status === 'Disponible' ? 'bg-secondary' : 'bg-gray-500'
              }`}>
                {pet.status}
              </span>
            </div>

            <img src={pet.image} alt={pet.name} className="card-img" />
            
            <div className="card-body p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-primary m-0">{pet.name}</h2>
                <div className="flex gap-1 text-secondary">
                  <Heart size={20} fill="currentColor" />
                </div>
              </div>
              
              <div className="text-sm font-semibold text-secondary-light mb-4">
                {pet.species} • {pet.age} • {pet.gender}
              </div>
              
              <p className="text-text-light text-sm mb-6 flex-1">
                {pet.description}
              </p>

              <div className="flex gap-2 mb-6">
                <div className="bg-gray-50 p-2 rounded-lg text-center flex-1 border border-gray-100">
                  <Syringe size={16} className="mx-auto text-primary mb-1"/>
                  <span className="text-[0.65rem] uppercase font-bold text-gray-500 block">Vacunado</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center flex-1 border border-gray-100">
                  <ShieldCheck size={16} className="mx-auto text-primary mb-1"/>
                  <span className="text-[0.65rem] uppercase font-bold text-gray-500 block">Sano</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center flex-1 border border-gray-100">
                  <UserCheck size={16} className="mx-auto text-primary mb-1"/>
                  <span className="text-[0.65rem] uppercase font-bold text-gray-500 block">{pet.size}</span>
                </div>
              </div>

              {pet.status === 'Disponible' ? (
                <button 
                  onClick={() => handleApply(pet.id)}
                  className="btn btn-primary w-full"
                >
                  {isAdopter ? 'Generar Contrato de Adopción' : 'Solicitar Adopción'}
                </button>
              ) : (
                <button disabled className="btn btn-outline w-full opacity-50 cursor-not-allowed">
                  En Proceso
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimalsGallery;
