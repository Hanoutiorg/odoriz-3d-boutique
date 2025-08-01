import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Percent, 
  LogOut,
  Home
} from 'lucide-react';

// Import the admin components
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminPromotions from '../components/admin/AdminPromotions';

const Admin = () => {
  const { user, logout } = useAuth(); // We can remove isAuthenticated and isAdmin checks since ProtectedRoute handles it
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Tableau de Bord', exact: true },
    { path: '/admin/produits', icon: Package, label: 'Produits' },
    { path: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
    { path: '/admin/promotions', icon: Percent, label: 'Promotions' }
  ];

  // Helper to get user initials for the Avatar fallback
  const getUserInitials = (name) => {
      if (!name) return 'A';
      const nameParts = name.split(' ');
      if (nameParts.length > 1) {
          return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
  };

  return (
    // <-- FIX: Use a fixed height for the main container to enable scrolling in the content area
    <div className="min-h-screen bg-muted/40 flex">
      {/* Sidebar */}
      {/* <-- FIX: Make the sidebar a flex column with full height */}
      <aside className="w-64 bg-card border-r shadow-lg flex flex-col fixed h-full">
        {/* Header */}
        <div className="p-6">
          <Link to="/admin" className="flex items-center space-x-2">
            <h2 className="text-xl font-playfair font-bold text-gradient">Administration</h2>
          </Link>
          <p className="text-sm text-muted-foreground">Odoriz Parfums</p>
        </div>
        
        {/* Main Navigation */}
        {/* <-- FIX: Let this section grow to push the bottom content down */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer of Sidebar */}
        <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
            </div>
            <Separator className="my-2"/>
             <Link to="/">
                <Button variant="outline" className="w-full justify-start text-muted-foreground mt-2">
                <Home className="h-4 w-4 mr-2" />
                Retour au site
                </Button>
            </Link>
            <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
            >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      {/* <-- FIX: Add margin-left to offset the sidebar width and make it scrollable */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/produits" element={<AdminProducts />} />
          <Route path="/commandes" element={<AdminOrders />} />
          <Route path="/promotions" element={<AdminPromotions />} />
          {/* A catch-all route inside /admin to redirect any wrong sub-paths to the dashboard */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;