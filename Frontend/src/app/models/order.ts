import { ProductOrder } from "./productOrder";
import { User } from "./user";

export interface Order {
    id: number,
    PaymentDate: Date,
    PaymentMethod: string,
    TotalPrice: number,
    UserId: number,
    ProductsOrder: ProductOrder[],
    User : User
}


