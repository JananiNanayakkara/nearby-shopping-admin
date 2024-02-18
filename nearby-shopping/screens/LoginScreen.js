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
import { auth } from '../firebase-config';
import { useNavigation } from '@react-navigation/core';
import { COLORS } from '../assets/theme';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const navigation = useNavigation();
	useEffect(() => {
		const uns = auth.onAuthStateChanged((user) => {
			if (user) {
				navigation.replace('Root');
			} else {
				console.log('Logged out');
			}
		});

		return uns;
	}, []);

	const handleLogin = () => {
		Keyboard.dismiss();
		setLoading(true);

		auth
			.signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log('Logged in with:', user.email);
			})
			.catch((error) => {
				alert('Error logging in:', error);
			})
			.finally(() => {
				setLoading(false);
			});
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
