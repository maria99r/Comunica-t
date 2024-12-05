import { Product } from "./product";

export interface ProductOrder {
    orderId: number,
    productId: number,
    quantity: number,
    product: Product,
    pricePay : number
}

