import { AuthProvider } from '../context/auth';
import '../global.css';
import { Slot, Stack } from 'expo-router';

export default function Layout() {
	return (
		<AuthProvider>
			<Slot />
		</AuthProvider>
	);
}
