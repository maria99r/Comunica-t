import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { Result } from '../models/result';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'jwtToken';

  constructor(private api: ApiService) {
    const token =
      localStorage.getItem('jwtToken');
    if (token) {
      this.api.jwt = token;
    }
  }

  async login(authData: AuthRequest): Promise<Result<AuthResponse>> {
    const result = await this.api.post<AuthResponse>('Auth/login', authData);

    if (result.success) {
      const { accessToken, user } = result.data; // guardo info de la respuesta AuthResponde
      this.api.jwt = result.data.accessToken;

      // en el localStorage guardo el token y el usuario (UserDto)
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user)); 
    }

    return result;
  }

  isAuthenticated(): boolean {
    const token =
      localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');
    return !!token;
  }

  logout(): void {
    sessionStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtToken');
  }

  getUser(){
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

}
