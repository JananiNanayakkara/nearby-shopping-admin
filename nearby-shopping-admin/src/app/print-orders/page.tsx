import React from 'react';
import Orders from '../../components/orders';

export default function PrintOrders() {
	return (
		<div>
			<h1>Orders</h1>
			<Orders isPrinting={true} />
		</div>
	);
}
