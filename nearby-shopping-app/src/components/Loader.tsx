import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

const Loader = () => {
	return (
		<View className="flex-1 justify-center items-center">
			<ActivityIndicator size="large" color="#6366f1" />
			<Text className="text-lg text-indigo-500">Please wait...</Text>
		</View>
	);
};

export default Loader;
