import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { deleteProduct } from '../../api/mockApi'; // We only need deleteProduct here now
import { useProducts } from '../../contexts/ProductContext'; // Import the context hook
import AdminProductForm from './AdminProductForm';

const AdminProducts = () => {
  // --- STATE MANAGEMENT REFACTORED ---
  // Get all necessary data and functions from the global ProductContext
  const {
    products, // The master list for counting
    filteredProducts, // The list to display (handles search/filter results)
    loading,
    searchProductsByQuery,
    removeProductFromState
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // --- SEARCH LOGIC ---
  // This effect runs whenever the user types in the search box
  useEffect(() => {
    // We call the search function from the context, which will update the `filteredProducts` state globally
    searchProductsByQuery(searchQuery);
  }, [searchQuery, searchProductsByQuery]);


  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        // Update the global state directly for an optimistic UI update
        removeProductFromState(productId);
        toast({ title: "Succès", description: "Produit supprimé avec succès" });
      } catch (error) {
        toast({ title: "Erreur", description: "Impossible de supprimer le produit", variant: "destructive" });
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // This function is now simpler. It just closes the form.
  // The form itself is responsible for updating the global state.
  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: 'Rupture', variant: 'destructive' };
    if (stock <= 10) return { label: 'Faible', variant: 'secondary' };
    return { label: 'En stock', variant: 'success' };
  };

  // The form component is now passed the simplified close handler
  if (showForm) {
    return <AdminProductForm product={editingProduct} onClose={handleFormClose} />;
  }
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-playfair font-bold">Gestion des Produits</h1>
            <p className="text-muted-foreground">Gérez votre catalogue ({products.length} produits au total)</p>
        </div>
        <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Ajouter un produit</Button>
      </div>
      <Card>
        <CardContent className="p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Rechercher par nom ou marque..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Liste des Produits ({filteredProducts.length} affichés)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center h-24">Chargement des produits...</TableCell></TableRow>
              ) : filteredProducts.map((p) => {
                const stock = getStockStatus(p.stock);
                return (
                  <TableRow key={p.id}>
                    <TableCell><div className="flex items-center gap-3"><div><p className="font-medium">{p.name}</p><p className="text-sm text-muted-foreground">{p.brand}</p></div></div></TableCell>
                    <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                    <TableCell className="font-mono">{p.price.toFixed(2)} TND</TableCell>
                    <TableCell><Badge variant={stock.variant}>{stock.label} ({p.stock})</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/produit/${p.id}`} target="_blank"><Eye className="mr-2 h-4 w-4" />Voir la page</Link></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(p)}><Edit className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export default AdminProducts;