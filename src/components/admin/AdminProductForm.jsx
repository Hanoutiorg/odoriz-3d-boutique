
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { addProduct, updateProduct } from '../../api/mockApi';

const AdminProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || '',
    price: product?.price || '',
    stock: product?.stock || '',
    imageUrl: product?.imageUrl || '',
    model3DUrl: product?.model3DUrl || '',
    description: product?.description || '',
    olfactoryNotes: {
      top: product?.olfactoryNotes?.top || '',
      middle: product?.olfactoryNotes?.middle || '',
      base: product?.olfactoryNotes?.base || ''
    },
    isNewProduct: product?.isNewProduct || false,
    isBestSeller: product?.isBestSeller || false
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Pour Homme',
    'Pour Femme',
    'Niche'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (product) {
        await updateProduct(product.id, productData);
        toast({
          title: "Succès",
          description: "Produit modifié avec succès",
        });
      } else {
        await addProduct(productData);
        toast({
          title: "Succès",
          description: "Produit ajouté avec succès",
        });
      }

      onClose(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le produit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onClose(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-playfair font-bold">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations Générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Bleu de Chanel"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="brand">Marque</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Ex: Chanel"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="125.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description détaillée du parfum..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notes olfactives */}
            <Card>
              <CardHeader>
                <CardTitle>Notes Olfactives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="top-notes">Notes de tête</Label>
                  <Input
                    id="top-notes"
                    value={formData.olfactoryNotes.top}
                    onChange={(e) => handleInputChange('olfactoryNotes.top', e.target.value)}
                    placeholder="Ex: Agrumes, Vétiver, Baies roses"
                  />
                </div>

                <div>
                  <Label htmlFor="middle-notes">Notes de cœur</Label>
                  <Input
                    id="middle-notes"
                    value={formData.olfactoryNotes.middle}
                    onChange={(e) => handleInputChange('olfactoryNotes.middle', e.target.value)}
                    placeholder="Ex: Pamplemousse, Cèdre, Labdanum"
                  />
                </div>

                <div>
                  <Label htmlFor="base-notes">Notes de fond</Label>
                  <Input
                    id="base-notes"
                    value={formData.olfactoryNotes.base}
                    onChange={(e) => handleInputChange('olfactoryNotes.base', e.target.value)}
                    placeholder="Ex: Encens, Gingembre, Bois de santal"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Médias */}
            <Card>
              <CardHeader>
                <CardTitle>Médias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">URL de l'image</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="model3DUrl">URL du modèle 3D (.glb)</Label>
                  <Input
                    id="model3DUrl"
                    value={formData.model3DUrl}
                    onChange={(e) => handleInputChange('model3DUrl', e.target.value)}
                    placeholder="/models/parfum.glb"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isNewProduct"
                    checked={formData.isNewProduct}
                    onChange={(e) => handleInputChange('isNewProduct', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isNewProduct">Nouveau produit</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={(e) => handleInputChange('isBestSeller', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isBestSeller">Meilleure vente</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onClose(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProductForm;
