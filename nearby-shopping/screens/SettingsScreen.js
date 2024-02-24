import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { auth } from '../firebase-config';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';
import useAuthStore from '../stores/authStore';

const SettingsScreen = ({ navigation }) => {
	const { logout } = useAuthStore();
	const handleLogout = () => {
		logout();
		navigation.navigate(PAGES.LOGIN);
	};

	return (
		<SafeAreaView style={globalStyles.containerWrapper}>
			<View style={globalStyles.container}>
				<Text style={globalStyles.titleText}>Settings</Text>
				<Button title="Logout" onPress={() => handleLogout()} />
			</View>
		</SafeAreaView>
	);
};

export default SettingsScreen;
