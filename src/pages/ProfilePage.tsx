// src/pages/ProfilePage.jsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderHistory from '../components/profile/OrderHistory';
import ProfileDetails from '../components/profile/ProfileDetails';
import ManageAddresses from '../components/profile/ManageAddresses';
import SecuritySettings from '../components/profile/SecuritySettings';
import { useAuth } from '../contexts/AuthContext';
import { Receipt, User, MapPin, Shield } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <header className="mb-10">
                <h1 className="text-4xl font-playfair font-bold">Mon Compte</h1>
                <p className="text-muted-foreground mt-2">Bonjour, {user?.name} ! Gérez vos informations et commandes ici.</p>
            </header>

            <Tabs defaultValue="orders" className="flex flex-col md:flex-row gap-10">
                <TabsList className="flex flex-row md:flex-col h-auto md:h-full md:w-1/4 justify-start">
                    <TabsTrigger value="orders" className="w-full justify-start gap-2"><Receipt className="h-4 w-4"/>Mes Commandes</TabsTrigger>
                    <TabsTrigger value="details" className="w-full justify-start gap-2"><User className="h-4 w-4"/>Mes Coordonnées</TabsTrigger>
                    <TabsTrigger value="addresses" className="w-full justify-start gap-2"><MapPin className="h-4 w-4"/>Mes Adresses</TabsTrigger>
                    <TabsTrigger value="security" className="w-full justify-start gap-2"><Shield className="h-4 w-4"/>Sécurité</TabsTrigger>
                </TabsList>

                <div className="w-full md:w-3/4">
                    <TabsContent value="orders"><OrderHistory /></TabsContent>
                    <TabsContent value="details"><ProfileDetails /></TabsContent>
                    <TabsContent value="addresses"><ManageAddresses /></TabsContent>
                    <TabsContent value="security"><SecuritySettings /></TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default ProfilePage;