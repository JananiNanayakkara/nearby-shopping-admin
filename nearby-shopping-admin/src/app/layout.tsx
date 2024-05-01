import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { Toaster } from '../components/ui/toaster';

const inter = FontSans({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
	title: 'Nearby Shopping Admin',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
