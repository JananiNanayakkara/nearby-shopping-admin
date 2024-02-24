import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyles from '../assets/globalStyles';

import { SIZES } from '../assets/theme';
import useAuthStore from '../stores/authStore';
import setupAxios from '../helpers/axiosConfig';

const MyOrderHistoryScreen = () => {
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState([]);
	const { id, token } = useAuthStore();

	const axios = setupAxios(token);

	useEffect(() => {
		setLoading(true);
		getOrdersByUser();
	}, [token]);

	const getOrdersByUser = async () => {
		try {
			const response = await axios.get(`/orders/user/${id}`);
			const data = response.data;

			const orders = data.map((order) => {
				const products = order.items.data.map((product) => {
					return {
						productName: product.productName,
						price: product.price,
					};
				});
				return {
					orderNumber: order.id,
					status: order.status,
					products: products,
					totalPrice: calculateTotalPrice(order.items.data),
				};
			});
			setOrders(orders);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const calculateTotalPrice = (products) => {
		let total = 0;
		products.forEach((product) => {
			total += product.price;
		});
		return total;
	};

	return (
		<View style={globalStyles.containerWrapper}>
			<ScrollView style={globalStyles.container}>
				<Text style={globalStyles.titleText}>My Orders</Text>
				{orders.map((order, index) => (
					<View style={{ padding: 10, borderBottomWidth: 1 }} key={index}>
						<Text style={styles.orderNumberText}>
							Order # : {order.orderNumber}
						</Text>
						<Text style={globalStyles.label}>Order ststus: {order.status}</Text>

						{order.products.map((product, index) => (
							<View key={index}>
								<Text style={globalStyles.label}>
									{product.productName} x 1
								</Text>
							</View>
						))}

						<Text style={styles.price}>
							Total Price Rs: {order.totalPrice.toFixed(2)}
						</Text>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

export default MyOrderHistoryScreen;

const styles = StyleSheet.create({
	orderNumberText: {
		fontSize: SIZES.lg,
		fontWeight: 'bold',
	},
	price: {
		fontSize: SIZES.md,
		fontWeight: 'bold',
	},
});
