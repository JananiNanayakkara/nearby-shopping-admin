import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import React from 'react';
import { useAuth } from '../../../context/auth';
import Loader from '../../../components/Loader';
import getAxios from '../../../utils/axiosConfig';

const AccountSettings = () => {
	const [username, setUsername] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [phone, setPhone] = React.useState('');
	const [address, setAddress] = React.useState('');

	const [loading, setLoading] = React.useState(false);

	const { user } = useAuth();

	const updateFn = async () => {
		setLoading(true);
		try {
			const { data, status } = await getAxios(user?.token ?? '').put(
				`/user/${user?.id}`,
				{
					username,
					phone,
					address,
				}
			);

			alert('Profile updated successfully');
		} catch (error) {
			console.log('🚀 ~ error:', JSON.stringify(error));
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const resp = await getAxios(user?.token ?? '').get(`/user/${user?.id}`);

				setUsername(resp.data.username);
				setEmail(resp.data.email);
				setPhone(resp.data.phone);
				setAddress(resp.data.address);
			} catch (error) {
				console.log('🚀 ~ error:', error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				padding: 30,
				justifyContent: 'space-between',
			}}
			showsVerticalScrollIndicator={false}
		>
			{!loading ? (
				<View className="flex gap-4">
					<View className="flex gap-2">
						<Text className="text-lg">Email</Text>
						<TextInput className="text-field" value={email} readOnly />
					</View>

					<View className="flex gap-2">
						<Text className="text-lg">Username</Text>
						<TextInput
							className="text-field"
							placeholder="Username"
							value={username}
							onChangeText={setUsername}
						/>
					</View>

					<View className="flex gap-2">
						<Text className="text-lg">Phone</Text>
						<TextInput
							className="text-field"
							placeholder="Phone"
							value={phone}
							onChangeText={setPhone}
						/>
					</View>

					<View className="flex gap-2">
						<Text className="text-lg">Address</Text>
						<TextInput
							className="text-field"
							placeholder="Address"
							value={address}
							onChangeText={setAddress}
						/>
					</View>

					<Pressable className="button my-2" onPress={() => updateFn()}>
						<Text className="button-text">Update</Text>
					</Pressable>
				</View>
			) : (
				<Loader />
			)}
		</ScrollView>
	);
};

export default AccountSettings;
