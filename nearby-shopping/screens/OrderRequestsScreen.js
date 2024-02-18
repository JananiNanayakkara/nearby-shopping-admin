import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import globalStyles from '../assets/globalStyles';

const OrderRequestsScreen = () => {
	return (
		<View style={globalStyles.containerWrapper}>
			<View style={globalStyles.container}>
				<Text style={globalStyles.titleText}>Order Requests</Text>
			</View>
		</View>
	);
};

export default OrderRequestsScreen;

const styles = StyleSheet.create({});
