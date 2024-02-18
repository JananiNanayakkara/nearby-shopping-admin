import React, { useEffect } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	TextInput,
	KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db } from '../firebase-config';
import JobCard from '../components/JobCard';
import FAB from '../components/FAB';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';

const HomeScreen = () => {
	const navigation = useNavigation();
	const [serviceList, setServiceList] = React.useState([]);

	useEffect(() => {
		const produtcsRef = db.collection('products');

		const subscriber = produtcsRef.onSnapshot((querySnapshot) => {
			const products = [];

			querySnapshot.forEach((documentSnapshot) => {
				products.push({
					...documentSnapshot.data(),
					key: documentSnapshot.id,
				});
			});

			setServiceList(products);
		});

		return () => subscriber();
	});

	return (
		<KeyboardAvoidingView
			behavior="padding"
			style={globalStyles.containerWrapper}
		>
			<View style={globalStyles.container}>
				<Text style={globalStyles.titleText}>Nearby Shopping</Text>

				<ScrollView showsVerticalScrollIndicator={false}>
					{serviceList.map((service) => (
						<JobCard key={service.key} service={service} />
					))}
				</ScrollView>

				<FAB onPress={() => navigation.navigate(PAGES.ADD_PRODUCT)} title="+" />
			</View>
		</KeyboardAvoidingView>
	);
};

export default HomeScreen;
