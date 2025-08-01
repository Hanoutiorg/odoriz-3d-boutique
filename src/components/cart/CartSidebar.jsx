import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../../contexts/CartContext';
import { validateDiscountCode } from '../../api/mockApi';
import { toast } from '@/hooks/use-toast';

const CartSidebar = () => {
  const { 
    isOpen, 
    toggleCart, 
    items, 
    totalAmount, 
    totalItems,
    updateQuantity, 
    removeFromCart,
    getShippingCost,
    getFinalTotal
  } = useCart();

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);

  const shippingCost = getShippingCost();
  const finalTotal = getFinalTotal();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsLoadingDiscount(true);
    try {
      const discount = await validateDiscountCode(discountCode);
      if (discount) {
        setAppliedDiscount(discount);
        toast({
          title: "Code promo appliqué !",
          description: `${discount.description} - ${discount.value}${discount.type === 'percentage' ? '%' : '€'} de réduction`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Code promo invalide",
          description: "Ce code promo n'existe pas ou n'est plus valide",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le code promo",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoadingDiscount(false);
    }
  };

  const getDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    
    if (appliedDiscount.type === 'percentage') {
      return (totalAmount * appliedDiscount.value) / 100;
    }
    return Math.min(appliedDiscount.value, totalAmount);
  };

  const discountAmount = getDiscountAmount();
  const finalTotalWithDiscount = Math.max(0, finalTotal - discountAmount);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-playfair font-semibold">
                  Panier ({totalItems})
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
                  <p className="text-muted-foreground mb-4">
                    Découvrez notre collection de parfums de luxe
                  </p>
                  <Button onClick={toggleCart} className="luxury-gradient text-primary-foreground">
                    Continuer les achats
                  </Button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* Articles du panier */}
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex space-x-4 p-4 bg-muted/50 rounded-lg"
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                          <p className="text-sm font-semibold text-accent">
                            {item.price.toFixed(2)} €
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Code promo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code promo</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Entrez votre code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyDiscount}
                        disabled={isLoadingDiscount || !discountCode.trim()}
                        size="sm"
                      >
                        {isLoadingDiscount ? 'Vérification...' : 'Appliquer'}
                      </Button>
                    </div>
                    {appliedDiscount && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {appliedDiscount.code} appliqué
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setAppliedDiscount(null);
                            setDiscountCode('');
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer avec totaux */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{totalAmount.toFixed(2)} €</span>
                  </div>
                  
                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction ({appliedDiscount.code})</span>
                      <span>-{discountAmount.toFixed(2)} €</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Truck className="h-4 w-4" />
                      <span>Livraison</span>
                    </div>
                    <span>
                      {shippingCost === 0 ? (
                        <Badge variant="secondary" className="text-xs">Gratuite</Badge>
                      ) : (
                        `${shippingCost.toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite dès 100€ d'achat
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-accent">
                    {(appliedDiscount ? finalTotalWithDiscount : finalTotal).toFixed(2)} €
                  </span>
                </div>

                <Button className="w-full luxury-gradient text-primary-foreground font-semibold">
                  Procéder au paiement
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={toggleCart}
                >
                  Continuer les achats
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;