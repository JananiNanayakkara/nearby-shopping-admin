import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Pressable,
	Alert,
} from 'react-native';
import React from 'react';
import useCartStore from '../../stores/cartStore';
import getAxios from '../../utils/axiosConfig';
import { useAuth } from '../../context/auth';
import Loader from '../../components/Loader';

const cart = () => {
	const [loading, setLoading] = React.useState(false);
	const { cart, removeFromCart, clearCart } = useCartStore();
	const { user } = useAuth();

	const onCheckout = () => {
		Alert.alert(
			'Are you sure you want to checkout?',
			'You will be charged for the total amount',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => checkout() },
			],
			{ cancelable: false }
		);
	};

	const checkout = async () => {
		try {
			setLoading(true);
			const productIds = cart.map((cartItem) => {
				return { productId: cartItem.product.id, qty: cartItem.qty };
			});
			const req = {
				productIds,
				userId: user.id,
				status: 'pending',
				total_price: cart.reduce(
					(acc, cartItem) => acc + cartItem.product.price * cartItem.qty,
					0
				),
			};

			const resp = await getAxios(user?.token ?? '').post('/orders', req);

			if (resp.status === 201) {
				alert('Checkout successful');
				clearCart();
			} else {
				alert('Checkout failed');
			}
		} catch (error) {
			console.log('🚀 ~ checkout ~ error:', JSON.stringify(error));
		} finally {
			setLoading(false);
		}
	};

	return !loading ? (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				padding: 30,
				justifyContent: 'space-between',
			}}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				{cart.map((cartItem, index) => (
					<View className="my-2 border-b-2 border-indigo-400" key={index}>
						<Text className="text-2xl font-bold">
							{cartItem.product.productName}
						</Text>
						<Text className="text-lg">{cartItem.product.description}</Text>
						<Text className="text-lg">
							Price: {cartItem.product.price.toFixed(2)}
						</Text>
						<Text className="text-lg">Quantity: {cartItem.qty}</Text>

						<Pressable
							className="py-2"
							onPress={() => {
								removeFromCart(index);
								alert('Product removed from cart');
							}}
						>
							<Text className="text-red-500">Remove</Text>
						</Pressable>
					</View>
				))}
			</ScrollView>

			<View>
				<Text className="text-2xl font-bold my-4">
					Total:{' '}
					{cart
						.reduce(
							(acc, cartItem) => acc + cartItem.product.price * cartItem.qty,
							0
						)
						.toFixed(2)}
				</Text>

				<TouchableOpacity className="button" onPress={onCheckout}>
					<Text className="button-text">Checkout</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	) : (
		<Loader />
	);
};

export default cart;
