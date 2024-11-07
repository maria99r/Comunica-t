import { Review } from "./review"

export interface Product {
    id: number,
    name: string,
    price: number,
    stock: number,
    description: string,
    image: string,
    reviews: Review[]
}
