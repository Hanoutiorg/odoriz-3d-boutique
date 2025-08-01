// src/components/profile/ManageAddresses.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const ManageAddresses = () => {
    const { user } = useAuth();
    // In a real app, you would have a dialog/modal here to add/edit addresses.
    // For this mock, we are just displaying the data.

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Mes Adresses</CardTitle>
                        <CardDescription>Gérez vos adresses de livraison.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Ajouter</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {user?.addresses?.length > 0 ? (
                    user.addresses.map(addr => (
                        <div key={addr.id} className="border p-4 rounded-lg flex justify-between items-start">
                            <div className="text-sm">
                                <p className="font-semibold">{addr.fullName}</p>
                                <p className="text-muted-foreground">{addr.address}</p>
                                <p className="text-muted-foreground">{addr.postalCode} {addr.city}</p>
                                <p className="text-muted-foreground">{addr.gouvernorat}, {addr.country}</p>
                            </div>
                            <Button variant="ghost" size="sm">Modifier</Button>
                        </div>
                    ))
                ) : (
                    <p>Vous n'avez aucune adresse enregistrée.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageAddresses;