import React from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import Orders from '../../components/orders';
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
						<BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<h1 className="text-3xl">Orders</h1>
			<Orders />
		</div>
	);
}
