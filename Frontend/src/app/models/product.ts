import { Review } from "./review"

export interface Product {
    productId: number,
    name: string,
    price: number,
    stock: number,
    description: string,
    image: string,
    reviews: Review[]
}
