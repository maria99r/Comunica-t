import { Product } from "./product";

export interface TemporalProductOrder {
    quantity: number;
    temporalOrderId: number;
    productId: number;
    product: Product;
}
