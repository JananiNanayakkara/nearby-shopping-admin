import React from 'react';
import Users from '../../components/users';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import { HomeIcon } from '@radix-ui/react-icons';

export default function page() {
	return (
		<div className="max-w-7xl mx-auto px-4 mt-20 space-y-4">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							className="flex items-center gap-2"
							href="/dashboard"
						>
							<HomeIcon className="w-4 h-4" />
							Dashboard
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/users">Users</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<h1 className="text-3xl">Users</h1>
			<Users />
		</div>
	);
}
