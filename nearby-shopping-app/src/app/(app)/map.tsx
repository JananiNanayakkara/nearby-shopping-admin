import { View, TextInput } from 'react-native';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import MapView, { MapMarker } from 'react-native-maps';
import getAxios from '../../utils/axiosConfig';
import { useAuth } from '../../context/auth';
import * as Location from 'expo-location';
import { useProductStore } from '../../stores/productStore';

import { useRouter } from 'expo-router';
import Fab from '../../components/FAB';

const map = () => {
	const mapViewRef = React.useRef(null);
	const { user } = useAuth();
	const router = useRouter();

	const { products, addProduct, resetProducts, setSelectedProduct } =
		useProductStore();

	const [filteredProducts, setFilteredProducts] = React.useState(products);

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

	const mapStyle = [
		{
			featureType: 'administrative.land_parcel',
			stylers: [
				{
					visibility: 'off',
				},
			],
		},
		{
			featureType: 'administrative.neighborhood',
			stylers: [
				{
					visibility: 'off',
				},
			],
		},
		{
			featureType: 'poi',
			elementType: 'labels.text',
			stylers: [
				{
					visibility: 'off',
				},
			],
		},
		{
			featureType: 'road',
			elementType: 'labels',
			stylers: [
				{
					visibility: 'off',
				},
			],
		},
		{
			featureType: 'water',
			elementType: 'labels.text',
			stylers: [
				{
					visibility: 'off',
				},
			],
		},
	];

	React.useEffect(() => {
		(async () => {
			try {
				const resp = await getAxios(user?.token ?? '').get('/products');
				resetProducts();
				resp.data.forEach((product) => {
					addProduct(product);
				});
			} catch (error) {
				console.log('🚀 ~ error:', error);
			}
		})();
	}, []);

	React.useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			if (mapViewRef.current) {
				mapViewRef.current.animateCamera({
					center: {
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
					},
					zoom: 15,
				});
			}
		})();
	}, []);

	return (
		<View className="flex-1">
			<StatusBar style="dark" />
			<TextInput
				className="px-8 py-4 absolute top-8 left-0 right-0 z-10 mx-8 rounded-full bg-white shadow-lg"
				placeholder="What are you looking for?"
				returnKeyType="search"
				onChangeText={searchProduct}
			/>

			<Fab />

			<MapView
				ref={mapViewRef}
				customMapStyle={mapStyle}
				style={{
					flex: 1,
				}}
				initialRegion={{
					latitude: 6.927079,
					longitude: 79.861244,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				showsUserLocation={true}
				showsMyLocationButton={false}
				showsTraffic={false}
			>
				{filteredProducts.map((product) => (
					<MapMarker
						key={product.id}
						coordinate={{
							latitude: +product.location.split(',')[0],
							longitude: +product.location.split(',')[1],
						}}
						title={product.productName}
						description={product.description}
						onCalloutPress={() => {
							setSelectedProduct(product);
							router.push('/product-details');
						}}
					/>
				))}
			</MapView>
		</View>
	);
};

export default map;
