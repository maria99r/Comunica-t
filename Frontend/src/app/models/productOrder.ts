import { Product } from "./product";

export interface ProductOrder {
    OrderId: number,
    ProductId: number,
    Quantity: number,
    Product: Product,
    PricePay : number
}

