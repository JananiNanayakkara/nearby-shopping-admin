import { Stack } from 'expo-router';

export default function SettingsLayout() {
	return (
		<Stack
			initialRouteName="settings"
			screenOptions={{
				title: 'Settings',
			}}
		>
			<Stack.Screen
				name="order-history"
				options={{
					title: 'Order History',
				}}
			/>
			<Stack.Screen
				name="order-request"
				options={{
					title: 'Order Request',
				}}
			/>
		</Stack>
	);
}
