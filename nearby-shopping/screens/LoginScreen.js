import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { COLORS } from '../assets/theme';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';
import { API_URL } from '../helpers/constants';
import useAuthStore from '../stores/authStore';
import axios from 'axios';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const { login, token } = useAuthStore();

	const navigation = useNavigation();
	useEffect(() => {
		if (token) {
			navigation.replace('Root');
		}
	}, []);

	const handleLogin = () => {
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
					login(response.data.token, response.data.id, email);
					setLoading(false);
					navigation.replace('Root');
				})
				.catch((error) => {
					console.log('🚀 ~ handleLogin ~ error', error);
					setLoading(false);
				});
		} catch (error) {
			console.log('🚀 ~ handleLogin ~ error:', error);
		}
	};

	const handleRegister = () => {
		navigation.navigate(PAGES.REGISTER);
	};

	return (
		<KeyboardAvoidingView
			style={globalStyles.containerWrapper}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View style={globalStyles.container}>
				<View style={styles.formContainer}>
					<Text style={globalStyles.titleText}>Login</Text>
					<View style={{ height: 200 }}>
						<Text style={globalStyles.label}>Email</Text>
						<TextInput
							textContentType="emailAddress"
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
					</View>
					<TouchableOpacity
						onPress={() => handleLogin()}
						style={globalStyles.button}
					>
						<Text style={globalStyles.buttonText}>Login</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => handleRegister()}
						style={globalStyles.secondaryButton}
					>
						<Text style={globalStyles.buttonText}>Register</Text>
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

export default LoginScreen;
