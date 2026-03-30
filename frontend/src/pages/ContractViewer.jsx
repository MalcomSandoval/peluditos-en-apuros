import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ContractViewer({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    setSigned(true);
    setTimeout(() => {
      alert("¡Felicidades! Contrato firmado digitalmente. Gracias por salvar una vida.");
      navigate('/');
    }, 1500);
  };

  return (
    <div className="container section-padding">
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: '#FAFAFA',
          padding: '48px',
          border: '1px solid #E0E0E0',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' }} />
          <h2>Contrato de Adopción</h2>
          <p>Fundación "Peluditos en Apuros"</p>
        </div>

        <div style={{ lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '40px' }}>
          <p><strong>Contrato No:</strong> 000-{id}-2026</p>
          <p><strong>Adoptante:</strong> {user?.name || "Muestra Adoptante"}</p>
          <p><strong>Identificación:</strong> 123456789-0</p>
          <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E0E0E0' }} />
          <p>
            Mediante el presente documento, el ADOPTANTE se compromete a brindar cuidado,
            alimentación, atención veterinaria y mucho amor al animal entregado por la
            Fundación Peluditos en Apuros.
          </p>
          <p>
            La fundación se reserva el derecho de realizar visitas periódicas (previamente agendadas)
            para garantizar el bienestar del animal durante los primeros 6 meses.
          </p>
        </div>

        {!signed ? (
          <div className="text-center" style={{ padding: '24px', background: 'var(--color-bg-alt)', borderRadius: '16px' }}>
            <p style={{ marginBottom: '16px' }}>Al hacer clic, firmas digitalmente aceptando los términos y condiciones de adopción estipulados por nuestra fundación.</p>
            <button onClick={handleSign} className="btn btn-primary" style={{ padding: '16px 40px' }}>
              Aceptar y Firmar Contrato
            </button>
          </div>
        ) : (
          <div className="text-center animate-fade-in" style={{ padding: '24px', color: '#27AE60' }}>
            <CheckCircle size={64} style={{ margin: '0 auto 16px' }} />
            <h3>¡Contrato Firmado con Éxito!</h3>
          </div>
        )}
      </div>
    </div>
  );
}
