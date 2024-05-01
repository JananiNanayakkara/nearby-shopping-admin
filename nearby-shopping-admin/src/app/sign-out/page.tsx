'use client';

import React from 'react';
import { logout } from '../actions';

export default function Page() {
	React.useEffect(() => {
		logout();
	}, []);

	return (
		<div className="h-screen flex items-center justify-center">
			<h1 className="text-2xl">Signing out...</h1>
		</div>
	);
}
