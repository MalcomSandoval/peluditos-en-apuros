import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdoptionForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    housingType: 'Casa propia con patio',
    experience: '',
  });

  const [questions, setQuestions] = useState({
    q1: '',
    q2: 'Menos de 2 horas',
    q3: ''
  });

  const [awarenessAccepted, setAwarenessAccepted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!awarenessAccepted) {
      alert("Debes marcar la casilla de concientización para continuar.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/adoptions', {
        animalId: parseInt(id),
        userId: user?.id || 1,
        housingType: formData.housingType,
        experience: formData.experience,
        questionnaire: JSON.stringify(questions)
      });
      alert(`¡Solicitud enviada exitosamente para la mascota #${id}!`);
      navigate('/');
    } catch {
      alert("Error al enviar solicitud, verifique su conexión.");
      navigate('/');
    }
  };

  return (
    <div className="container section-padding">
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ marginBottom: '8px', color: 'var(--color-primary)' }}>Solicitud de Adopción Responsable</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '32px' }}>
          Estás aplicando para adoptar al peludito con ID #{id}. Por favor, llena el siguiente filtro de bienestar animal.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px', background: 'var(--color-bg-alt)', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>1. Información Básica</h3>
            <div className="input-group">
              <label>Tipo de Vivienda</label>
              <select className="input-control" value={formData.housingType} onChange={e => setFormData({...formData, housingType: e.target.value})}>
                <option>Casa propia con patio</option>
                <option>Casa arrendada con patio</option>
                <option>Apartamento propio</option>
                <option>Apartamento arrendado (asegura permisos)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Experiencia previa con mascotas</label>
              <textarea className="input-control" rows="3" required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
            </div>
          </div>

          <div style={{ padding: '24px', background: '#FFF8F0', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--color-mustard)' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', color: 'var(--color-mustard)' }}>2. Valoración de Concientización</h3>
            
            <div className="input-group">
              <label>Si el animalito enferma gravemente o sufre un accidente, ¿qué medidas económicas o de tiempo tomarías en tu hogar?</label>
              <textarea className="input-control" rows="3" required placeholder="Ej: Tengo ahorros de emergencia, acudiría a mi veterinario, etc." value={questions.q1} onChange={e => setQuestions({...questions, q1: e.target.value})} />
            </div>

            <div className="input-group">
              <label>¿Cuántas horas al día pasará completamente solo el peludito en casa por motivos de trabajo o estudio?</label>
              <select className="input-control" value={questions.q2} onChange={e => setQuestions({...questions, q2: e.target.value})}>
                <option>Casi nunca solo (Trabajo desde casa / Alguien siempre cuidará de él)</option>
                <option>Menos de 2 horas</option>
                <option>Entre 2 y 5 horas</option>
                <option>Entre 5 y 8 horas</option>
                <option>Más de 8 horas continuas</option>
              </select>
            </div>

            <div className="input-group">
              <label>¿Qué opinan las demás personas que viven contigo sobre incorporar un animal? (Indica si hay alergias).</label>
              <textarea className="input-control" rows="3" required placeholder="Todos estamos de acuerdo..." value={questions.q3} onChange={e => setQuestions({...questions, q3: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '32px', padding: '16px', backgroundColor: '#FDECEA', borderRadius: '8px' }}>
            <input type="checkbox" id="awareness" style={{ width: '20px', height: '20px', marginTop: '4px' }} checked={awarenessAccepted} onChange={(e) => setAwarenessAccepted(e.target.checked)} />
            <label htmlFor="awareness" style={{ color: '#E74C3C', fontWeight: 'bold', cursor: 'pointer', lineHeight: '1.4' }}>
              DECLARACIÓN IRREVOCABLE: Acepto que adoptar una mascota implica un compromiso de 10 a 15 años. Estoy plenamente consciente que el animal generará gastos médicos, requerirá alimentación de buena calidad, necesitará adaptaciones en casa y mucha paciencia durante su periodo de acoplamiento.
            </label>
          </div>
          
          <button type="submit" className="btn btn-mustard" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>Enviar Valoración y Solicitud</button>
        </form>
      </div>
    </div>
  );
}
