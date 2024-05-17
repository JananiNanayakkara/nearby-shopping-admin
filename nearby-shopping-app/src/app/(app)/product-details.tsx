import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useProductStore } from '../../stores/productStore';
import useCartStore from '../../stores/cartStore';
import { Rating } from 'react-native-ratings';
import { useAuth } from '../../context/auth';
import { useRouter } from 'expo-router';

const ProductDetails = () => {
	const { selectedProduct } = useProductStore();
	const [quantity, setQuantity] = React.useState(1);
	const { addToCart } = useCartStore();
	const { user } = useAuth();

	const router = useRouter();

	const onAddToCart = () => {
		addToCart({ product: selectedProduct, qty: quantity });
		alert('Product added to cart');
	};

	const onDelete = () => {
		alert('Product deleted');
	};

	const onEdit = () => {
		router.push('/add-product');
	};

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				padding: 30,
				justifyContent: 'space-between',
			}}
		>
			<View className="flex flex-col gap-2">
				<Text className="text-2xl font-bold">
					{selectedProduct.productName}
				</Text>
				<Text className="text-lg text-gray-400">
					{selectedProduct.description}
				</Text>
				<View className="flex flex-row gap-2 items-center mt-4">
					<Text className="text-lg">
						{'💰'} Rs: {selectedProduct.price.toFixed(2)}
					</Text>
				</View>
				<View className="flex flex-row gap-2 items-center">
					<Text className="text-lg">
						{'📍'} {selectedProduct.nearestCity}
					</Text>
				</View>
				<View className="flex flex-row gap-2 items-center">
					<Text className="text-lg">
						{'📞'} {selectedProduct.phone ?? 'No Phone number ☹️'}
					</Text>
				</View>
			</View>
			{user?.id !== selectedProduct?.userId ? (
				selectedProduct?.isInStock ? (
					<TouchableOpacity className="button" onPress={onAddToCart}>
						<Text className="button-text">Add to cart</Text>
					</TouchableOpacity>
				) : (
					<View className="p-4 bg-white">
						<Text className="text-lg text-red-500 text-center">
							This product is out of stock. Please check back later.
						</Text>
					</View>
				)
			) : (
				<View className="flex flex-col gap-2">
					<TouchableOpacity className="button" onPress={onEdit}>
						<Text className="button-text">Edit product</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="bg-red-700 py-4 px-4 rounded"
						onPress={onDelete}
					>
						<Text className="button-text">Delete product</Text>
					</TouchableOpacity>
				</View>
			)}
		</ScrollView>
	);
};

export default ProductDetails;
