import { Product } from "./product";
import { ProductCart } from "./productCart";
import { User } from "./user";

export interface Cart {
    id: number,
    userId: number,
    user: User
    products: ProductCart[]
}
