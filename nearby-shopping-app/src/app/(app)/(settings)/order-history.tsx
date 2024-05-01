import { View, Text, ScrollView } from 'react-native';
import * as React from 'react';
import { useAuth } from '../../../context/auth';
import getAxios from '../../../utils/axiosConfig';
import Moment from 'moment';
import Loader from '../../../components/Loader';

const OrderHistory = () => {
	const { user } = useAuth();
	const [orders, setOrders] = React.useState([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchData = async () => {
			if (user) {
				setLoading(true);
				try {
					const _orders = await getAxios(user.token ?? '').get(
						`/orders/user/${user.id}`
					);

					console.log(
						'🚀 ~ fetchData ~ _orders:',
						JSON.stringify(_orders.data)
					);
					setOrders(_orders.data);
				} catch (error) {
					console.log('🚀 ~ fetchData ~ error:', JSON.stringify(error));
				} finally {
					setLoading(false);
				}
			}
		};

		fetchData();
	}, []);

	return !loading ? (
		<View
			style={{
				flex: 1,
				padding: 20,
			}}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				{orders.map((order) => (
					<View key={order.id} className="my-2 p-8 bg-white">
						<Text className="text-lg font-bold">Order ID: {order.id}</Text>
						<Text className="text-lg font-bold">
							Order Status: {order.status}
						</Text>
						<Text>
							Order Date: {Moment(order.createdAt).format('MMMM Do YYYY')}
						</Text>
						<Text>Order Total: {order.total_price.toFixed(2)}</Text>
						<Text># items: {order.items.length}</Text>

						<View className="border-t-2 mt-2 border-gray-200">
							{order.items.map((item) => (
								<View key={item.id} className="py-2 border-b-2 border-gray-200">
									<Text className="text-lg font-bold">{item.productName}</Text>
									<Text>Price: {item.price.toFixed(2)}</Text>
									<Text>Quantity: {item.quantity}</Text>
									<Text>Phone: {item.phone ?? '-'}</Text>
									<Text>Address: {item.nearestCity ?? '-'}</Text>
								</View>
							))}
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	) : (
		<Loader />
	);
};

export default OrderHistory;
