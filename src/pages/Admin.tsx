
import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Percent, 
  LogOut,
  Home
} from 'lucide-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminPromotions from '../components/admin/AdminPromotions';

const Admin = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  // Redirection si non authentifié ou pas admin
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path) => location.pathname.includes(path);

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Tableau de Bord', exact: true },
    { path: '/admin/produits', icon: Package, label: 'Produits' },
    { path: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
    { path: '/admin/promotions', icon: Percent, label: 'Promotions' }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-playfair font-bold">Administration</h2>
          <p className="text-sm text-muted-foreground">Odoriz Parfums</p>
        </div>
        
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact 
              ? location.pathname === item.path
              : isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Retour au site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full text-red-600 hover:text-red-700"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/produits" element={<AdminProducts />} />
          <Route path="/commandes" element={<AdminOrders />} />
          <Route path="/promotions" element={<AdminPromotions />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
