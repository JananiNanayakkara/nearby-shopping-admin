import { create } from 'zustand';

const useAuthStore = create((set) => ({
	token: null,
	id: null,
	email: null,
	login: (token, id, email) =>
		set({
			token: token,
			id: id,
			email: email,
		}),
	logout: () =>
		set({
			token: null,
			id: null,
			email: null,
		}),
}));

export default useAuthStore;
