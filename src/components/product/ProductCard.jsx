import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../../contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Logique pour vue rapide - à implémenter plus tard
    toast({
      title: "Vue rapide",
      description: "Fonctionnalité bientôt disponible",
      duration: 2000,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Logique pour wishlist - à implémenter plus tard
    toast({
      title: "Liste de souhaits",
      description: "Fonctionnalité bientôt disponible",
      duration: 2000,
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'text-accent fill-accent'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <motion.div
      className="group relative bg-card rounded-lg overflow-hidden card-shadow hover:luxury-shadow transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/produit/${product.id}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.isNewProduct && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                Nouveau
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Best-seller
              </Badge>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="destructive" className="text-xs">
                Stock limité
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-xs">
                Rupture de stock
              </Badge>
            )}
          </div>

          {/* Actions rapides */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card"
              onClick={handleWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Overlay avec action principale */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
            {product.stock > 0 ? (
              <Button
                onClick={handleAddToCart}
                className="w-full luxury-gradient text-primary-foreground opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                disabled={isInCart(product.id)}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isInCart(product.id) ? 'Dans le panier' : 'Ajouter au panier'}
              </Button>
            ) : (
              <Button variant="secondary" className="w-full" disabled>
                Produit indisponible
              </Button>
            )}
          </div>
        </div>

        {/* Informations du produit */}
        <div className="p-4 space-y-3">
          {/* Marque */}
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {product.brand}
          </p>

          {/* Nom du produit */}
          <h3 className="font-playfair font-semibold text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>

          {/* Catégorie */}
          <p className="text-xs text-muted-foreground">
            {product.category}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating})
            </span>
          </div>

          {/* Prix */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-accent">
                {product.price.toFixed(2)} TND
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toFixed(2)} TND
                </p>
              )}
            </div>
            
            {/* Indicateur de stock */}
            <div className="text-right">
              {product.stock > 0 ? (
                <p className="text-xs text-green-600">
                  En stock
                </p>
              ) : (
                <p className="text-xs text-destructive">
                  Rupture
                </p>
              )}
            </div>
          </div>

          {/* Description courte */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Animation de survol pour le contour */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-accent/20 transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ProductCard;