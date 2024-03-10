import '../../global.css';
import { Stack, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useCartStore from '../../stores/cartStore';

export default function Layout() {
	const { items } = useCartStore();
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					paddingVertical: 8,
					gap: 8,
					height: 70,
				},
				tabBarActiveTintColor: '#6366f1',
			}}
		>
			<Tabs.Screen
				name="map"
				options={{
					title: 'Nearby Shopping',
					tabBarIcon: () => (
						<Ionicons name="map-sharp" size={28} color="#6366f1" />
					),
				}}
			></Tabs.Screen>
			<Tabs.Screen
				name="products"
				options={{
					title: 'Products',
					tabBarIcon: () => (
						<Ionicons name="pricetags" size={28} color="#6366f1" />
					),
				}}
			></Tabs.Screen>
			<Tabs.Screen
				name="cart"
				options={{
					title: 'Cart',
					tabBarIcon: () => <Ionicons name="cart" size={28} color="#6366f1" />,
					tabBarBadge: items,
				}}
			></Tabs.Screen>
			<Tabs.Screen
				name="(settings)"
				options={{
					title: 'Settings',
					headerShown: false,
					href: '(settings)/settings',
					tabBarIcon: () => <Ionicons name="cog" size={28} color="#6366f1" />,
				}}
			></Tabs.Screen>
			<Tabs.Screen
				name="add-product"
				options={{
					href: null,
					title: 'Add Product',
				}}
			></Tabs.Screen>
			<Tabs.Screen
				name="product-details"
				options={{
					title: 'Product Details',
					href: null,
				}}
			></Tabs.Screen>
		</Tabs>
	);
}
