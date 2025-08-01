// src/components/admin/AdminPromotions.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Percent, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { fetchDiscounts } from '../../api/mockApi';

const AdminPromotions = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        setLoading(true);
        const data = await fetchDiscounts();
        setDiscounts(data);
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de charger les promotions", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadDiscounts();
  }, []);

  const handleAction = (action, code) => {
    toast({
      title: "Action Simulée",
      description: `La fonctionnalité "${action}" pour le code "${code}" sera bientôt disponible.`,
    });
  };

  const filteredDiscounts = discounts.filter(d =>
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDiscountIcon = (type) => type === 'percentage' ? Percent : Tag;
  const formatDiscountValue = (discount) => discount.type === 'percentage' ? `${discount.value}%` : `${discount.value.toFixed(2)} TND`;

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-playfair font-bold">Gestion des Promotions</h1>
            <p className="text-muted-foreground">Créez et gérez vos codes de réduction</p>
          </div>
          <Button onClick={() => handleAction("Créer une promotion", "")}><Plus className="h-4 w-4 mr-2" />Créer une promotion</Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Rechercher par code ou description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Codes de réduction ({filteredDiscounts.length})</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => {
                  const DiscountIcon = getDiscountIcon(discount.type);
                  return (
                    <TableRow key={discount.id}>
                      <TableCell className="font-mono font-medium">{discount.code}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><DiscountIcon className="h-4 w-4 text-muted-foreground" /><Badge variant="outline">{discount.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}</Badge></div></TableCell>
                      <TableCell className="font-semibold text-lg">{formatDiscountValue(discount)}</TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">{discount.description}</TableCell>
                      <TableCell><Badge variant={discount.isActive ? "success" : "secondary"}>{discount.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Modifier", discount.code)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAction("Supprimer", discount.code)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filteredDiscounts.length === 0 && (<div className="text-center py-12 text-muted-foreground"><Percent className="h-12 w-12 mx-auto mb-4" /><p>Aucune promotion trouvée.</p></div>)}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPromotions;