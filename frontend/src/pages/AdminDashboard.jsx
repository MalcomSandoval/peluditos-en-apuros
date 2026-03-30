import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 
import { ClipboardList, Archive, CheckCircle, Plus, Trash2, Check, X, Undo, FileText, Download, Edit2 } from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminDashboard({ user }) {
  const isVolunteer = user && user.role === 'VOLUNTEER';
  
  const [activeTab, setActiveTab] = useState(isVolunteer ? 'animals' : 'overview');
  
  const tr = {
    AVAILABLE: 'Disponible',
    ADOPTED: 'Adoptado',
    PROCESS: 'En Proceso',
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    DECLINED: 'Rechazado'
  };
  
  // States
  const [stats, setStats] = useState({ available: 0, adopted: 0, process: 0 });
  const [monthlyLabels, setMonthlyLabels] = useState(['-', '-', '-', '-', '-', '-']);
  const [monthlyValues, setMonthlyValues] = useState([0, 0, 0, 0, 0, 0]);
  const [animals, setAnimals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAnimalId, setEditingAnimalId] = useState(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [newAnimal, setNewAnimal] = useState({ name: '', age: '', breed: '', size: 'Mediano', healthStatus: '', description: '', photos: '' });

  // Load Data
  const loadStats = () => {
    if (isVolunteer) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/adoptions/status`)
      .then(res => { 
        setStats(res.data.stats); 
        setMonthlyLabels(res.data.monthly.labels);
        setMonthlyValues(res.data.monthly.values);
      })
      .catch(console.error);
  };

  const loadAnimals = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/animals`)
      .then(res => setAnimals(res.data))
      .catch(console.error);
  };

  const loadRequests = () => {
    if (isVolunteer) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/adoptions`)
      .then(res => setRequests(res.data))
      .catch(console.error);
  };

  const loadVolunteers = () => {
    if (isVolunteer) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/users/volunteers`)
      .then(res => setVolunteers(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadStats();
    loadAnimals();
    loadRequests();
    loadVolunteers();
  }, [activeTab]);

  // Animal CRUD Actions
  const handleSaveAnimal = async (e) => {
    e.preventDefault();
    try {
      if (editingAnimalId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/animals/${editingAnimalId}`, newAnimal);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/animals`, newAnimal);
      }
      setShowModal(false);
      setEditingAnimalId(null);
      setNewAnimal({ name: '', age: '', breed: '', size: 'Mediano', healthStatus: '', description: '', photos: '' });
      loadAnimals();
      loadStats();
    } catch { alert('Error guardando registro de animal'); }
  };

  const handleDeleteAnimal = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/animals/${id}`);
      loadAnimals();
      loadStats();
    }
  };

  // Adoption Request Actions
  const handleRequestStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/adoptions/${id}`, { status });
      loadRequests();
      loadAnimals();
      loadStats();
    } catch { alert('Error actualizando solicitud'); }
  };

  // Volunteer Request Actions
  const handleVolunteerStatus = async (id, status) => {
    try {
      if (window.confirm(`¿Seguro que deseas ${status === 'APPROVED' ? 'Aprobar' : 'Rechazar'} la solicitud de paso a pasante?`)) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${id}/role`, { status });
        loadVolunteers();
      }
    } catch { alert('Error resolviendo pasantía'); }
  };

  // --- PDF GENERATION: CONTRACTS ---
  const generateContractPDF = (request) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255); // White text if dark bg, no, PDF is usually white bg. Let's use black
    doc.setTextColor(0, 0, 0);
    doc.text("CONTRATO DE ADOPCION RESPONSABLE DE MASCOTAS", 105, 15, null, null, "center");
    doc.text("FUNDACION ANIMAL PELUDITOS EN APUROS", 105, 22, null, null, "center");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const adopterName = request.user?.name || "";
    
    // First paragraph (Yo...)
    doc.text(`Yo ${adopterName.padEnd(40, '_')} identificado con CC___ número _______________________`, 15, 35);
    doc.text(`expedida en _____________________, vivo en la dirección ____________________ del barrio`, 15, 42);
    doc.text(`___________________ de _____________________ y con numero de celular ___________________.`, 15, 49);

    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL ADOPTADO:", 15, 60);
    doc.setFont("helvetica", "normal");
    
    const animalName = request.animal?.name || "";
    const animalBreed = request.animal?.breed || "";
    const animalAge = request.animal?.age || "";
    const animalSize = request.animal?.size || "";
    const animalHealth = request.animal?.healthStatus || "";

    doc.text(`Nombre: ${animalName.padEnd(20, '_')} especie _____________ raza: ${animalBreed.padEnd(20, '_')}`, 15, 68);
    doc.text(`color: _________________ tamaño: ${animalSize.padEnd(20, '_')} edad: ${animalAge.padEnd(20, '_')}.`, 15, 75);
    doc.text(`Estado de salud: ${animalHealth.padEnd(100, '_')}`, 15, 82);
    doc.text(`____________________________________________________________________________________`, 15, 89);

    doc.text("El adoptante, cuyos datos figuran en este documento acepta las siguientes cláusulas del", 15, 100);
    doc.text("presente contrato de adopción:", 15, 105);

    doc.setFont("helvetica", "bold");
    doc.text("CLAUSULAS:", 15, 115);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    const clauses = [
      "1° El adoptante se compromete a mantener al adoptado en las condiciones adecuadas para su bienestar y a cumplir la normativa vigente en lo que a protección animal se refiere. Se compromete a ofrecer los cuidados que necesite el animal, alimentarlo, sacarlo de paseo (en caso de ser especie canina) tratarlo con respeto y cariño. El adoptante se compromete a llevar un control sanitario del animal proporcionándole sus vacunas pertinentes, desparasitaciones, revisiones y asistencia veterinaria en caso de contraer cualquier enfermedad o accidente.",
      "2° Si el adoptado se entregara sin esterilizar, es obligatorio y por cuenta del adoptante la esterilización del mismo, en cuanto cumpla los 6 meses si es cachorro o bien en el plazo máximo de dos meses tras la adopción si su edad es superior a los 6 meses. Bajo ningún concepto, hará criar al animal ni le utilizará para ningún fin económico.",
      "3° El adoptante consciente en facilitar las visitas de seguimiento que se le realicen, a fin de verificar si el estado del adoptado es el adecuado y el acordado en el presente contrato.",
      "4° La fundación se reserva el derecho de retirar la custodia del adoptado al adoptante si lo considera oportuno por estimar que este no está adecuadamente atendido.",
      "5° El adoptante se compromete en el caso de no estar conforme con la adopción a comunicarlo a la fundación a fin de proceder a la devolución del adoptado. En ningún caso podrá vender, regalar, abandonar, al adoptado sin que la fundación lo consienta expresamente y por escrito.",
      "6° La fundación queda libre de cualquier responsabilidad civil o penal que se pueda derivar del comportamiento del adoptado en el futuro a partir del día de la firma del presente contrato.",
      "7° El adoptado se entrega en excelentes condiciones físicas, de no ser así, solo se entrega si el adoptante acepta realizar el tratamiento que necesite, el adoptado debe ser identificado rápidamente con una placa que contenga su información: nombre, teléfono y dirección del adoptante.",
      "8° Siempre que la fundación decida recoger de nuevo al adoptado, este será entregado de buena manera por parte del adoptante, sin dañar su integridad física y psíquica.",
      "9° En el caso de que el adoptado sufra algún tipo de daño, por la presente el adoptante acepta asumir los gastos en los que la fundación deba incurrir para la recuperación del animal."
    ];

    let currentY = 122;
    clauses.forEach(clause => {
      const splitText = doc.splitTextToSize(clause, 180);
      doc.text(splitText, 15, currentY);
      currentY += (splitText.length * 4) + 2; 
    });

    doc.setFont("helvetica", "bold");
    doc.text("EL ADOPTANTE DECLARA:", 15, currentY + 3);
    doc.setFont("helvetica", "normal");
    
    let yDeclara = currentY + 9;
    doc.text("- Que está conforme con las condiciones expresadas en las cláusulas indicadas en la parte superior.", 20, yDeclara);
    doc.text("- Que las personas residentes en su domicilio están informadas e irrevocablemente de acuerdo.", 20, yDeclara + 5);
    doc.text("- Que ha sido previamente informado del estado de salud del animal, edad y características.", 20, yDeclara + 10);
    doc.text("- Que esta adopción no es un capricho o impulso, sino que está completamente convencido.", 20, yDeclara + 15);

    doc.text("Me comprometo y acepto todas las cláusulas mencionadas en este contrato", 15, yDeclara + 25);
    doc.text("SI ____   NO ____", 85, yDeclara + 32);

    doc.text("_____________________________________", 20, yDeclara + 50);
    doc.text("FIRMA DEL ADOPTANTE", 20, yDeclara + 55);
    doc.text("C.C _____________________________", 20, yDeclara + 62);

    doc.text("_____________________________________", 110, yDeclara + 50);
    doc.text("FIRMA DE QUIEN LO ENTREGA", 110, yDeclara + 55);
    doc.text("C.C _____________________________", 110, yDeclara + 62);

    window.open(doc.output('bloburl'), '_blank');
  };

  // --- PDF GENERATION: STATS REPORTS ---
  const generateStatsReport = async (type) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/adoptions/report?type=${type}`);
      const reportData = res.data;

      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(211, 84, 0); 
      doc.text("Peluditos en Apuros", 105, 20, null, null, "center");
      
      doc.setFontSize(14);
      doc.setTextColor(92, 58, 33);
      let title = "Reporte de Estadísticas";
      if (type === 'monthly') title = `Reporte Mensual - Últimos ${reportData.days} Días`;
      if (type === 'quarterly') title = `Reporte Trimestral - Últimos ${reportData.days} Días`;
      if (type === 'annual') title = `Reporte Anual - Consolidado de ${reportData.days} Días`;
      doc.text(title, 105, 30, null, null, "center");
      
      // Status metrics snapshot
      autoTable(doc, {
        startY: 40,
        head: [['Métrica de Evaluación', 'Cantidad Registrada']],
        body: [
          ['Total Nuevos Ingresos al Sistema (Registros)', reportData.periodIncomings],
          ['Adopciones 100% Finalizadas en el Periodo', reportData.periodAdoptions],
          ['Promedio de Efectividad de Adopción', reportData.periodIncomings === 0 ? "100%" : `${Math.round((reportData.periodAdoptions / reportData.periodIncomings) * 100)}%`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [243, 156, 18] }
      });

      // Show history
      doc.text("Tendencia Reciente de Adopciones Exitosas:", 14, doc.lastAutoTable.finalY + 15);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Mes del Año', 'Adopciones Consumadas']],
        body: monthlyLabels.map((m, i) => [m, monthlyValues[i]]),
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] }
      });

      doc.save(`Reporte_Fundacion_${type}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Error al armar reporte: " + e.message);
    }
  };

  // Charts
  const processData = {
    labels: monthlyLabels,
    datasets: [{ label: 'Adopciones Oficiales', data: monthlyValues, backgroundColor: '#D35400' }]
  };
  const statusData = {
    labels: ['Disponibles', 'Adoptados', 'En Proceso'],
    datasets: [{ data: [stats.available, stats.adopted, stats.process], backgroundColor: ['#F39C12', '#27AE60', '#A47B5A'] }]
  };

  return (
    <div className="container section-padding">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Dashboard {isVolunteer ? 'de Voluntariado' : 'Administrativo'}</h2>
        {!isVolunteer && (
          <>
            <div className="admin-tabs-desktop" style={{ gap: '16px', background: 'var(--color-bg-card)', padding: '8px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
              <button onClick={() => setActiveTab('overview')} className={`btn ${activeTab === 'overview' ? 'btn-mustard' : ''}`} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Resumen</button>
              <button onClick={() => setActiveTab('animals')} className={`btn ${activeTab === 'animals' ? 'btn-mustard' : ''}`} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Gestión Mascotas</button>
              <button onClick={() => setActiveTab('requests')} className={`btn ${activeTab === 'requests' ? 'btn-mustard' : ''}`} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Solicitudes</button>
              <button onClick={() => setActiveTab('volunteers')} className={`btn ${activeTab === 'volunteers' ? 'btn-mustard' : ''}`} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Pasantes</button>
            </div>
            
            <div className="admin-tabs-mobile">
              <select 
                className="input-control" 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)} 
                style={{ borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'var(--color-bg-card)', border: '2px solid var(--color-primary-light)' }}
              >
                <option value="overview">📊 Resumen de Adopciones</option>
                <option value="animals">🐕 Gestión de Mascotas</option>
                <option value="requests">📝 Revisar Solicitudes</option>
                <option value="volunteers">🧑‍🤝‍🧑 Lista de Pasantes</option>
              </select>
            </div>
          </>
        )}
      </div>

      {activeTab === 'overview' && !isVolunteer && (
        <div className="animate-fade-in">
          {/* Action Buttons for PDF Reports */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', justifyContent: 'flex-end' }}>
             <button onClick={() => generateStatsReport('monthly')} className="btn btn-secondary" style={{ padding: '8px 16px' }}><Download size={16} /> Reporte Mensual</button>
             <button onClick={() => generateStatsReport('quarterly')} className="btn btn-secondary" style={{ padding: '8px 16px' }}><Download size={16} /> Trimestral</button>
             <button onClick={() => generateStatsReport('annual')} className="btn btn-primary" style={{ padding: '8px 16px' }}><Download size={16} /> Anual</button>
          </div>

          <div className="grid-cols-3" style={{ marginBottom: '40px' }}>
            <div className="animal-card text-center" style={{ padding: '24px' }}>
              <Archive size={40} color="var(--color-mustard)" style={{ marginBottom: '16px' }} />
              <h3>{stats.available}</h3>
              <p>Disponibles</p>
            </div>
            <div className="animal-card text-center" style={{ padding: '24px' }}>
              <CheckCircle size={40} color="#27AE60" style={{ marginBottom: '16px' }} />
              <h3>{stats.adopted}</h3>
              <p>Adopciones Exitosas</p>
            </div>
            <div className="animal-card text-center" style={{ padding: '24px' }}>
              <ClipboardList size={40} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
              <h3>{stats.process}</h3>
              <p>En Proceso</p>
            </div>
          </div>
          <div className="grid-cols-2">
            <div className="animal-card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Adopciones Recientes</h3>
              <Bar data={processData} />
            </div>
            <div className="animal-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 style={{ marginBottom: '24px' }}>Estado General</h3>
              <div style={{ maxWidth: '300px', width: '100%' }}>
                <Doughnut data={statusData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'animals' && (
        <div className="animal-card animate-fade-in" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3>Inventario de Rescatados</h3>
              {isVolunteer && <p style={{ color: 'var(--color-text-light)', marginTop: '8px' }}>Hola Voluntario. Aquí puedes subir información de los perritos/gaticos para su adopción.</p>}
            </div>
            <button onClick={() => { setEditingAnimalId(null); setNewAnimal({ name: '', age: '', breed: '', size: 'Mediano', healthStatus: '', description: '', photos: '' }); setShowModal(true); }} className="btn btn-primary"><Plus size={18} /> Agregar Mascota</button>
          </div>
          
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-bg-alt)' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th>Nombre</th>
                <th>Raza</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {animals.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', color: 'var(--color-text-light)' }}>#{a.id}</td>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td>{a.breed}</td>
                  <td><span className={`status-badge status-${a.status.toLowerCase()}`} style={{ position: 'static' }}>{tr[a.status] || a.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditingAnimalId(a.id); setNewAnimal(a); setShowModal(true); }} style={{ color: 'var(--color-primary)', padding: '6px' }} title="Editar"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteAnimal(a.id)} style={{ color: 'red', padding: '6px' }} title="Eliminar"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'requests' && !isVolunteer && (
        <div className="animal-card animate-fade-in" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Gestión de Solicitudes</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-bg-alt)' }}>
                <th style={{ padding: '12px' }}>Aspirante</th>
                <th>Mascota Destino</th>
                <th>Info y Vivienda</th>
                <th>Estado</th>
                <th>Acciones / Contrato</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{r.user?.name || "Borrado"}</td>
                  <td style={{ color: 'var(--color-primary)' }}>{r.animal?.name || "Desconocido"}</td>
                  <td style={{ maxWidth: '250px', fontSize: '0.85rem' }}>
                    <div style={{ marginBottom: '4px' }}><b>Vivienda:</b> {r.housingType}</div>
                    <div style={{ marginBottom: '8px' }}><b>Exp:</b> {r.experience}</div>
                    <button onClick={() => setSelectedQuestionnaire(r)} className="btn btn-mustard" style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'fit-content' }}>🔍 Ver Valoración</button>
                  </td>
                  <td><span className={`status-badge status-${r.status.toLowerCase()}`} style={{ position: 'static', fontWeight: 'bold' }}>{tr[r.status] || r.status}</span></td>
                  <td>
                    {r.status === 'PENDING' || r.status === 'PROCESS' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleRequestStatus(r.id, 'APPROVED')} title="Aprobar" style={{ background: '#27AE60', color: '#fff', padding: '6px', borderRadius: '4px' }}><Check size={16} /></button>
                        <button onClick={() => handleRequestStatus(r.id, 'DECLINED')} title="Rechazar" style={{ background: '#E74C3C', color: '#fff', padding: '6px', borderRadius: '4px' }}><X size={16} /></button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {r.status === 'APPROVED' && (
                          <button onClick={() => generateContractPDF(r)} title="Imprimir Contrato" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }}><FileText size={14} /> Contrato</button>
                        )}
                        <button onClick={() => handleRequestStatus(r.id, 'PENDING')} title="Deshacer (Volver a Pendiente)" style={{ color: 'var(--color-mustard)', padding: '6px', cursor: 'pointer', background: 'transparent', border: 'none' }}><Undo size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'volunteers' && !isVolunteer && (
        <div className="animal-card animate-fade-in" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px' }}>Postulaciones de Nuevos Pasantes</h3>
          {volunteers.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)' }}>Actualmente no hay solicitudes de nuevos pasantes.</p>
          ) : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-bg-alt)' }}>
                  <th style={{ padding: '12px' }}>Nombre</th>
                  <th>Correo</th>
                  <th>ID Usuario</th>
                  <th>Decisión Administrativa</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{v.name}</td>
                    <td>{v.email}</td>
                    <td>#{v.id}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleVolunteerStatus(v.id, 'APPROVED')} title="Aprobar" style={{ background: '#27AE60', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Aprobar Acceso</button>
                        <button onClick={() => handleVolunteerStatus(v.id, 'REJECTED')} title="Rechazar" style={{ background: '#E74C3C', color: '#fff', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Rechazar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Basic Modal for new animal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="animal-card" style={{ width: '100%', maxWidth: '500px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>{editingAnimalId ? 'Editar Peludito' : 'Registrar Nuevo Rescatado'}</h3>
            <form onSubmit={handleSaveAnimal}>
              <div className="input-group"><label>Nombre</label><input required className="input-control" value={newAnimal.name} onChange={e => setNewAnimal({...newAnimal, name: e.target.value})} /></div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="input-group" style={{ flex: 1 }}><label>Edad</label><input required className="input-control" value={newAnimal.age} onChange={e => setNewAnimal({...newAnimal, age: e.target.value})} /></div>
                <div className="input-group" style={{ flex: 1 }}><label>Raza</label><input required className="input-control" value={newAnimal.breed} onChange={e => setNewAnimal({...newAnimal, breed: e.target.value})} /></div>
              </div>
              <div className="input-group"><label>Salud (Ej: Vacunado)</label><input required className="input-control" value={newAnimal.healthStatus} onChange={e => setNewAnimal({...newAnimal, healthStatus: e.target.value})} /></div>
              <div className="input-group">
                <label>Subir Fotografía Local (Disco C)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="input-control" 
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewAnimal({...newAnimal, photos: reader.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
                {newAnimal.photos && (
                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#27AE60', fontWeight: 'bold' }}>✓ Procesada y lista para inyectar en BD</span>
                    <br/>
                    <img src={newAnimal.photos} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '2px solid var(--color-bg-alt)' }} />
                  </div>
                )}
              </div>
              <div className="input-group"><label>Descripción</label><textarea required className="input-control" rows="3" value={newAnimal.description} onChange={e => setNewAnimal({...newAnimal, description: e.target.value})} /></div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-mustard" style={{ flex: 1 }}>Guardar Animal</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Questionnaire Details */}
      {selectedQuestionnaire && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animal-card" style={{ width: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-mustard)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Valoración Psicológica de Adopción</h3>
              <button onClick={() => setSelectedQuestionnaire(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#E74C3C" /></button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Aplicante:</strong> {selectedQuestionnaire.user?.name} <br/>
              <strong>Mascota Buscada:</strong> {selectedQuestionnaire.animal?.name} 
            </div>

            {(() => {
              try {
                const q = JSON.parse(selectedQuestionnaire.questionnaire);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'var(--color-bg-alt)', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>¿Medidas económicas/tiempo si enferma?</p>
                      <p style={{ margin: 0, color: '#333' }}>{q.q1}</p>
                    </div>
                    <div style={{ background: 'var(--color-bg-alt)', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>Horas diarias que pasará solo:</p>
                      <p style={{ margin: 0, color: '#333' }}>{q.q2}</p>
                    </div>
                    <div style={{ background: 'var(--color-bg-alt)', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>Opinión del hogar / Posibles alergias:</p>
                      <p style={{ margin: 0, color: '#333' }}>{q.q3}</p>
                    </div>
                    <div style={{ background: '#FDECEA', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #E74C3C' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0', color: '#E74C3C' }}>✓ Declaración de Concientización aceptada por este usuario.</p>
                    </div>
                  </div>
                );
              } catch (e) {
                return <p>Este usuario no completó el nuevo formato de valoración.</p>;
              }
            })()}
            
            <button onClick={() => setSelectedQuestionnaire(null)} className="btn btn-primary" style={{ marginTop: '24px', width: '100%' }}>Cerrar Valoración</button>
          </div>
        </div>
      )}
    </div>
  );
}
