import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar glass-effect">
      <div className="container">
        <Link to="/" className="nav-brand">
          <Heart fill="var(--color-primary)" color="var(--color-primary)" />
          <span>Peluditos</span> en Apuros
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive("/")}>Inicio</Link>
          {(!user || user.role === 'ADOPTER') && (
            <Link to="/adopcion" className={isActive("/adopcion")}>Adopta</Link>
          )}
          
          {user ? (
            <>
              {(user.role === 'ADMIN' || user.role === 'VOLUNTEER') && (
                <Link to="/admin" className={isActive("/admin")}>Dashboard</Link>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-brown-dark)' }}>
                <User size={18} />
                <b>{user.name}</b>
              </div>
              <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
                <LogOut size={16} /> Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
