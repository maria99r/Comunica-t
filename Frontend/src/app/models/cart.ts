import { Product } from "./product";
import { User } from "./user";

export interface Cart {
    id: number,
    userId: number,
    user: User
    products: Product[]
}