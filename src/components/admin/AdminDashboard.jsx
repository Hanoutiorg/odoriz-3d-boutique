// src/components/admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Calendar, Eye, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchAdminStats, fetchProducts, fetchOrders } from '../../api/mockApi';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, productsData, ordersData] = await Promise.all([
          fetchAdminStats(), fetchProducts(), fetchOrders()
        ]);
        setStats(statsData); setProducts(productsData); setOrders(ordersData);
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const mainStats = [
    { title: 'Revenus Total', value: `${stats?.totalRevenue?.toLocaleString('fr-TN')} TND`, icon: TrendingUp, color: 'text-green-600', change: '+12.5%' },
    { title: 'Commandes', value: stats?.totalOrders?.toString() || '0', icon: ShoppingCart, color: 'text-blue-600', change: '+8.2%' },
    { title: 'Produits', value: products.length.toString(), icon: Package, color: 'text-purple-600', change: '+2' },
    { title: 'Nouveaux Clients', value: stats?.newCustomers?.toString() || '0', icon: Users, color: 'text-orange-600', change: '+15.3%' },
  ];

  const categoryData = products.reduce((acc, p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) { existing.value++; } 
    else { acc.push({ name: p.category, value: 1 }); }
    return acc;
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
  const topProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  
  const getStatusVariant = (status) => {
    if (status === 'Livrée') return 'success';
    if (status === 'Expédiée') return 'default';
    if (status === 'Annulée') return 'destructive';
    return 'secondary';
  };

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair font-bold">Tableau de Bord</h1>
          <Button variant="outline"><Calendar className="h-4 w-4 mr-2" />Voir rapports</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, i) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }}>
              <Card className="hover:shadow-lg transition-shadow"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{stat.title}</CardTitle><stat.icon className={`h-4 w-4 ${stat.color}`} /></CardHeader><CardContent><div className="text-2xl font-bold mb-1">{stat.value}</div><p className="text-xs text-muted-foreground">{stat.change} ce mois-ci</p></CardContent></Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Évolution des Ventes</CardTitle></CardHeader><CardContent><ChartContainer config={{ sales: { label: "Ventes", color: "hsl(var(--chart-1))" } }} className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={stats?.salesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} /><YAxis tickFormatter={(v) => `${v} TND`} /><ChartTooltip content={<ChartTooltipContent indicator="line" />} /><Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={{ fill: "var(--color-sales)" }} /></LineChart></ResponsiveContainer></ChartContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" />Répartition par Catégorie</CardTitle></CardHeader><CardContent><ChartContainer config={{ category: { label: "Catégorie" } }} className="h-[200px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{categoryData.map((e, i) => (<Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />))}</Pie><ChartTooltip content={<ChartTooltipContent hideLabel />} /></PieChart></ResponsiveContainer></ChartContainer></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center justify-between"><span className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Top Produits</span><Button asChild variant="ghost" size="sm"><Link to="/admin/produits"><Eye className="h-4 w-4 mr-2" />Voir tout</Link></Button></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {topProducts.map((p, i) => (<div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50"><div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{i + 1}</span><div><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.brand}</p></div></div><div className="text-right"><p className="font-semibold text-sm">{p.price.toFixed(2)} TND</p><p className="text-xs text-muted-foreground">★ {p.rating}</p></div></div>))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="flex items-center justify-between"><span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Commandes Récentes</span><Button asChild variant="ghost" size="sm"><Link to="/admin/commandes"><Eye className="h-4 w-4 mr-2" />Voir tout</Link></Button></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.map(o => (<div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50"><div><p className="font-medium text-sm">#{o.id}</p><p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString('fr-FR')}</p></div><div className="text-right"><p className="font-semibold text-sm">{o.total.toFixed(2)} TND</p><Badge variant={getStatusVariant(o.status)}>{o.status}</Badge></div></div>))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
export default AdminDashboard;