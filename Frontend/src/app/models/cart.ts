import { CartProduct } from "./cart-product";

export interface Cart {
    id: number;
    userId: string;
    products: CartProduct[]; // Un carrito contiene una lista de productos
}  