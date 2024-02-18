import { create } from 'zustand';

const useCartStore = create((set) => ({
	cart: [],
	addToCart: (product) =>
		set((state) => ({
			cart: [...state.cart, product],
			items: state.items + 1,
		})),
	removeFromCart: (index) =>
		set((state) => ({
			cart: state.cart.filter((_, i) => i !== index),
			items: state.items - 1,
		})),
	clearCart: () => set({ cart: [], items: 0 }),
	items: 0,
}));

export default useCartStore;
