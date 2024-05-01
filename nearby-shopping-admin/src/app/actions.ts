'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import getAxios from '../utils/axios';
import { API_URL } from '../utils/constants';
import { revalidatePath } from 'next/cache';

export async function login(param: any) {
	const axios = getAxios();
	const { status, data } = await axios.post('/auth/admin-login', {
		email: param.email,
		password: param.password,
	});

	if (status !== 200) {
		return null;
	}

	if (data && status === 200) {
		cookies().set('token', data.token);
		redirect('/dashboard');
	}
}

export async function logout() {
	cookies().delete('token');
	redirect('/');
}

export async function getDashboardData() {
	const axios = getAxios();
	const { status, data } = await axios.get('/dashboard');

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function getUsers() {
	const axios = getAxios();
	const { status, data } = await axios.get(`/user`);

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function deleteUser(id: string) {
	const axios = getAxios();
	const { status, data } = await axios.delete(`/users/${id}`);

	if (status !== 200) {
		return null;
	}

	revalidatePath('/users');
	return data;
}

export async function getOrders() {
	const axios = getAxios();
	const { status, data } = await axios.get('/orders');

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function getUser(id: string) {
	const axios = getAxios();
	const { status, data } = await axios.get(`/users/${id}`);

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function getOrder(id: string) {
	const axios = getAxios();
	const { status, data } = await axios.get(`/orders/${id}`);

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function updateUser(id: string, param: any) {
	const axios = getAxios();
	const { status, data } = await axios.put(`/users/${id}`, param);

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function cancelOrder(id: string) {
	const axios = getAxios();
	const { status, data } = await axios.put(`/orders/${id}/status`, {
		status: 'cancelled',
	});

	console.log('🚀 ~ cancelOrder ~ data:', data);
	if (status !== 200) {
		return null;
	}

	revalidatePath('/orders');
	return data;
}

export async function getProducts() {
	const axios = getAxios();
	const { status, data } = await axios.get('/products');

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function getProduct(id: string) {
	const axios = getAxios();
	const { status, data } = await axios.get(`/products/${id}`);

	if (status !== 200) {
		return null;
	}

	return data;
}

export async function deleteProduct(id: string) {
	const axios = getAxios();
	const { status, data } = await axios.delete(`/products/${id}`);

	if (status !== 200) {
		return null;
	}

	revalidatePath('/products');
	return data;
}
