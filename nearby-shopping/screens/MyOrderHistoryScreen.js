import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyles from '../assets/globalStyles';
import { db, auth } from '../firebase-config';
import { SIZES } from '../assets/theme';

const MyOrderHistoryScreen = () => {
	const [loading, setLoading] = useState(false);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		setLoading(true);
		const ordersRef = db.collection('orders');
		const sub = ordersRef
			.where('uid', '==', auth.currentUser.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setOrders([]);
					setOrders((orders) => [
						...orders,
						{
							...doc.data(),
							products: doc.data().products,
							createdAt: doc.data().createdAt,
							totalPrice: calculateTotalPrice(doc.data().products),
						},
					]);
				});
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});

		console.log(JSON.stringify(orders, null, 2));

		return () => sub;
	}, []);

	const calculateTotalPrice = (products) => {
		let total = 0;
		products.forEach((product) => {
			total += product.price * product.quantity;
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
									{product.productName} x {product.quantity}
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
