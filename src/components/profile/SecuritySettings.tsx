// src/components/profile/SecuritySettings.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const securitySchema = z.object({
  currentPassword: z.string().min(1, { message: "Le mot de passe actuel est requis." }),
  newPassword: z.string().min(6, { message: "Le nouveau mot de passe doit comporter au moins 6 caractères." }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"], // path to the field that gets the error
});

const SecuritySettings = () => {
    const form = useForm({
        resolver: zodResolver(securitySchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    const onSubmit = (values) => {
        // In a real app, you would call an API endpoint here.
        console.log("Password change submitted:", values);
        toast({
            title: "Simulation réussie",
            description: "Dans une vraie application, votre mot de passe serait changé.",
        });
        form.reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Changez votre mot de passe ici.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField name="currentPassword" control={form.control} render={({ field }) => (<FormItem><FormLabel>Mot de passe actuel</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="newPassword" control={form.control} render={({ field }) => (<FormItem><FormLabel>Nouveau mot de passe</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField name="confirmPassword" control={form.control} render={({ field }) => (<FormItem><FormLabel>Confirmer le nouveau mot de passe</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="submit">Changer le mot de passe</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default SecuritySettings;