import React from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import Orders from '../../components/orders';
import { DownloadIcon, HomeIcon } from '@radix-ui/react-icons';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

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
			<div className="flex flex-row justify-between">
				<h1 className="text-3xl">Orders</h1>
				<Button variant="outline">
					<Link href="/print-orders">
						<div className="flex gap-2">
							<DownloadIcon className="w-4 h-4" />
							Print
						</div>
					</Link>
				</Button>
			</div>
			<Orders />
		</div>
	);
}
