import { create } from 'zustand';

type AuthStore = {
	user: UserData | null;
	login: (user: UserData) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	login: (user: UserData) => set({ user: user }),
	logout: () => set({ user: null }),
}));
