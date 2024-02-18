import React, { useEffect } from 'react';
import { ScrollView, Text, View, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import JobCard from '../components/JobCard';
import FAB from '../components/FAB';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';
import setupAxios from '../helpers/axiosConfig';
import useAuthStore from '../stores/authStore';

const HomeScreen = () => {
	const navigation = useNavigation();
	const [serviceList, setServiceList] = React.useState([]);
	const { token } = useAuthStore();

	useEffect(() => {
		const axios = setupAxios(token);
		try {
			axios.get('/products').then((response) => {
				setServiceList(response.data);
			});
		} catch (error) {
			console.log('🚀 ~ getProducts ~ error', error);
		}
	}, [token]);

	return (
		<KeyboardAvoidingView
			behavior="padding"
			style={globalStyles.containerWrapper}
		>
			<View style={globalStyles.container}>
				<Text style={globalStyles.titleText}>Nearby Shopping</Text>

				<ScrollView showsVerticalScrollIndicator={false}>
					{serviceList.map((service) => (
						<JobCard key={service.id} service={service} />
					))}
				</ScrollView>

				<FAB onPress={() => navigation.navigate(PAGES.ADD_PRODUCT)} title="+" />
			</View>
		</KeyboardAvoidingView>
	);
};

export default HomeScreen;
