import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AnimalGallery from './pages/AnimalGallery';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdoptionForm from './pages/AdoptionForm';
import ContractViewer from './pages/ContractViewer';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="animate-fade-in">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/adopcion" element={<AnimalGallery />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/registro" element={<Register setUser={setUser} />} />
          
          <Route 
            path="/adopcion/:id" 
            element={user ? <AdoptionForm user={user} /> : <Navigate to="/login" />}
          />
          <Route 
            path="/contrato/:id" 
            element={user ? <ContractViewer user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user && (user.role === 'ADMIN' || user.role === 'VOLUNTEER') ? <AdminDashboard user={user} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}
