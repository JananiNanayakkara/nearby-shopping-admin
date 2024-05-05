'use client';

import React from 'react';
import { deleteProduct, getProducts } from '../app/actions';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import { TrashIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import users from './users';

export default function Products({ isPrinting }: { isPrinting?: boolean }) {
	const [products, setProducts] = React.useState([]);
	const [loading, setLoading] = React.useState(true);

	const [errorMessage, setErrorMessage] = React.useState('');

	React.useEffect(() => {
		async function fetchData() {
			await fetchProducts();
		}
		fetchData();
	}, []);

	React.useEffect(() => {
		if (isPrinting && products.length > 0) {
			window.print();
		}
	}, [isPrinting, products]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const _products = await getProducts();
			console.log('🚀 ~ fetchProducts ~ _products:', _products);
			setProducts(_products);
		} catch (error) {
			setErrorMessage('Error fetching users');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (productId: string) => {
		const _confirm = confirm('Are you sure you want to delete this product?');
		if (!_confirm) {
			return;
		}

		setLoading(true);
		try {
			await deleteProduct(productId);
			await fetchProducts();
		} catch (error) {
			setErrorMessage('Error deleting product');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <p>Loading...</p>}
			{!loading && (
				<Table>
					<TableCaption>A list of products.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>Product name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Stock?</TableHead>
							{isPrinting ?? <TableHead>Actions</TableHead>}
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.map((product: any, index) => (
							<TableRow key={product.id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{product.productName ?? '-'}</TableCell>
								<TableCell>{product.description}</TableCell>
								<TableCell>{product.nearestCity}</TableCell>
								<TableCell>{product.phone}</TableCell>
								<TableCell>{product.price.toFixed(2)}</TableCell>
								<TableCell>{product.isInStock ? 'yes' : 'no'}</TableCell>
								{isPrinting ?? (
									<TableCell>
										<Button
											variant="destructive"
											size="icon"
											onClick={() => onDelete(product.id)}
										>
											<TrashIcon />
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
