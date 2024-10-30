import { User } from "./user";

export interface AuthResponse {
    accessToken: string;
    user : User;
}
