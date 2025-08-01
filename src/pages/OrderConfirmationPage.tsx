// src/pages/OrderConfirmationPage.jsx
import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If there's no order data in the state, redirect to the home page
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <motion.div
      className="container mx-auto max-w-2xl px-4 py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
      <h1 className="text-4xl font-playfair font-bold mb-2">Merci pour votre commande !</h1>
      <p className="text-muted-foreground mb-8">
        Votre commande a été passée avec succès. Vous recevrez bientôt un email de confirmation.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="font-playfair">
            Récapitulatif de la commande #{order.id}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-left space-y-4">
          <div className="space-y-2">
            {order.items.map(item => (
              <div key={item.productId} className="flex justify-between items-center">
                <span>{item.productName} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total Payé</span>
            <span>{order.total.toFixed(2)} €</span>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Livraison à :</h3>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => navigate('/')} className="mt-8 luxury-gradient text-primary-foreground">
        Retour à l'accueil
      </Button>
    </motion.div>
  );
};

export default OrderConfirmationPage;