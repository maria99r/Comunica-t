import { TemporalProductOrder } from "./temporal-product-order";

export interface TemporalOrder {
    id: number;
    paymentMethod: string;
    totalPrice: number;
    expiresAt: Date;
    userId?: number;
    temporalProductOrder: TemporalProductOrder[];
}
