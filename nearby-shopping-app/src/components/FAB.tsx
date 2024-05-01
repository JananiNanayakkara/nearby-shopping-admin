import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useProductStore } from '../stores/productStore';

const Fab = () => {
	const router = useRouter();
	const { setSelectedProduct } = useProductStore();
	const onFabPress = () => {
		setSelectedProduct(null);
		router.push('/add-product');
	};

	return (
		<TouchableOpacity
			className="absolute z-10 bottom-10 right-10 rounded-full h-20 w-20 bg-indigo-500 items-center justify-center"
			onPress={onFabPress}
		>
			<Text className="text-2xl font-bold text-white">+</Text>
		</TouchableOpacity>
	);
};

export default Fab;
