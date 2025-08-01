
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Percent,
  Euro,
  Calendar,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { fetchDiscounts } from '../../api/mockApi';

const AdminPromotions = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const data = await fetchDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les promotions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (discountId) => {
    setDiscounts(discounts.map(discount => 
      discount.id === discountId 
        ? { ...discount, isActive: !discount.isActive }
        : discount
    ));
    toast({
      title: "Succès",
      description: "Statut de la promotion mis à jour",
    });
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDiscountIcon = (type) => {
    return type === 'percentage' ? Percent : Euro;
  };

  const formatDiscountValue = (discount) => {
    return discount.type === 'percentage' 
      ? `${discount.value}%` 
      : `${discount.value}€`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold mb-2">Gestion des Promotions</h1>
            <p className="text-muted-foreground">
              Créez et gérez vos codes de réduction
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Créer une promotion
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Promotions</p>
                  <p className="text-2xl font-bold">{discounts.length}</p>
                </div>
                <Percent className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actives</p>
                  <p className="text-2xl font-bold text-green-600">
                    {discounts.filter(d => d.isActive).length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-green-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactives</p>
                  <p className="text-2xl font-bold text-red-600">
                    {discounts.filter(d => !d.isActive).length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-red-600"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réduction Moy.</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {discounts.length > 0 
                      ? Math.round(discounts.filter(d => d.type === 'percentage').reduce((acc, d) => acc + d.value, 0) / discounts.filter(d => d.type === 'percentage').length || 0)
                      : 0}%
                  </p>
                </div>
                <Percent className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par code ou description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table des promotions */}
        <Card>
          <CardHeader>
            <CardTitle>
              Codes de réduction ({filteredDiscounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => {
                  const DiscountIcon = getDiscountIcon(discount.type);
                  return (
                    <TableRow key={discount.id}>
                      <TableCell className="font-mono font-medium">
                        {discount.code}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DiscountIcon className="h-4 w-4" />
                          <Badge variant="outline">
                            {discount.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-lg">
                        {formatDiscountValue(discount)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {discount.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(discount.id)}
                          >
                            {discount.isActive ? (
                              <>
                                <ToggleRight className="h-4 w-4 text-green-600" />
                                <Badge className="bg-green-100 text-green-800">
                                  Active
                                </Badge>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                <Badge variant="secondary">
                                  Inactive
                                </Badge>
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredDiscounts.length === 0 && (
              <div className="text-center py-8">
                <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  Aucune promotion trouvée
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPromotions;
