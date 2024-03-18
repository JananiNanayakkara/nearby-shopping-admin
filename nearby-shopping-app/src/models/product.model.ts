interface ProductData {
	created_at?: string;
	description: string;
	id?: number;
	isInStock: boolean | null;
	location: string;
	nearestCity: string;
	price: number;
	productName: string;
	type: string;
	userId?: string | null;
	rating: number;
}
