'use client';

import React from 'react';
import Products from '../../components/products';

export default function PrintPage() {
	return (
		<div>
			<h1>Products</h1>
			<Products isPrinting={true} />
		</div>
	);
}
