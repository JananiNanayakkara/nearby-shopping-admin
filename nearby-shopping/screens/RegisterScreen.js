import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { useState } from 'react';
import { auth, db } from '../firebase-config';
import { useNavigation } from '@react-navigation/core';

import { COLORS } from '../assets/theme';
import globalStyles from '../assets/globalStyles';
import { PAGES } from '../assets/constants';

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

		auth
			.createUserWithEmailAndPassword(email, password)
			.then(() => {
				login();
			})
			.catch((error) => {
				console.log(error);
				alert('Error registering');
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleLogin = () => {
		navigation.navigate(PAGES.LOGIN);
	};

	const login = () => {
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
