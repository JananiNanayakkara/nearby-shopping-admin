import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useProductStore } from '../../stores/productStore';
import useCartStore from '../../stores/cartStore';

const ProductDetails = () => {
	const { selectedProduct } = useProductStore();
	const { addToCart } = useCartStore();

	const onAddToCart = () => {
		addToCart(selectedProduct);
		alert('Product added to cart');
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
				<Text className="text-lg mt-4">Price: {selectedProduct.price}</Text>

				<Text className="text-lg mt-4">
					In Stock: {selectedProduct?.isInStock ? 'Yes' : 'No'}
				</Text>
				<Text className="mt-4">Address: {selectedProduct.nearestCity}</Text>
			</View>
			<TouchableOpacity className="button" onPress={onAddToCart}>
				<Text className="button-text">Add to cart</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

export default ProductDetails;
