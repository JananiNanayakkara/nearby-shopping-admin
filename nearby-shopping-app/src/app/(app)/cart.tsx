import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Pressable,
} from 'react-native';
import React from 'react';
import useCartStore from '../../stores/cartStore';

const cart = () => {
	const { cart, removeFromCart } = useCartStore();

	const onCheckout = () => {
		alert('Checkout successful');
	};

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				padding: 30,
				justifyContent: 'space-between',
			}}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				{cart.map((product, index) => (
					<View className="my-2 border-b-2 border-indigo-400" key={index}>
						<Text className="text-2xl font-bold">{product.productName}</Text>
						<Text className="text-lg">{product.description}</Text>
						<Text className="text-lg">Price: {product.price}</Text>

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
					Total: {cart.reduce((acc, cur) => acc + cur.price, 0)}
				</Text>

				<TouchableOpacity className="button" onPress={onCheckout}>
					<Text className="button-text">Checkout</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

export default cart;
