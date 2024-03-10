import { useRouter, useSegments } from 'expo-router';
import * as React from 'react';
import * as Location from 'expo-location';
import { useAuthStore } from '../stores/authStore';

type AuthContextType = {
	user: UserData;
	login: (user: UserData) => void;
	logout: () => void;
};

const AuthContext = React.createContext<AuthContextType>(null);

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

export function AuthProvider({ children }: React.PropsWithChildren) {
	const rootSegments = useSegments()[0];
	const router = useRouter();
	const { login, logout, user } = useAuthStore();
	const [errorMsg, setErrorMsg] = React.useState('');

	React.useEffect(() => {
		async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}
		};

		if (user === null) {
			router.replace('/(auth)/login');
		}

		if (user) {
			router.replace('/(app)/map');
		}
	}, [user, rootSegments]);

	return (
		<AuthContext.Provider
			value={{
				user,
				login: (user) => login(user),
				logout: () => logout(),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
