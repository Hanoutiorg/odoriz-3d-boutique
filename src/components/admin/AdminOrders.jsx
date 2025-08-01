// src/components/admin/AdminOrders.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchOrders, updateOrderStatus } from '../../api/mockApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchOrders();
            // Sort by most recent date
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setOrders(sortedData);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast({ title: "Erreur", description: "Impossible de charger les commandes.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            // Update the state locally for instant UI feedback, then refetch
            setOrders(prevOrders => 
                prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
            );
            toast({ title: "Statut mis à jour", description: `La commande #${orderId} est maintenant "${newStatus}".` });
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de mettre à jour le statut.", variant: "destructive" });
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Livrée': return 'success'; // You might need to add a "success" variant to your Badge component
            case 'Expédiée': return 'default';
            case 'En attente': return 'secondary';
            case 'Annulée': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Gestion des Commandes</CardTitle>
                            <CardDescription>Visualisez et gérez toutes les commandes passées sur le site.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualiser
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Commande</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Adresse</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="w-[50px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center">Chargement...</TableCell></TableRow>
                            ) : orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        <p>{order.id}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                                    </TableCell>
                                    <TableCell>{order.shippingAddress.fullName}</TableCell>
                                    
                                    {/* --- THIS IS THE FIX --- */}
                                    {/* Instead of rendering the object, render its properties */}
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                            {order.shippingAddress.address},<br />
                                            {order.shippingAddress.postalCode} {order.shippingAddress.city},<br />
                                            {order.shippingAddress.gouvernorat}
                                        </div>
                                    </TableCell>
                                    {/* --- END OF FIX --- */}

                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">{order.total.toFixed(2)} TND</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Ouvrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'En attente')}>Marquer "En attente"</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Expédiée')}>Marquer "Expédiée"</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Livrée')}>Marquer "Livrée"</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Annulée')} className="text-destructive focus:text-destructive">Annuler la commande</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AdminOrders;