import React, { useState, useEffect } from 'react';
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
import { useProducts } from '../../contexts/ProductContext';
import { Switch } from '@/components/ui/switch';

const AdminProductForm = ({ product, onClose }) => {
  const { addProductToState, updateProductInState } = useProducts();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || '',
    price: product?.price || '',
    stock: product?.stock || '',
    images: product?.images || [product?.imageUrl || '', '', ''], // 3 images
    model3DUrl: product?.model3DUrl || '',
    description: product?.description || '',
    olfactoryNotes: { top: product?.olfactoryNotes?.top || '', middle: product?.olfactoryNotes?.middle || '', base: product?.olfactoryNotes?.base || '' },
    isNewProduct: product?.isNewProduct || false,
    isBestSeller: product?.isBestSeller || false
  });

  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [modelFile, setModelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const categories = ['Pour Homme', 'Pour Femme', 'Niche'];

  // Handle up to 3 images
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setImageFiles(prev => {
        const arr = [...prev];
        arr[index] = file;
        return arr;
      });
      setFormData(prev => {
        const images = [...prev.images];
        images[index] = tempUrl;
        return { ...prev, images };
      });
    }
  };

  const handleModelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setModelFile(file);
      setFormData(prev => ({ ...prev, model3DUrl: tempUrl }));
    }
  };

  useEffect(() => {
    return () => {
      formData.images?.forEach(img => {
        if (img && img.startsWith('blob:')) URL.revokeObjectURL(img);
      });
      if (formData.model3DUrl && formData.model3DUrl.startsWith('blob:')) URL.revokeObjectURL(formData.model3DUrl);
    };
  }, []);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let resultProduct;
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.map(img => img || ''),
        imageUrl: formData.images[0] || '', // for backward compatibility
      };
      if (product) {
        resultProduct = await updateProduct(product.id, productData);
        if (resultProduct) updateProductInState(resultProduct);
        toast({ title: "Succès", description: "Produit modifié avec succès" });
      } else {
        resultProduct = await addProduct(productData);
        if (resultProduct) addProductToState(resultProduct);
        toast({ title: "Succès", description: "Produit ajouté avec succès" });
      }
      onClose(resultProduct);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de sauvegarder le produit", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => onClose(false)}><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button>
          <h1 className="text-3xl font-playfair font-bold">{product ? 'Modifier le produit' : 'Ajouter un produit'}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card><CardHeader><CardTitle>Informations Générales</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div><Label htmlFor="name">Nom</Label><Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required/></div>
                  <div><Label htmlFor="brand">Marque</Label><Input id="brand" value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} required/></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label htmlFor="price">Prix (TND)</Label><Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} required/></div>
                    <div><Label htmlFor="stock">Stock</Label><Input id="stock" type="number" value={formData.stock} onChange={(e) => handleInputChange('stock', e.target.value)} required/></div>
                  </div>
                  <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} required/></div>
              </CardContent></Card>
              <Card><CardHeader><CardTitle>Images du produit (max 3)</CardTitle></CardHeader><CardContent className="space-y-4">
                {[0,1,2].map(idx => (
                  <div key={idx}>
                    <Label htmlFor={`image${idx}`}>Image {idx+1}</Label>
                    <Input id={`image${idx}`} type="file" accept="image/*" onChange={e => handleImageChange(e, idx)} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    {formData.images[idx] && (
                      <div className="mt-2"><img src={formData.images[idx]} alt={`Aperçu ${idx+1}`} className="w-24 h-24 object-cover rounded-md" /><p className="text-xs text-muted-foreground mt-1 truncate" title={imageFiles[idx]?.name || formData.images[idx]}>{imageFiles[idx]?.name || 'Image existante'}</p></div>
                    )}
                  </div>
                ))}
              </CardContent></Card>
              <Card><CardHeader><CardTitle>Notes Olfactives</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div><Label htmlFor="top-notes">Notes de tête</Label><Input id="top-notes" value={formData.olfactoryNotes.top} onChange={(e) => handleInputChange('olfactoryNotes.top', e.target.value)}/></div>
                  <div><Label htmlFor="middle-notes">Notes de cœur</Label><Input id="middle-notes" value={formData.olfactoryNotes.middle} onChange={(e) => handleInputChange('olfactoryNotes.middle', e.target.value)}/></div>
                  <div><Label htmlFor="base-notes">Notes de fond</Label><Input id="base-notes" value={formData.olfactoryNotes.base} onChange={(e) => handleInputChange('olfactoryNotes.base', e.target.value)}/></div>
              </CardContent></Card>
            </div>
            <div className="space-y-6">
              <Card><CardHeader><CardTitle>Catégorie & Statut</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div><Label htmlFor="category">Catégorie</Label><Select value={formData.category} onValueChange={(v) => handleInputChange('category', v)} required><SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger><SelectContent>{categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select></div>
                  <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="isNewProduct">Nouveau produit</Label><Switch id="isNewProduct" checked={formData.isNewProduct} onCheckedChange={(c) => handleInputChange('isNewProduct', c)}/></div>
                  <div className="flex items-center justify-between rounded-lg border p-3"><Label htmlFor="isBestSeller">Meilleure vente</Label><Switch id="isBestSeller" checked={formData.isBestSeller} onCheckedChange={(c) => handleInputChange('isBestSeller', c)}/></div>
              </CardContent></Card>
              <Card><CardHeader><CardTitle>Médias</CardTitle></CardHeader><CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="model3DUrl">Modèle 3D (.glb)</Label>
                    <Input id="model3DUrl" type="file" accept=".glb,.gltf" onChange={handleModelFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    <p className="text-xs text-muted-foreground mt-2 truncate" title={modelFile?.name || formData.model3DUrl}>Actuel: {modelFile?.name || formData.model3DUrl || 'Aucun'}</p>
                  </div>
              </CardContent></Card>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={() => onClose(false)} disabled={loading}><X className="h-4 w-4 mr-2" />Annuler</Button>
            <Button type="submit" disabled={loading}><Save className="h-4 w-4 mr-2" />{loading ? 'Sauvegarde...' : 'Sauvegarder'}</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
export default AdminProductForm;