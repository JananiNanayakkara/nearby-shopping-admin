import { create } from 'zustand';

interface ProductStore {
	products: ProductData[];
	selectedProduct: ProductData | null;
	setSelectedProduct: (product: ProductData) => void;
	addProduct: (product: ProductData) => void;
	removeProduct: (product: ProductData) => void;
	resetProducts: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
	products: [],
	selectedProduct: null,
	setSelectedProduct: (product) => set({ selectedProduct: product }),
	addProduct: (product) =>
		set((state) => ({ products: [...state.products, product] })),
	removeProduct: (product) =>
		set((state) => ({ products: state.products.filter((p) => p !== product) })),
	resetProducts: () => set({ products: [] }),
}));
