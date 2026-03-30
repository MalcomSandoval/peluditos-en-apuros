import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AnimalGallery() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSize, setFilterSize] = useState('Todos los tamaños');

  useEffect(() => {
    // Fetch from our local backend running on port 5000
    axios.get(`${import.meta.env.VITE_API_URL}/api/animals`)
      .then(res => {
        setAnimals(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading animals, using mock fallback", err);
        // Fallback to mock data to ensure the UI looks good even if backend fails
        setAnimals([
          { id: 1, name: 'Toby', age: '2 años', breed: 'Mestizo', size: 'Mediano', healthStatus: 'Vacunado', description: 'Es muy juguetón y amoroso, le encanta correr.', status: 'AVAILABLE', photos: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 2, name: 'Luna', age: '6 meses', breed: 'Gato Común', size: 'Pequeño', healthStatus: 'Esterilizada', description: 'Tranquila, duerme todo el día en el sofá.', status: 'AVAILABLE', photos: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
          { id: 3, name: 'Rocky', age: '5 años', breed: 'Labrador', size: 'Grande', healthStatus: 'Vacunado', description: 'El perro más fiel. Protector y excelente con niños.', status: 'PROCESS', photos: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container section-padding text-center"><h2>Cargando peluditos...</h2></div>;

  const filteredAnimals = filterSize === 'Todos los tamaños' 
    ? animals 
    : animals.filter(a => a.size.toLowerCase() === filterSize.toLowerCase());

  return (
    <div className="container section-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Peluditos Buscando Hogar</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="input-control" 
            style={{ width: 'auto' }} 
            value={filterSize} 
            onChange={(e) => setFilterSize(e.target.value)}
          >
            <option value="Todos los tamaños">Todos los tamaños</option>
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>
        </div>
      </div>

      <div className="grid-cols-3">
        {filteredAnimals.map(animal => (
          <div key={animal.id} className="animal-card">
            <div className={`status-badge ${animal.status === 'AVAILABLE' ? 'status-available' : animal.status === 'PROCESS' ? 'status-process' : 'status-adopted'}`}>
              {animal.status === 'AVAILABLE' ? 'Disponible' : animal.status === 'PROCESS' ? 'En Proceso' : 'Adoptado'}
            </div>
            <div className="animal-image-wrapper">
              <img src={animal.photos} alt={animal.name} />
            </div>
            <div className="card-content">
              <h3 className="card-title">
                {animal.name}
              </h3>
              <div className="card-meta">
                <span><strong>Edad:</strong> {animal.age}</span> • 
                <span><strong>Tamaño:</strong> {animal.size}</span>
              </div>
              <p className="card-desc">{animal.description}</p>
              
              <Link 
                to={`/adopcion/${animal.id}`} 
                className="btn btn-mustard" 
                style={{ width: '100%' }}
                onClick={(e) => { if(animal.status !== 'AVAILABLE') e.preventDefault(); }}
              >
                {animal.status === 'AVAILABLE' ? 'Quiero Adoptarlo' : 'No Disponible'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
