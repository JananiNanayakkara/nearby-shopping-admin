import { create } from 'zustand';
import { CartItem } from '../models/types';

interface CartStore {
	cart: CartItem[];
	addToCart: (product: CartItem) => void;
	removeFromCart: (index: number) => void;
	clearCart: () => void;
	items: number;
}

const useCartStore = create<CartStore>((set) => ({
	cart: [],
	addToCart: (product) =>
		set((state) => {
			const existingProductIndex = state.cart.findIndex(
				(item) => item.product.id === product.product.id
			);
			if (existingProductIndex >= 0) {
				// Product already exists in the cart, increase the quantity
				const newCart = [...state.cart];
				newCart[existingProductIndex].qty += 1;
				return { cart: newCart };
			} else {
				// Product is not in the cart, add it
				return { cart: [...state.cart, product], items: state.items + 1 };
			}
		}),
	removeFromCart: (index) =>
		set((state) => {
			const newCart = [...state.cart];
			newCart[index].qty -= 1;
			if (newCart[index].qty === 0) {
				// If the quantity is 0, remove the product from the cart
				return {
					cart: state.cart.filter((_, i) => i !== index),
					items: 0,
				};
			} else {
				// If the quantity is not 0, update the quantity
				return {
					cart: newCart,
				};
			}
		}),
	clearCart: () => set({ cart: [], items: 0 }),
	items: 0,
}));

export default useCartStore;
