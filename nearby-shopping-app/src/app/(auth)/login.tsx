import { View, Text, TextInput, Pressable, Button } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import getAxios from '../../utils/axiosConfig';
import { useAuth } from '../../context/auth';
import Loader from '../../components/Loader';

const login = () => {
	const { top } = useSafeAreaInsets();
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const { login: LoginAction, user } = useAuth();

	const loginFn = async () => {
		setLoading(true);
		try {
			const resp = await getAxios(user?.token ?? '').post('/auth/login', {
				email,
				password,
			});
			if (resp.data) {
				LoginAction(resp.data);
				setLoading(false);
			}
		} catch (error) {
			if (error?.response?.data?.error) {
				setLoading(false);
				alert(error.response.data.error);
			}
		}
	};

	return !loading ? (
		<View
			style={{
				paddingTop: top,
			}}
			className="flex-1 justify-center px-8"
		>
			<StatusBar style="dark" />
			<Text className="text-indigo-500 text-3xl font-bold text-center my-8">
				Nearby Shopping
			</Text>
			<TextInput
				className="text-field my-2"
				value={email}
				onChangeText={setEmail}
				placeholder="Email"
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				className="text-field my-2"
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
				secureTextEntry
			/>
			<Pressable className="button my-2" onPress={() => loginFn()}>
				<Text className="button-text">Login</Text>
			</Pressable>

			<View className="flex flex-row items-center justify-center my-4">
				<Text>Don't have an account? </Text>
				<Link href="/register">
					<Text className="link">Register</Text>
				</Link>
			</View>
		</View>
	) : (
		<Loader />
	);
};

export default login;
