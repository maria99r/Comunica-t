import { ProductOrder } from "./ProductOrder";
import { User } from "./user";

export interface Order {
    id: number,
    PaymentDate: Date,
    TotalPrice: number,
    UserId: number,
    ProductsOrder: ProductOrder[],
    User : User
}


