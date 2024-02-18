import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { auth } from '../firebase-config';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';

const SettingsScreen = ({ navigation }) => {
	const handleLogout = () => {
		auth.signOut().then(() => {
			console.log('Logged out');
			navigation.replace(PAGES.LOGIN);
		});
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
