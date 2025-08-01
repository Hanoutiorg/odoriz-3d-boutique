// src/components/profile/ProfileDetails.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().regex(/^\d{8}$/, { message: "Le numéro de téléphone doit comporter 8 chiffres." }),
});

const ProfileDetails = () => {
    const { user, updateUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone?.replace(/\s/g, '') || '', // Remove spaces for the form
        },
    });

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            // Reformat phone number before sending
            const formattedPhone = `${values.phone.slice(0, 2)} ${values.phone.slice(2, 5)} ${values.phone.slice(5, 8)}`;
            await updateUser({ ...values, phone: formattedPhone });

            toast({
                title: "Profil mis à jour",
                description: "Vos informations personnelles ont été enregistrées.",
            });
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le profil.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mes Coordonnées</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles ici.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField name="name" control={form.control} render={({ field }) => (<FormItem><FormLabel>Nom complet</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="email" control={form.control} render={({ field }) => (<FormItem><FormLabel>Adresse e-mail</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="phone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Téléphone (8 chiffres)</FormLabel><FormControl><Input placeholder="21123456" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer les modifications
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ProfileDetails;