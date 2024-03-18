import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useProductStore } from '../../stores/productStore';
import useCartStore from '../../stores/cartStore';
import { Rating } from 'react-native-ratings';
import { useAuth } from '../../context/auth';

const ProductDetails = () => {
	const { selectedProduct } = useProductStore();
	const { addToCart } = useCartStore();
	const { user } = useAuth();

	const onAddToCart = () => {
		addToCart(selectedProduct);
		alert('Product added to cart');
	};

	const onDelete = () => {
		alert('Product deleted');
	};

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				padding: 30,
				justifyContent: 'space-between',
			}}
		>
			<View>
				<Text className="text-2xl font-bold">
					{selectedProduct.productName}
				</Text>
				<Text className="text-lg">{selectedProduct.description}</Text>
				<Text>Rating: {selectedProduct.rating ?? 0}</Text>

				<Text className="text-lg mt-4">Price: {selectedProduct.price}</Text>
				<Text className="text-lg">
					In Stock: {selectedProduct?.isInStock ? 'Yes' : 'No'}
				</Text>
				<Text className="text-lg">Address: {selectedProduct.nearestCity}</Text>

				<View className="mt-4">
					<Rating
						style={{
							paddingVertical: 10,
							backgroundColor: 'transparent',
						}}
						type="star"
						ratingCount={5}
						startingValue={selectedProduct.rating}
						imageSize={40}
						fractions={0}
					/>
				</View>
			</View>
			{user.id !== selectedProduct.userId ? (
				<TouchableOpacity className="button" onPress={onAddToCart}>
					<Text className="button-text">Add to cart</Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					className="bg-red-700 py-4 px-4 rounded"
					onPress={onDelete}
				>
					<Text className="button-text">Delete product</Text>
				</TouchableOpacity>
			)}
		</ScrollView>
	);
};

export default ProductDetails;
