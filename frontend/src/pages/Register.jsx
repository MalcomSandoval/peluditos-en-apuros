import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

export default function Register({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error en el registro. Quizás el usuario ya exista.');
    }
  };

  return (
    <div className="section-padding section-bg-alt" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="animal-card" style={{ padding: '32px' }}>
          <div className="text-center" style={{ marginBottom: '24px' }}>
            <UserPlus size={48} color="var(--color-mustard)" />
            <h2>Crear Cuenta</h2>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nombre Completo</label>
              <input type="text" className="input-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Correo Electrónico</label>
              <input type="email" className="input-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" className="input-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-mustard" style={{ width: '100%' }}>Registrarme y Adoptar</button>
          </form>
          <div className="text-center" style={{ marginTop: '20px' }}>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Inicia Sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
