import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import globalStyles from '../assets/globalStyles';
import useAuthStore from '../stores/authStore';
import setupAxios from '../helpers/axiosConfig';

const OrderRequestsScreen = () => {
	const { id, token } = useAuthStore();
	const axios = setupAxios(token);

	useEffect(() => {
		loadOrders();
	}, [token]);

	const loadOrders = async () => {
		try {
			const response = await axios.get(`/orders/user/${id}`);
			const data = response.data;
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={globalStyles.containerWrapper}>
			<View style={globalStyles.container}>
				<Text style={globalStyles.titleText}>Order Requests</Text>
			</View>
		</View>
	);
};

export default OrderRequestsScreen;

const styles = StyleSheet.create({});
