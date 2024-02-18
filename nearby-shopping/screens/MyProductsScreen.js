import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import JobCard from '../components/JobCard';
import globalStyles from '../assets/globalStyles';

const MyProductsScreen = ({ navigation }) => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const subscriber = db
			.collection('products')
			.where('uid', '==', auth.currentUser.uid)
			.onSnapshot((querySnapshot) => {
				const products = [];

				querySnapshot.forEach((documentSnapshot) => {
					products.push({
						...documentSnapshot.data(),
						key: documentSnapshot.id,
					});
				});

				setProducts(products);
			});

		console.log(products);
		return () => subscriber();
	}, [navigation]);

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={styles.serviceContainer}
		>
			<Text style={globalStyles.titleText}>My Products</Text>
			{products.map((service) => (
				<JobCard key={service.key} service={service} />
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
