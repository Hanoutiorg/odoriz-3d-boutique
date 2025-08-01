// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../api/mockApi';
import { toast } from '@/hooks/use-toast';
import { Loader2, Lock } from 'lucide-react';

// Tunisian validation schema
const formSchema = z.object({
  fullName: z.string().min(3, { message: "Le nom complet doit comporter au moins 3 caractères." }),
  address: z.string().min(5, { message: "L'adresse doit comporter au moins 5 caractères." }),
  city: z.string().min(2, { message: "La ville doit comporter au moins 2 caractères." }),
  postalCode: z.string().regex(/^\d{4}$/, { message: "Le code postal tunisien doit être composé de 4 chiffres." }),
  gouvernorat: z.string().min(3, { message: "Le gouvernorat est requis." }),
  country: z.string().min(2, { message: "Le pays doit comporter au moins 2 caractères." }),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalAmount, getShippingCost, getFinalTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = getShippingCost();
  const finalTotal = getFinalTotal();

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || (user?.addresses?.[0] || {});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: defaultAddress.fullName || user?.name || '',
      address: defaultAddress.address || '',
      city: defaultAddress.city || '',
      postalCode: defaultAddress.postalCode || '',
      gouvernorat: defaultAddress.gouvernorat || '',
      country: defaultAddress.country || 'Tunisie',
    },
  });

  const onSubmit = async (values) => {
    setIsProcessing(true);
    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price, productName: item.name })),
        total: finalTotal,
        shippingAddress: values,
        status: 'En attente',
      };
      const newOrder = await createOrder(orderData);
      toast({ title: "Commande confirmée !", description: `Votre commande #${newOrder.id} a été passée avec succès.` });
      clearCart();
      navigate('/order-confirmation', { state: { order: newOrder }, replace: true });
    } catch (error) {
      toast({ title: "Erreur lors de la commande", description: "Une erreur est survenue. Veuillez réessayer.", variant: "destructive" });
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isProcessing) {
     return (
        <div className="container mx-auto text-center py-20">
            <h2 className="text-2xl font-semibold">Votre panier est vide.</h2>
            <p className="text-muted-foreground my-4">Vous ne pouvez pas procéder au paiement sans article.</p>
            <Button onClick={() => navigate('/catalogue')}>Retourner au catalogue</Button>
        </div>
     );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl lg:text-5xl font-playfair font-bold">Paiement</h1>
        <p className="text-muted-foreground mt-2 flex items-center justify-center space-x-2"><Lock className="h-4 w-4" /><span>Transaction Sécurisée</span></p>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle className="font-playfair">Adresse de livraison</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField name="fullName" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Nom complet</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="address" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Adresse (Rue, numéro)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField name="gouvernorat" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Gouvernorat</FormLabel><FormControl><Input {...field} placeholder="Ex: Tunis, Sousse, Sfax..."/></FormControl><FormMessage /></FormItem> )} />
                <div className="flex gap-4">
                    <FormField name="city" control={form.control} render={({ field }) => ( <FormItem className="flex-1"><FormLabel>Ville / Cité</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField name="postalCode" control={form.control} render={({ field }) => ( <FormItem className="w-1/3"><FormLabel>Code Postal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <FormField name="country" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Pays</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="font-playfair">Informations de paiement</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Ceci est une simulation. N'entrez pas de vraies informations.</p>
                <div className="mt-4 space-y-4">
                   <Input placeholder="Numéro de carte (ex: 4242 ...)" />
                   <div className="flex gap-4"><Input placeholder="MM/AA" /><Input placeholder="CVC" /></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="sticky top-24">
              <CardHeader><CardTitle className="font-playfair">Récapitulatif de la commande</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {items.map(item => (<div key={item.id} className="flex justify-between items-center text-sm"><div className="flex items-center gap-4"><img src={item.imageUrl} alt={item.name} className="w-12 h-16 object-cover rounded-md" /><div><p className="font-semibold">{item.name}</p><p className="text-muted-foreground">Quantité: {item.quantity}</p></div></div><p>{(item.price * item.quantity).toFixed(2)} TND</p></div>))}
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><p>Sous-total</p><p>{totalAmount.toFixed(2)} TND</p></div>
                  <div className="flex justify-between"><p>Livraison</p><p>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} TND`}</p></div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><p>Total</p><p className="text-accent">{finalTotal.toFixed(2)} TND</p></div>
                <Button type="submit" size="lg" className="w-full mt-4 luxury-gradient text-primary-foreground" disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isProcessing ? 'Traitement...' : `Payer ${finalTotal.toFixed(2)} TND`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default CheckoutPage;