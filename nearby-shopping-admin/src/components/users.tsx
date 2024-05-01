'use client';

import React from 'react';
import { deleteUser, getUsers } from '../app/actions';
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
import { TrashIcon } from '@radix-ui/react-icons';

export default function Users() {
	const [users, setUsers] = React.useState([]);
	const [loading, setLoading] = React.useState(true);

	const [errorMessage, setErrorMessage] = React.useState('');

	React.useEffect(() => {
		async function fetchData() {
			await fetchUsers();
		}
		fetchData();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const _users = await getUsers();
			setUsers(_users);
		} catch (error) {
			setErrorMessage('Error fetching users');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (userId: string) => {
		const _confirm = confirm('Are you sure you want to delete this user?');
		if (!_confirm) {
			return;
		}

		setLoading(true);
		try {
			await deleteUser(userId);
			await fetchUsers();
		} catch (error) {
			setErrorMessage('Error deleting user');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <p>Loading...</p>}
			{!loading && (
				<Table>
					<TableCaption>A list of users.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>Username</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user: any, index) => (
							<TableRow key={user.id}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>{user.username ?? '-'}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>{user.address}</TableCell>
								<TableCell>
									<Button
										variant="destructive"
										size="icon"
										onClick={() => onDelete(user.id)}
									>
										<TrashIcon />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
