import React from 'react';
import { Button } from '@/components/ui/button';

const AdminProducts = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-playfair font-bold mb-8">Gestion des Produits</h1>
      <Button>Ajouter un produit</Button>
    </div>
  );
};

export default AdminProducts;