import { ImageRequest } from "./image-request";

export interface newProductDto {
    name: string,
    price: number,
    stock: number,
    description: string,
    image: ImageRequest
}
