import React, { useEffect } from 'react';
import { DrawerActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen';
import CartScreen from './screens/CartScreen';
import AddProductScreen from './screens/AddProductScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import MyProductsScreen from './screens/MyProductsScreen';
import MyOrderHistoryScreen from './screens/MyOrderHistoryScreen';
import OrderRequestsScreen from './screens/OrderRequestsScreen';

import { PAGES } from './assets/constants';
import useCartStore from './stores/cartStore';
import MapScreen from './screens/MapScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const Root = ({ navigation }) => {
	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
				>
					<Icon name="bars" size={24} color="black" />
				</TouchableOpacity>
			),
			headerRight: () => (
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
					<TouchableOpacity onPress={() => navigation.navigate('Map')}>
						<Icon name="map" size={24} color="black" />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigation.navigate('Cart')}>
						<Icon name="shopping-cart" size={24} color="black" />
					</TouchableOpacity>
				</View>
			),
		});
	}, [navigation]);
	return (
		<Drawer.Navigator screenOptions={{ headerShown: false }}>
			<Drawer.Screen name={PAGES.HOME} component={HomeScreen} />
			<Drawer.Screen name={PAGES.CART} component={CartScreen} />
			<Drawer.Screen name={PAGES.ADD_PRODUCT} component={AddProductScreen} />
			<Drawer.Screen name={PAGES.MY_PRODUCTS} component={MyProductsScreen} />
			<Drawer.Screen
				name={PAGES.ORDER_HISTORY}
				component={MyOrderHistoryScreen}
			/>
			<Drawer.Screen
				name={PAGES.ORDER_REQUESTS}
				component={OrderRequestsScreen}
			/>
			<Drawer.Screen name={PAGES.MAP} component={MapScreen} />
			<Drawer.Screen name={PAGES.SETTINGS} component={SettingsScreen} />
		</Drawer.Navigator>
	);
};

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name={PAGES.LOGIN}
					component={LoginScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name={PAGES.REGISTER}
					component={RegisterScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Root"
					component={Root}
					options={{
						headerTitle: '',
						headerRight: () => (
							<View>
								<TouchableOpacity>
									<Icon name="shopping-cart" size={24} color="black" />
								</TouchableOpacity>
							</View>
						),
						headerLeft: () => (
							<TouchableOpacity>
								<Icon name="bars" size={24} color="black" />
							</TouchableOpacity>
						),
					}}
				/>
				<Stack.Screen
					name={PAGES.PRODUCT_DETAILS}
					component={ProductDetailsScreen}
					options={{
						headerTitle: '',
						headerRight: () => (
							<TouchableOpacity>
								<Icon name="shopping-cart" size={24} color="black" />
							</TouchableOpacity>
						),
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
