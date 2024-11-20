import { Cart } from "./cart";
import { Product } from "./product";

export interface ProductCart {
    cartId: number,
    productId: number,
    quantity: number,
    cart: Cart,
    product:Product,
}
