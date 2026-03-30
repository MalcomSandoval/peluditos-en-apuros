import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, FileText } from 'lucide-react';
import axios from 'axios';

export default function Home({ user }) {
  const [hasApplied, setHasApplied] = useState(user?.volunteerStatus === 'PENDING');

  const handleApplyVolunteer = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/${user.id}/volunteer`);
      setHasApplied(true);
      
      // Update local storage visually
      const updatedUser = { ...user, volunteerStatus: 'PENDING' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert("¡Genial! Hemos enviado tu solicitud de pasantía al Administrador. Te contactaremos pronto.");
    } catch (e) {
      alert("Uh oh, hubo un problema enviando tu postulación de voluntariado.");
    }
  };

  return (
    <div>
      <section className="section-padding section-bg-alt text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>Encuentra a tu <span style={{ color: 'var(--color-primary)' }}>mejor amigo</span></h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '32px', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto 32px' }}>
            En Peluditos en Apuros rescatamos, sanamos y buscamos hogares llenos de amor para animales abandonados. 
            Tu familia puede estar a un clic de estar completa.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/adopcion" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              <Search size={20} /> Ver Animales
            </Link>
            
            {/* VOLUNTEER APPLY BUTTON */}
            {!user ? (
               <Link to="/registro" className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                 <Heart size={20} /> Unirme a la Fundación
               </Link>
            ) : user.role === 'ADOPTER' ? (
               <button onClick={handleApplyVolunteer} disabled={hasApplied} className="btn btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem', cursor: hasApplied ? 'not-allowed' : 'pointer' }}>
                 <Heart size={20} /> {hasApplied ? "Solicitud de Pasante Enviada" : "Quiero ser Pasante (Voluntariado)"}
               </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-padding container">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <h2>¿Cómo funciona el proceso de adopción?</h2>
          <p style={{ color: 'var(--color-text-light)' }}>Es simple, seguro y con mucho amor.</p>
        </div>

        <div className="grid-cols-3">
          <div className="animal-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Search size={48} color="var(--color-mustard)" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>1. Encuentra</h3>
            <p style={{ color: 'var(--color-text-light)' }}>Revisa nuestra galería de animales disponibles y encuentra al peludito que conecte con tu corazón.</p>
          </div>
          <div className="animal-card" style={{ padding: '32px', textAlign: 'center' }}>
            <FileText size={48} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>2. Aplica</h3>
            <p style={{ color: 'var(--color-text-light)' }}>Llena nuestro formulario asegurándonos de que ambos tendrán la mejor vida posible.</p>
          </div>
          <div className="animal-card" style={{ padding: '32px', textAlign: 'center' }}>
            <Heart size={48} color="var(--color-secondary)" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>3. Adopta</h3>
            <p style={{ color: 'var(--color-text-light)' }}>Firma tu contrato digital, recoge a tu nuevo miembro familiar y comienza una vida llena de amor.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
