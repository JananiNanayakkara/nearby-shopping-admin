import {
	View,
	Text,
	TextInput,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
} from 'react-native';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';

import { useProductStore } from '../../stores/productStore';
import { useFocusEffect, useRouter } from 'expo-router';
import Fab from '../../components/FAB';
import getAxios from '../../utils/axiosConfig';
import { useAuth } from '../../context/auth';
import Loader from '../../components/Loader';

const products = () => {
	const { products, setSelectedProduct, resetProducts, addProduct } =
		useProductStore();
	const router = useRouter();
	const [filteredProducts, setFilteredProducts] = React.useState(null);
	const { user } = useAuth();
	const [loading, setLoading] = React.useState(false);

	const searchProduct = (text: string) => {
		const _text = text.trim();
		const search_terms = _text.split(' ');
		const filtered = products.filter((product) => {
			let found = false;
			search_terms.forEach((term) => {
				if (
					product.productName.toLowerCase().includes(term.toLowerCase()) ||
					product.description.toLowerCase().includes(term.toLowerCase()) ||
					product.price.toString().includes(term) ||
					product.nearestCity.toLowerCase().includes(term.toLowerCase())
				) {
					found = true;
				}
			});
			return found;
		});
		setFilteredProducts(filtered);

		if (_text === '') {
			setFilteredProducts(products);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			getProducts();
		}, [])
	);

	async function getProducts() {
		setLoading(true);
		try {
			const { data } = await getAxios(user?.token ?? '').get('/products');

			if (data) {
				console.log('🚀 ~ getProducts ~ data:', data);
				resetProducts();
				data.forEach((product) => {
					addProduct(product);
				});
			}

			setFilteredProducts(products);
		} catch (error) {
			console.log('🚀 ~ error:', error);
		} finally {
			setLoading(false);
		}
	}

	return !loading ? (
		<View className="flex-1 px-8">
			<StatusBar style="dark" />
			<TextInput
				className="px-8 py-4 absolute top-8 left-0 right-0 z-10 mx-8 rounded-full bg-white shadow-lg"
				placeholder="What are you looking for?"
				returnKeyType="search"
				onChangeText={searchProduct}
			/>
			<Fab />

			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={false}
						onRefresh={() => {
							getProducts();
						}}
					/>
				}
				contentContainerStyle={{
					top: 100,
					paddingBottom: 100,
				}}
				showsVerticalScrollIndicator={false}
			>
				{filteredProducts?.map((product, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => {
							setSelectedProduct(product);
							router.push('/product-details');
						}}
					>
						<View className="bg-white border border-indigo-400 rounded-lg p-4 my-2">
							<Text className="text-2xl font-bold">{product.productName}</Text>
							<Text className="text-lg text-gray-400">
								{product.description}
							</Text>
							<View className="flex flex-row gap-2 items-center">
								<Text className="text-lg">
									{'💰'} Rs: {product.price.toFixed(2)}
								</Text>
							</View>
							<View className="flex flex-row gap-2 items-center">
								<Text className="text-lg">
									{'📍'} {product.nearestCity}
								</Text>
							</View>
							<View className="flex flex-row gap-2 items-center">
								<Text className="text-lg">
									{'📞'} {product.phone ?? 'No Phone number ☹️'}
								</Text>
							</View>
							{product.isInStock ? null : (
								<Text className="text-sm text-red-500">
									This product is out of stock. Please check back later.
								</Text>
							)}
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	) : (
		<Loader />
	);
};

export default products;
