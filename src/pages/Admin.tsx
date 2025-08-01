import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';
import AdminProducts from '../components/admin/AdminProducts.jsx';
import AdminOrders from '../components/admin/AdminOrders.jsx';

const Admin = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Redirection si non authentifié ou pas admin
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/produits" element={<AdminProducts />} />
        <Route path="/commandes" element={<AdminOrders />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default Admin;