import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_PETS } from '../data/mockData';
import { Printer, AlertCircle, ArrowLeft } from 'lucide-react';

const AdoptionContract = () => {
  const { id } = useParams();
  const { user, isAdopter } = useAuth();
  const navigate = useNavigate();

  const pet = MOCK_PETS.find(p => p.id === parseInt(id));

  // Simular protección de ruta
  useEffect(() => {
    if (!user || user.role === 'ADMIN') {
      // Para efectos del prototipo, un admin viéndolo en vivo podría o no permitirse,
      // pero el requerimiento es que toma los datos del adoptante logueado.
    }
  }, [user]);

  if (!pet || !user) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl text-text mb-4">No se pudo generar el contrato</h2>
        <p className="text-text-light mb-6">Por favor simula haber iniciado sesión como "Adoptante" y selecciona una mascota nuevamente.</p>
        <button onClick={() => navigate('/mascotas')} className="btn btn-primary">Volver a Mascotas</button>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="container py-12 animate-fade-in bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-outline border-none hover:bg-transparent">
          <ArrowLeft size={18} /> Volver
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          <Printer size={18} /> Imprimir Contrato
        </button>
      </div>

      {/* Contract Paper View */}
      <div className="contract-paper text-text">
        <div className="text-center mb-8 border-b-2 border-primary pb-6">
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-[#3E2723] mb-2">Fundación Peluditos en Apuros</h1>
          <h2 className="text-xl text-primary font-semibold uppercase">Contrato de Adopción Responsable</h2>
          <p className="text-sm mt-2 text-gray-500">Documento Generado Automáticamente: {currentDate}</p>
        </div>

        <div className="mb-6 bg-yellow-50 text-yellow-800 p-4 rounded-lg flex gap-3 items-start border border-yellow-200 hide-on-print">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p className="text-sm">
            <strong>Atención Adoptante:</strong> Este contrato ha sido generado automáticamente cruzando tus datos de perfil con el registro de la mascota seleccionada en nuestra base de datos. Por favor, revisa todo. Al final solo queda el campo de tu firma para oficializar la adopción.
          </p>
        </div>

        <div className="mb-8 space-y-4 text-justify font-body text-base leading-relaxed">
          <p>
            Entre los suscritos a saber, de una parte <strong>LA FUNDACIÓN PELUDITOS EN APUROS</strong>, 
            y de otra parte <strong>{user.name}</strong>, mayor de edad, identificado(a) con documento de identidad 
            No. <strong>{user.identityDocument || '_______________'}</strong>, domiciliado en <strong>{user.address || '_______________'}</strong>, 
            teléfono de contacto <strong>{user.phone || '_______________'}</strong>, correo electrónico <strong>{user.email || '_______________'}</strong>; 
            quien en adelante se denominará EL ADOPTANTE, se celebra el presente CONTRATO DE ADOPCIÓN bajo las siguientes cláusulas:
          </p>

          <h3 className="font-bold text-lg mt-6 text-primary">CLAÚSULA PRIMERA - DEL ANIMAL DADO EN ADOPCIÓN</h3>
          <p>
            La FUNDACIÓN entrega en adopción al ADOPTANTE el animal cuyas características se especifican a continuación, el cual ha sido evaluado y declarado apto para su integración en un nuevo hogar:
          </p>
          <ul className="list-disc list-inside ml-4 bg-gray-50 p-4 border rounded-md my-4 space-y-1">
            <li><strong>Nombre del Peludito:</strong> {pet.name}</li>
            <li><strong>Especie:</strong> {pet.species}</li>
            <li><strong>Raza / Cruce:</strong> {pet.breed}</li>
            <li><strong>Edad Aproximada:</strong> {pet.age}</li>
            <li><strong>Sexo:</strong> {pet.gender}</li>
            <li><strong>Tamaño:</strong> {pet.size}</li>
            <li><strong>Identificador de Registro:</strong> #PA-{pet.id.toString().padStart(4, '0')}</li>
          </ul>

          <h3 className="font-bold text-lg mt-6 text-primary">CLAÚSULA SEGUNDA - COMPROMISOS DEL ADOPTANTE</h3>
          <p>
            EL ADOPTANTE declara recibir a <strong>{pet.name}</strong> en buenas condiciones generales y se compromete bajo la gravedad de juramento a:
            1. Mantenerlo en su domicilio (<strong>{user.address}</strong>), brindando espacio, alimentación de calidad y afecto.
            2. Proveer atención veterinaria cuando lo requiera, manteniendo al día su esquema de vacunación y desparasitación.
            3. No destinar al animal para cría, caza, experimentación, trabajo pesado u otras actividades que vulneren su bienestar.
            4. Informar de inmediato a LA FUNDACIÓN en caso de extravío o fallecimiento.
            5. Permitir el seguimiento presencial o telefónico por parte de la fundación.
          </p>

          <h3 className="font-bold text-lg mt-6 text-primary">CLAÚSULA TERCERA - DEVOLUCIÓN</h3>
          <p>
            Si EL ADOPTANTE no pudiese continuar haciéndose cargo de <strong>{pet.name}</strong>, bajo NINGUNA CIRCUNSTANCIA podrá regalarlo, venderlo o abandonarlo. Deberá devolverlo obligatoriamente a LA FUNDACIÓN.
          </p>

          <p className="mt-8 italic font-semibold">
            Para constancia se firma de conformidad el día de hoy. El presente documento tiene validez legal una vez estampado el consentimiento y firma del adoptante.
          </p>
        </div>

        {/* Firmas */}
        <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 gap-12 text-center text-sm pb-10">
          <div>
            <div className="mx-auto w-48 border-b border-black mb-2 opacity-30 h-10 relative">
              <span className="absolute bottom-1 right-2 opacity-50 font-serif italic" style={{fontFamily: 'cursive', color: 'var(--color-primary)'}}>Fundación PeA</span>
            </div>
            <p className="font-bold">Por: FUNDACIÓN PELUDITOS EN APUROS</p>
            <p className="text-gray-500">Representante Legal</p>
          </div>
          <div>
            <div className="mx-auto w-48 border-b border-black mb-2 h-10 relative">
              <span className="absolute -bottom-6 left-0 text-gray-300 pointer-events-none text-xs w-full text-center">Firma Libre (Adoptante)</span>
            </div>
            <p className="font-bold text-[#3E2723] uppercase">{user.name}</p>
            <p className="text-gray-500">C.C. {user.identityDocument || '_______________'}</p>
          </div>
        </div>
        
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .contract-paper, .contract-paper * {
            visibility: visible;
          }
          .contract-paper {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
            width: 100%;
          }
          .hide-on-print {
            display: none !important;
          }
          .btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdoptionContract;
