import * as React from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Switch,
	ScrollView,
} from 'react-native';
import { ProductType } from '../../models/types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/auth';
import getAxios from '../../utils/axiosConfig';
import Loader from '../../components/Loader';
import { useProductStore } from '../../stores/productStore';
import { useRouter } from 'expo-router';

const AddProduct = () => {
	const [productName, setProductName] = React.useState('');
	const [location, setLocation] = React.useState('');
	const [price, setPrice] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [isInStock, setInStock] = React.useState(true);
	const [type, setType] = React.useState<ProductType>('Good');
	const [loading, setLoading] = React.useState(false);
	const [address, setAddress] = React.useState('');
	const [phone, setPhone] = React.useState('');

	const [errorMsg, setErrorMsg] = React.useState('');
	const [userLocation, setUserLocation] = React.useState(null);

	const { user } = useAuth();

	const { selectedProduct, setSelectedProduct } = useProductStore();
	const router = useRouter();

	React.useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setUserLocation(location);

			let address = await Location.reverseGeocodeAsync({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});

			const splitAddress = address[0].formattedAddress.split(',');
			const addressString = `${splitAddress[0]}, ${splitAddress[1]}, ${splitAddress[2]}`;
			const locationString = `${location.coords.latitude}, ${location.coords.longitude}`;

			setLocation(locationString);
			setAddress(addressString);
		})();
	}, []);

	React.useEffect(() => {
		if (selectedProduct) {
			setProductName(selectedProduct?.productName);
			setDescription(selectedProduct?.description);
			setPrice(selectedProduct?.price.toString());
			setInStock(selectedProduct?.isInStock);
			setType(selectedProduct?.type === 'Good' ? 'Good' : 'Service');
			setPhone(selectedProduct?.phone);
		}
	}, [selectedProduct]);

	const onAddProduct = async () => {
		if (productName === '') {
			setErrorMsg('Product name is required');
			return;
		}

		if (description === '') {
			setErrorMsg('Product description is required');
			return;
		}

		if (price === '') {
			setErrorMsg('Product price is required');
			return;
		}

		if (location === '') {
			setErrorMsg('Product location is required');
			return;
		}

		if (phone === '') {
			setErrorMsg('Seller phone number is required');
			return;
		}

		setLoading(true);
		try {
			let resp = null;
			if (selectedProduct) {
				resp = await getAxios(user?.token ?? '').put(
					`/products/${selectedProduct.id}`,
					{
						productName,
						description,
						price: Number(price),
						location,
						type,
						isInStock,
						nearestCity: address,
						userId: user?.id,
						phone,
					}
				);

				if (resp?.data) {
					setLoading(false);
					alert('Product added successfully');
					resetFields();
				}
			} else {
				resp = await getAxios(user?.token ?? '').post('/products', {
					productName,
					description,
					price: Number(price),
					location,
					type,
					isInStock,
					nearestCity: address,
					userId: user?.id,
					phone,
				});

				if (resp?.data) {
					setLoading(false);
					alert('Product added successfully');
					resetFields();
				}
			}
		} catch (error) {
			console.log('🚀 ~ onAddProduct ~ error:', JSON.stringify(error.response));
			if (error?.response?.data?.error) {
				setLoading(false);
				alert(error.response.data.error);
			}
		}
	};

	const resetFields = () => {
		setProductName('');
		setDescription('');
		setPrice('');
		setInStock(true);
		setType('Good');
		setPhone('');

		router.back();
	};

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				padding: 30,
				justifyContent: 'space-between',
			}}
			showsVerticalScrollIndicator={false}
		>
			{!loading ? (
				<View className="flex-1">
					{errorMsg !== '' ? (
						<View className="p-4 bg-red-500 mb-4">
							<Text className="text-xl text-white font-bold">{errorMsg}</Text>
						</View>
					) : null}
					<View>
						{/* Product Type */}
						<View className="my-2">
							<View className="flex flex-row gap-4">
								<TouchableOpacity
									className={`button w-1/3 ${
										type === 'Good' ? 'bg-indigo-500' : 'bg-gray-200'
									}`}
									onPress={() => setType('Good')}
								>
									<View className="flex flex-row items-center justify-center gap-2">
										<Ionicons name="cube" size={24} color="white" />
										<Text className="button-text">Goods</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									className={`button w-1/3 ${
										type === 'Service' ? 'bg-indigo-500' : 'bg-gray-200'
									}`}
									onPress={() => setType('Service')}
								>
									<View className="flex flex-row items-center justify-center gap-2">
										<Ionicons name="construct" size={24} color="white" />
										<Text className="button-text">Services</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>

						{/* Product Name */}
						<View className="my-2">
							<Text className="text-lg">
								{type === 'Good' ? 'Product' : 'Service'} Name
							</Text>
							<TextInput
								className="text-field"
								placeholder={`Enter ${
									type === 'Good' ? 'product' : 'service'
								} name `}
								value={productName}
								onChangeText={setProductName}
							/>
						</View>

						{/* Product Description */}
						<View className="my-2">
							<Text className="text-lg">
								{type === 'Good' ? 'Product' : 'Service'} Description
							</Text>
							<TextInput
								className="text-field"
								placeholder={`Enter ${
									type === 'Good' ? 'product' : 'service'
								} description`}
								value={description}
								onChangeText={setDescription}
							/>
						</View>

						{/* Product Price */}
						<View className="my-2">
							<Text className="text-lg">
								{type === 'Good' ? 'Product' : 'Service'} Price
							</Text>
							<TextInput
								className="text-field"
								placeholder={`Enter ${
									type === 'Good' ? 'product' : 'service'
								} price `}
								value={price}
								onChangeText={setPrice}
							/>
						</View>

						{/* Product address */}
						<View className="my-2">
							<Text className="text-lg">
								{type === 'Good' ? 'Product' : 'Service'} Address
							</Text>
							<TextInput
								className="text-field"
								placeholder={`Enter ${
									type === 'Good' ? 'product' : 'service'
								} address `}
								value={address}
								readOnly
							/>
						</View>

						{/* Product Phone */}
						<View className="my-2">
							<Text className="text-lg">Phone</Text>
							<TextInput
								className="text-field"
								placeholder="Enter phone number"
								value={phone}
								onChangeText={setPhone}
							/>
						</View>

						{/* Product Stock */}
						<View className="flex flex-row items-center">
							<Text className="text-lg">In Stock</Text>
							<Switch
								value={isInStock}
								onValueChange={(status) => setInStock(status)}
							/>
						</View>
					</View>

					<View>
						<TouchableOpacity className="button" onPress={onAddProduct}>
							<Text className="button-text">
								Save {type === 'Good' ? 'Product' : 'Service'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<Loader />
			)}
		</ScrollView>
	);
};

export default AddProduct;
