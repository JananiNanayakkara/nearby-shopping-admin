'use client';

import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ButtonLoading } from './loading-button';
import { useToast } from './ui/use-toast';
import getAxios from '../utils/axios';
import { login } from '../app/actions';
const loginForm = z.object({
	email: z.string().email(),
	password: z.string().min(6, {
		message: 'Password must be at least 6 characters',
	}),
});

export default function Login() {
	const [loading, setLoading] = React.useState(false);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof loginForm>>({
		resolver: zodResolver(loginForm),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (formData: z.infer<typeof loginForm>) => {
		setLoading(true);
		try {
			const resp = await login(formData);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An error occurred',
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-1/3">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>only admin have the access</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Your email" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											{...field}
											placeholder="Your password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>

						<div>
							{!loading ? (
								<Button type="submit" disabled={loading}>
									Login
								</Button>
							) : (
								<ButtonLoading />
							)}
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
