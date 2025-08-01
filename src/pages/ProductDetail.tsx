import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Share2, ArrowLeft, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import ModelViewer from '../components/common/ModelViewer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loadProduct, loading, error } = useProducts();
  const { addToCart, getItemQuantity } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | '3d'>(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
    window.scrollTo(0, 0);
  }, [id, loadProduct]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div></div>;
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
          <p className="text-muted-foreground mb-4">Ce produit n'existe pas ou n'est plus disponible.</p>
          <Button onClick={() => navigate('/catalogue')}>Retour au catalogue</Button>
        </div>
      </div>
    );
  }

  const product = currentProduct;
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({ title: `${quantity} x ${product.name} ajouté(s)`, description: "Votre panier a été mis à jour." });
    setQuantity(1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Lien copié !", description: "Le lien du produit a été copié." });
  };

  const renderStars = (rating) => (
    Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`} />)
  );

  // Fallback for missing images
  const placeholderImage = "https://via.placeholder.com/600x800.png?text=Image+Indisponible";
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(img => img || placeholderImage)
    : [product.imageUrl || placeholderImage, product.imageUrl || placeholderImage, product.imageUrl || placeholderImage];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4"><Button variant="ghost" onClick={() => navigate(-1)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button></div>
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div className="space-y-4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {/* Show both 3D model (if exists) and images as a gallery */}
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              {selectedImageIndex === '3d' && product.model3DUrl ? (
                <ModelViewer modelPath={product.model3DUrl} />
              ) : (
                <img src={productImages[selectedImageIndex] || productImages[0]} alt={product.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex space-x-2 mt-2">
              {product.model3DUrl && (
                <button
                  className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === '3d' ? 'border-accent' : 'border-transparent hover:border-muted-foreground'}`}
                  onClick={() => setSelectedImageIndex('3d')}
                  title="Voir le modèle 3D"
                >
                  <div className="w-full h-full flex items-center justify-center bg-muted text-xs font-bold">3D</div>
                </button>
              )}
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index ? 'border-accent' : 'border-transparent hover:border-muted-foreground'}`}
                  onClick={() => setSelectedImageIndex(index)}
                  title={`Image ${index + 1}`}
                >
                  <img src={image} alt={`${product.name} vue ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div className="space-y-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge>{product.brand}</Badge>
                {product.isNewProduct && <Badge className="bg-accent text-accent-foreground">Nouveau</Badge>}
                {product.isBestSeller && <Badge className="bg-primary text-primary-foreground">Best-seller</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">{renderStars(product.rating)}</div>
                <span className="text-sm text-muted-foreground">({product.rating}/5)</span>
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </div>
              <p className="text-2xl text-accent font-semibold">{product.price.toFixed(2)} TND</p>
              <div className="flex items-center space-x-2 mt-2">
                {product.stock > 0 ? (<Badge variant="default">En stock ({product.stock} restants)</Badge>) : (<Badge variant="destructive">Rupture de stock</Badge>)}
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-r-none"><Minus className="h-4 w-4" /></Button>
                  <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="rounded-l-none"><Plus className="h-4 w-4" /></Button>
                </div>
                {cartQuantity > 0 && (<span className="text-sm text-muted-foreground">({cartQuantity} dans le panier)</span>)}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1 luxury-gradient text-primary-foreground font-semibold" size="lg"><ShoppingBag className="h-5 w-5 mr-2" />Ajouter au panier</Button>
                <Button variant="outline" size="lg"><Heart className="h-5 w-5 mr-2" />Favoris</Button>
                <Button variant="outline" size="lg" onClick={handleShare}><Share2 className="h-5 w-5" /></Button>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm"><Truck className="h-4 w-4 text-accent" /><span>Livraison gratuite dès 200 TND</span></div>
              <div className="flex items-center space-x-2 text-sm"><Shield className="h-4 w-4 text-accent" /><span>Authenticité garantie</span></div>
              <div className="flex items-center space-x-2 text-sm"><RotateCcw className="h-4 w-4 text-accent" /><span>Retour sous 7 jours</span></div>
            </div>
          </motion.div>
        </div>
        <motion.div className="mt-16" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <Tabs defaultValue="description" className="w-full"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="description">Description</TabsTrigger><TabsTrigger value="notes">Notes Olfactives</TabsTrigger><TabsTrigger value="avis">Avis Clients</TabsTrigger></TabsList>
            <TabsContent value="description" className="mt-8"><Card><CardContent className="p-6"><h3 className="text-xl font-playfair font-semibold mb-4">À propos de {product.name}</h3><p className="text-muted-foreground leading-relaxed">{product.description}</p></CardContent></Card></TabsContent>
            <TabsContent value="notes" className="mt-8"><Card><CardContent className="p-6"><h3 className="text-xl font-playfair font-semibold mb-6">Pyramide Olfactive</h3><div className="space-y-6"><div><h4 className="font-semibold text-accent mb-2">Notes de Tête</h4><p className="text-muted-foreground">{product.olfactoryNotes.top}</p></div><Separator /><div><h4 className="font-semibold text-accent mb-2">Notes de Cœur</h4><p className="text-muted-foreground">{product.olfactoryNotes.middle}</p></div><Separator /><div><h4 className="font-semibold text-accent mb-2">Notes de Fond</h4><p className="text-muted-foreground">{product.olfactoryNotes.base}</p></div></div></CardContent></Card></TabsContent>
            <TabsContent value="avis" className="mt-8"><Card><CardContent className="p-6"><h3 className="text-xl font-playfair font-semibold mb-4">Avis Clients</h3><div className="text-center py-8"><p className="text-muted-foreground">Les avis clients seront bientôt disponibles.</p></div></CardContent></Card></TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};
export default ProductDetail;