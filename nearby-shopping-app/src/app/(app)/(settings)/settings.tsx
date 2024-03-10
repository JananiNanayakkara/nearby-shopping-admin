import { View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAuth } from '../../../context/auth';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const settings = () => {
	const { logout, user } = useAuth();
	const router = useRouter();
	return (
		<View className="flex-1 px-8 my-8">
			<ScrollView
				contentContainerStyle={{
					flex: 1,
					justifyContent: 'space-between',
				}}
			>
				<View>
					<Text className="text-xl mb-4">hello, {user?.email}</Text>

					<TouchableOpacity
						className="bg-gray-200 py-4 px-4"
						onPress={() => {
							router.push('/order-history');
						}}
					>
						<View className="w-full flex flex-row items-center justify-between">
							<Text className="text-gray-700 text-lg">Order history</Text>
							<Ionicons name="chevron-forward" size={24} color="black" />
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						className="bg-gray-200 py-4 px-4 mt-2"
						onPress={() => {
							router.push('/order-request');
						}}
					>
						<View className="w-full flex flex-row items-center justify-between">
							<Text className="text-gray-700 text-lg">Order requests</Text>
							<Ionicons name="chevron-forward" size={24} color="black" />
						</View>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					className="bg-red-500  py-4 px-4 rounded"
					onPress={logout}
				>
					<Text className="button-text">Logout</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

export default settings;
