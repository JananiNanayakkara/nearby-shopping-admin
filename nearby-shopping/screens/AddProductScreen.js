import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	ScrollView,
	Switch,
	Text,
	TextInput,
	View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../assets/theme';
import { auth, db } from '../firebase-config';
import globalStyles from '../assets/globalStyles';
import * as Location from 'expo-location';

const AddProductScreen = ({ route }) => {
	const { service } = route?.params || {};

	const [productName, setProductName] = useState('');
	const [nearestCity, setNearestCity] = useState('');
	const [location, setLocation] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [inStock, setInStock] = useState(true);

	useEffect(() => {
		if (service) {
			setProductName(service.productName);
			setLocation(service.location);
			setPrice(service.price);
			setDescription(service.description);
			setInStock(service.inStock);
		}

		async function getLocation() {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				alert('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(
				location
					? `${location.coords.latitude}, ${location.coords.longitude}`
					: ''
			);
		}

		getLocation();
	}, [service]);

	const handleAddProduct = () => {
		Keyboard.dismiss();
		setLoading(true);
		if (
			productName === '' ||
			price === '' ||
			description === '' ||
			nearestCity === ''
		) {
			alert('Please fill in all fields');
			return;
		}

		const products = db.collection('products');

		if (service) {
			products
				.doc(service.key)
				.update({
					uid: auth.currentUser.uid,
					productName,
					location,
					price,
					description,
					inStock,
					nearestCity,
				})
				.then(() => {
					alert('Product updated');
				})
				.catch((error) => {
					console.log(error);
					alert('Error creating product');
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			products
				.add({
					uid: auth.currentUser.uid,
					productName,
					location,
					price,
					description,
					inStock,
					nearestCity,
				})
				.then(() => {
					alert('Product added');
					resetAllFields();
				})
				.catch((error) => {
					console.log(error);
					alert('Error creating product');
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	const resetAllFields = () => {
		setProductName('');
		setPrice('');
		setDescription('');
	};

	return (
		<KeyboardAvoidingView style={globalStyles.containerWrapper}>
			<ScrollView style={globalStyles.container}>
				<Text style={globalStyles.titleText}>Add Product</Text>
				<Text style={globalStyles.label}>Product Name:</Text>
				<TextInput
					style={globalStyles.input}
					value={productName}
					onChangeText={setProductName}
				/>

				<Text style={globalStyles.label}>Nearest city:</Text>
				<TextInput
					style={globalStyles.input}
					value={nearestCity}
					onChangeText={setNearestCity}
				/>

				<Text style={globalStyles.label}>Price:</Text>
				<TextInput
					style={globalStyles.input}
					value={price}
					onChangeText={setPrice}
					keyboardType="numeric"
				/>

				<Text style={globalStyles.label}>Description:</Text>
				<TextInput
					style={globalStyles.input}
					value={description}
					onChangeText={setDescription}
					multiline
				/>

				<Text style={globalStyles.label}>Is time in stock?</Text>
				<Switch
					style={{ marginBottom: 16 }}
					value={inStock}
					onValueChange={setInStock}
				/>

				<TouchableOpacity
					style={globalStyles.button}
					onPress={handleAddProduct}
				>
					{service ? (
						<Text style={globalStyles.buttonText}>Edit Product</Text>
					) : (
						<Text style={globalStyles.buttonText}>Add Product</Text>
					)}
				</TouchableOpacity>
			</ScrollView>
			{loading && (
				<View style={globalStyles.loader}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			)}
		</KeyboardAvoidingView>
	);
};

export default AddProductScreen;
