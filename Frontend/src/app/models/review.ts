import { User } from "./user";

export interface Review {
    id : number,
    text : string,
    label : number,
    publicationDate : Date,
    userId: number,
    productId: number,
    user : User
}
