'use client';

import React from 'react';
import { cancelOrder, getOrders } from '../app/actions';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { CircleBackslashIcon } from '@radix-ui/react-icons';

export default function Orders({ isPrinting }: { isPrinting?: boolean }) {
	const [orders, setOrders] = React.useState([]);
	const [loading, setLoading] = React.useState(true);

	const [errorMessage, setErrorMessage] = React.useState('');

	React.useEffect(() => {
		async function fetchData() {
			await fetchOrders();
		}
		fetchData();
	}, []);

	React.useEffect(() => {
		if (isPrinting && orders.length > 0) {
			window.print();
		}
	}, [isPrinting, orders]);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const _orders = await getOrders();
			setOrders(_orders);
		} catch (error) {
			setErrorMessage('Error fetching orders');
		} finally {
			setLoading(false);
		}
	};

	const onCancel = async (orderId: string) => {
		const _confirm = confirm('Are you sure you want to cancel this order?');
		if (!_confirm) {
			return;
		}

		setLoading(true);
		try {
			await cancelOrder(orderId);
		} catch (error) {
			setErrorMessage('Error cancelling order');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <p>Loading...</p>}
			{!loading && (
				<Table>
					<TableCaption>A list of orders.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>Order #</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Buyer email</TableHead>
							{isPrinting ?? <TableHead>Actions</TableHead>}
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order: any, index) => (
							<TableRow key={order.id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.status}</TableCell>
								<TableCell>{order.total_price.toFixed(2)}</TableCell>
								<TableCell>{order.userInfo.email}</TableCell>
								{isPrinting ?? (
									<TableCell>
										<Button onClick={() => onCancel(order.id)}>
											<CircleBackslashIcon />
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
