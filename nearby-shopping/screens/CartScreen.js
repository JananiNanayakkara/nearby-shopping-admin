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
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, SIZES } from '../assets/theme';
import { db, auth } from '../firebase-config';
import { PAGES } from '../assets/constants';
import useAuthStore from '../stores/authStore';
import setupAxios from '../helpers/axiosConfig';

const CartScreen = ({ navigation }) => {
	const { cart, clearCart, removeFromCart } = useCartStore();
	const [loading, setLoading] = useState(false);
	const { id, token } = useAuthStore();

	const axios = setupAxios(token);

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

		const productIds = getProducts();

		try {
			const order = {
				products: productIds,
				userId: id,
				status: 'pending',
				total_price: cart.reduce((acc, product) => acc + product.price, 0),
			};

			axios
				.post('/orders', order)
				.then((response) => {
					setLoading(false);
					clearCart();
					navigation.navigate(PAGES.ORDER_HISTORY);
				})
				.catch((error) => {
					setLoading(false);
					console.log(error);
				});
		} catch (error) {
			console.log('🚀 ~ placeOrder ~ error:', error);
		}
	};

	const getProducts = () => {
		const productIds = cart.map((product) => product.id);
		return productIds;
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
