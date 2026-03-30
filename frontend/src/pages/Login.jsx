import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart } from 'lucide-react';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas, verifique su información.');
    }
  };

  return (
    <div className="section-padding section-bg-alt" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="animal-card" style={{ padding: '32px' }}>
          <div className="text-center" style={{ marginBottom: '24px' }}>
            <Heart size={48} color="var(--color-primary)" />
            <h2>Iniciar Sesión</h2>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Perrito-Correo Electrónico</label>
              <input type="email" className="input-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Contraseña Huellitas</label>
              <input type="password" className="input-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-mustard" style={{ width: '100%' }}>Entrar</button>
          </form>
          <div className="text-center" style={{ marginTop: '20px' }}>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              ¿Aún no tienes cuenta? <Link to="/registro" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
