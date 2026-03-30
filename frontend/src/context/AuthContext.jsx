import React, { createContext, useState, useContext } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Inicialmente simularemos que un "Adoptante" ha iniciado sesión
  // Puedes cambiar esto a null o MOCK_USERS.admin para probar diferentes vistas
  const [user, setUser] = useState(MOCK_USERS.adopter);

  const loginAsAdmin = () => setUser(MOCK_USERS.admin);
  const loginAsAdopter = () => setUser(MOCK_USERS.adopter);
  const logout = () => setUser(null);

  const isAdmin = user?.role === 'ADMIN';
  const isAdopter = user?.role === 'ADOPTER';

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAdopter, loginAsAdmin, loginAsAdopter, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
