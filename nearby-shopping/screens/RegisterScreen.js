import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Platform,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';

import { COLORS } from '../assets/theme';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';
import axios from 'axios';
import { API_URL } from '../helpers/constants';

const RegisterScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const navigation = useNavigation();

	const handleRegister = () => {
		setLoading(true);
		Keyboard.dismiss();
		if (password !== confirmpassword) {
			alert('Passwords do not match');
			return;
		}

		try {
			axios
				.post(`${API_URL}/auth/register`, {
					email: email,
					password: password,
				})
				.then((response) => {
					console.log('🚀 ~ .then ~ response:', response.data);
					setLoading(false);

					alert(
						'Registration successful. Please check you email to verify your account.'
					);

					setEmail('');
					setPassword('');
					setConfirmPassword('');

					navigation.navigate(PAGES.LOGIN);
				})
				.catch((error) => {
					console.log('🚀 ~ handleRegister ~ error', error);
					setLoading(false);
				});
		} catch (error) {
			console.log('🚀 ~ handleRegister ~ error:', error);
		}
	};

	const handleLogin = () => {
		navigation.navigate(PAGES.LOGIN);
	};

	return (
		<KeyboardAvoidingView
			style={globalStyles.containerWrapper}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View style={globalStyles.container}>
				<View style={styles.formContainer}>
					<Text style={globalStyles.titleText}>Register</Text>

					<View style={{ height: 300 }}>
						<Text style={globalStyles.label}>Email</Text>
						<TextInput
							style={globalStyles.input}
							value={email}
							onChangeText={(text) => setEmail(text)}
						/>
						<Text style={globalStyles.label}>Password</Text>
						<TextInput
							style={globalStyles.input}
							secureTextEntry={true}
							value={password}
							onChangeText={(text) => setPassword(text)}
						/>
						<Text style={globalStyles.label}>Confirm Password</Text>
						<TextInput
							style={globalStyles.input}
							secureTextEntry={true}
							value={confirmpassword}
							onChangeText={(text) => setConfirmPassword(text)}
						/>
					</View>

					<TouchableOpacity
						onPress={() => handleRegister()}
						style={globalStyles.button}
					>
						<Text style={globalStyles.buttonText}>Register</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => handleLogin()}
						style={globalStyles.secondaryButton}
					>
						<Text style={globalStyles.buttonText}>Login</Text>
					</TouchableOpacity>
				</View>
			</View>
			{loading && (
				<View style={globalStyles.loader}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			)}
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	formContainer: {
		flex: 1,
		justifyContent: 'center',
	},
});

export default RegisterScreen;
