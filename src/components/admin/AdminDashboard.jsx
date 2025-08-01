import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Package, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const stats = [
    { title: 'Revenus Total', value: '12 450 €', icon: BarChart3, color: 'text-green-600' },
    { title: 'Commandes', value: '156', icon: ShoppingCart, color: 'text-blue-600' },
    { title: 'Produits', value: '6', icon: Package, color: 'text-purple-600' },
    { title: 'Clients', value: '23', icon: Users, color: 'text-orange-600' },
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-playfair font-bold mb-8">Tableau de Bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;