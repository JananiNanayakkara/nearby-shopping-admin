import React from 'react';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from '../../components/ui/breadcrumb';
import { HomeIcon } from '@radix-ui/react-icons';

export default function Dashboard() {
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
				</BreadcrumbList>
			</Breadcrumb>
			<h1 className="text-3xl">Dashboard</h1>
			<div className="flex justify-between items-center gap-4">
				<div className="flex gap-4">
					<Button>
						<Link href="/users">User management</Link>
					</Button>
					<Button>
						<Link href="/products">Products management</Link>
					</Button>
					<Button>
						<Link href="/orders">Order management</Link>
					</Button>
				</div>
				<Button variant="destructive">
					<Link href="/sign-out">Sign Out</Link>
				</Button>
			</div>
			<div className="grid grid-cols-3 gap-4"></div>
		</div>
	);
}
