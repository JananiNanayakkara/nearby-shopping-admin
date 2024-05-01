import { View, Text, Pressable, TextInput } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import getAxios from '../../utils/axiosConfig';
import { useAuth } from '../../context/auth';
import Loader from '../../components/Loader';

const register = () => {
	const { top } = useSafeAreaInsets();
	const { user } = useAuth();
	const router = useRouter();

	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');

	const [address, setAddress] = React.useState('');
	const [phone, setPhone] = React.useState('');

	const [loading, setLoading] = React.useState(false);

	const registerFn = async () => {
		setLoading(true);

		if (!email || !password || !confirmPassword || !address || !phone) {
			setLoading(false);
			alert('Please fill all fields');
			return;
		}

		if (password !== confirmPassword) {
			setLoading(false);
			alert('Passwords do not match');
			return;
		}

		try {
			const resp = await getAxios(user?.token ?? '').post('/auth/register', {
				email,
				password,
				address,
				phone,
			});

			console.log('🚀 ~ resp ~ resp:', JSON.stringify(resp));

			if (resp.data) {
				alert(
					'Registration successful. Please check your email to verify your account.'
				);

				setLoading(false);
				router.navigate('login');
			}
		} catch (error) {
			console.log('🚀 ~ registerFn ~ error:', JSON.stringify(error));
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

			<TextInput
				className="text-field my-2"
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				placeholder="Confirm Password"
				secureTextEntry
			/>

			<TextInput
				className="text-field my-2"
				value={address}
				onChangeText={setAddress}
				placeholder="Enter your address"
			/>

			<TextInput
				className="text-field my-2"
				value={phone}
				onChangeText={setPhone}
				placeholder="Enter your phone number"
			/>

			<Pressable className="button my-2" onPress={() => registerFn()}>
				<Text className="button-text">Register</Text>
			</Pressable>

			<View className="flex flex-row items-center justify-center my-4">
				<Text>Do have an account? </Text>
				<Link href="/login">
					<Text className="link">Login</Text>
				</Link>
			</View>
		</View>
	) : (
		<Loader />
	);
};

export default register;
