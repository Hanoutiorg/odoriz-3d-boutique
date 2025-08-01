// src/components/profile/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchOrdersByUserId } from '../../api/mockApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrdersByUserId(user.id)
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) return <p>Chargement des commandes...</p>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historique des Commandes</CardTitle>
                <CardDescription>Retrouvez ici toutes vos commandes passées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">Commande #{order.id}</h3>
                                <Badge>{order.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Date : {new Date(order.date).toLocaleDateString('fr-FR')}
                            </p>
                             <p className="text-sm text-muted-foreground">
                                Total : {order.total.toFixed(2)} TND
                            </p>
                            <Separator className="my-3"/>
                            <div className="space-y-1 text-sm">
                                {order.items.map(item => (
                                    <p key={item.productId}>{item.productName} x{item.quantity}</p>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Vous n'avez passé aucune commande pour le moment.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderHistory;