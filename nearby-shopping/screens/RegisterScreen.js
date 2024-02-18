import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';

import { COLORS } from '../assets/theme';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';
import axios from 'axios';
import { API_URL } from '../helpers/constants';
import useAuthStore from '../stores/authStore';

const RegisterScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { login, token } = useAuthStore();

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
					loginFn();
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

	const loginFn = () => {
		Keyboard.dismiss();
		setLoading(true);

		try {
			axios
				.post(`${API_URL}/auth/login`, {
					email: email,
					password: password,
				})
				.then((response) => {
					console.log('🚀 ~ .then ~ response:', response.data.token);
					setLoading(false);
					login(response.data.token, response.data.id, email);
					navigation.replace('Root');
				})
				.catch((error) => {
					console.log('🚀 ~ login ~ error', error);
					setLoading(false);
				});
		} catch (error) {
			console.log('🚀 ~ login ~ error:', error);
		}
	};

	return (
		<KeyboardAvoidingView
			style={globalStyles.containerWrapper}
			behavior="padding"
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
