import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import globalStyles from '../assets/globalStyles';
import useAuthStore from '../stores/authStore';
import setupAxios from '../helpers/axiosConfig';

const MyProductsScreen = ({ navigation }) => {
	const [products, setProducts] = useState([]);
	const { id, token } = useAuthStore();
	const axios = setupAxios(token);

	useEffect(() => {
		loadProducts();
	}, [navigation]);

	const loadProducts = async () => {
		try {
			const response = await axios.get(`/products/user/${id}`);
			const data = response.data;
			setProducts(data);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={styles.serviceContainer}
		>
			<Text style={globalStyles.titleText}>My Products</Text>
			{products.map((service, index) => (
				<JobCard key={index} service={service} />
			))}
		</ScrollView>
	);
};

export default MyProductsScreen;

const styles = StyleSheet.create({
	serviceContainer: {
		padding: 20,
	},
});
