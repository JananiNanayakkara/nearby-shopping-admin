import {
	ScrollView,
	Text,
	View,
	TouchableOpacity,
	Button,
	StyleSheet,
	ActivityIndicator,
	Alert,
} from 'react-native';
import React, { useState } from 'react';
import globalStyles from '../assets/globalStyles';
import useCartStore from '../stores/cartStore';
import JobCard from '../components/JobCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, SIZES } from '../assets/theme';
import { db, auth } from '../firebase-config';
import { PAGES } from '../assets/constants';

const CartScreen = ({ navigation }) => {
	const { cart, clearCart, removeFromCart } = useCartStore();
	const [loading, setLoading] = useState(false);

	const handlePlaceOrder = () => {
		Alert.alert(
			'Order Confirmation',
			'Are you sure you want to place this order?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => placeOrder() },
			],
			{ cancelable: false }
		);
	};

	const placeOrder = () => {
		setLoading(true);

		const products = getProducts();

		const order = {
			products: products,
			createdAt: new Date(),
			uid: auth.currentUser.uid,
			orderNumber: '',
			status: 'pending',
		};

		const orders = db.collection('orders');

		orders
			.add(order)
			.then(() => {
				alert('Order placed successfully');
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				clearCart();
				setLoading(false);
				navigation.navigate(PAGES.HOME);
			});
	};

	const getProducts = () => {
		const products = [];

		console.log(cart);
		cart.forEach((product) => {
			if (products.find((p) => p.key === product.key)) {
				const index = products.findIndex((p) => p.key === product.key);
				products[index].quantity++;
			} else {
				products.push({
					...product,
					quantity: 1,
					isShipped: false,
				});
			}
		});

		return products;
	};

	return (
		<View style={globalStyles.containerWrapper}>
			<ScrollView style={globalStyles.container}>
				<Text style={globalStyles.titleText}>Cart</Text>
				{cart.map((product, index) => (
					<View style={style.cartItemWrapper} key={index}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Text style={{ fontSize: SIZES.lg, fontWeight: 'bold' }}>
								{product.productName}
							</Text>
							<Text style={{ fontSize: SIZES.lg }}> - {product.price}</Text>
						</View>

						<TouchableOpacity
							onPress={() => {
								Alert.alert(
									'Remove Product',
									'Are you sure you want to remove this product from cart?',
									[
										{
											text: 'Cancel',
											style: 'cancel',
										},
										{ text: 'OK', onPress: () => removeFromCart(index) },
									],
									{ cancelable: false }
								);
							}}
						>
							<Icon name="trash" size={24} color="red" />
						</TouchableOpacity>
					</View>
				))}
				{cart.length > 0 && (
					<Button
						title="Clear Cart"
						onPress={() => {
							Alert.alert(
								'Clear Cart',
								'Are you sure you want to clear cart?',
								[
									{
										text: 'Cancel',
										style: 'cancel',
									},
									{ text: 'OK', onPress: () => clearCart() },
								],
								{ cancelable: false }
							);
						}}
					/>
				)}
				{cart.length === 0 && (
					<Text style={{ fontSize: SIZES.lg }}>No items in cart</Text>
				)}
			</ScrollView>

			{cart.length > 0 && (
				<View style={globalStyles.footerButtonWrapper}>
					<TouchableOpacity
						style={globalStyles.button}
						onPress={() => {
							handlePlaceOrder();
						}}
					>
						<Text style={globalStyles.buttonText}>Place Order</Text>
					</TouchableOpacity>
				</View>
			)}
			{loading && (
				<View style={globalStyles.loader}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			)}
		</View>
	);
};

const style = StyleSheet.create({
	cartItemWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 30,
		borderBottomWidth: 1,
		paddingVertical: 10,
	},
});

export default CartScreen;
