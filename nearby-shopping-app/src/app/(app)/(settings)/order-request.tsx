import { View, Text, ScrollView, Pressable } from 'react-native';
import * as React from 'react';
import { useAuth } from '../../../context/auth';
import getAxios from '../../../utils/axiosConfig';
import Moment from 'moment';
import Loader from '../../../components/Loader';

const OrderRequest = () => {
	const { user } = useAuth();
	const [orders, setOrders] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			if (user) {
				try {
					const _orders = await getAxios(user.token ?? '').get(
						`/orders/seller/${user.id}`
					);

					console.log(
						'🚀 ~ fetchData ~ _orders:',
						JSON.stringify(_orders.data)
					);
					setOrders(_orders.data);
				} catch (error) {
					console.log('🚀 ~ fetchData ~ error:', error);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchData();
	}, []);

	const onUpdateOrderStatus = async (orderId: string, status: string) => {
		if (user) {
			setLoading(true);
			try {
				const _orders = await getAxios(user.token ?? '').put(
					`/orders/${orderId}/status`,
					{
						status,
					}
				);

				console.log('🚀 ~ updateOrderStatus ~ _orders:', _orders);
				setOrders(_orders.data);
			} catch (error) {
				console.log('🚀 ~ updateOrderStatus ~ error:', error);
			} finally {
				setLoading(false);
			}
		}
	};

	return !loading ? (
		<View
			style={{
				flex: 1,
				padding: 20,
			}}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				{orders.map((order) => (
					<View key={order.id} className="my-2 border-b-2 pb-2">
						<Text className="text-lg font-bold">Order ID : {order.id}</Text>
						<Text className="font-bold">Order Status : {order.status}</Text>
						<Text>
							Order Date : {Moment(order.createdAt).format('MMMM Do YYYY')}
						</Text>
						<Text>Order Total : {order.total_price.toFixed(2)}</Text>
						<Text className="mt-2 font-bold">Order Items</Text>
						<View>
							{order.items.map((item) => (
								<View key={item.id} className="my-2 border-y-[1px] py-2">
									<Text>Item name : {item.productName}</Text>
									<Text>Item description : {item.description}</Text>
									<Text>Item price : {item.price?.toFixed(2)}</Text>
								</View>
							))}
						</View>

						<View className="flex flex-row justify-between">
							{
								// Show the accept and reject button if the order status is pending
								order.status === 'pending' && (
									<>
										<Pressable
											className="bg-green-100 p-4 w-1/3"
											onPress={() => onUpdateOrderStatus(order.id, 'accepted')}
										>
											<Text className="text-green-500 text-center">Accept</Text>
										</Pressable>
										<Pressable
											className="bg-red-100 p-4 w-1/3"
											onPress={() => onUpdateOrderStatus(order.id, 'rejected')}
										>
											<Text className="text-red-500 text-center">Reject</Text>
										</Pressable>
									</>
								)
							}
							{
								// Show the cancel button if the order status is accepted
								order.status === 'accepted' && (
									<Pressable
										className="bg-red-100 p-4 w-1/3"
										onPress={() => onUpdateOrderStatus(order.id, 'cancelled')}
									>
										<Text className="text-red-500 text-center">Cancel</Text>
									</Pressable>
								)
							}
							{
								// Show the complete button if the order status is accepted
								order.status === 'accepted' && (
									<Pressable
										className="bg-green-100 p-4 w-1/3"
										onPress={() => onUpdateOrderStatus(order.id, 'completed')}
									>
										<Text className="text-green-500 text-center">Complete</Text>
									</Pressable>
								)
							}
							{
								// Show the delete button if the order status is cancelled
								order.status === 'completed' && (
									<Text className="text-green-500 text-center">
										Job completed
									</Text>
								)
							}
						</View>
					</View>
				))}
			</ScrollView>
		</View>
	) : (
		<Loader />
	);
};

export default OrderRequest;
