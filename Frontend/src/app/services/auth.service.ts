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
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      this.api.jwt = token;
    }
  }

  async signup(formData: any): Promise<Result<any>> { // Registro
    return this.api.post<any>('Auth/Signup', formData);
  }

  async login(authData: AuthRequest, rememberMe: boolean): Promise<Result<AuthResponse>> { // Iniciar sesión
    const result = await this.api.post<AuthResponse>('Auth/login', authData);

    if (result.success) {
      const { accessToken, user } = result.data; // guardo info de la respuesta AuthResponde
      this.api.jwt = result.data.accessToken;

      if (rememberMe) { // Si se pulsó el botón recuérdame
        // en el localStorage guardo el token y el usuario (UserDto)
        localStorage.setItem(this.TOKEN_KEY, accessToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(this.TOKEN_KEY, accessToken);
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    }

    return result;
  }

  // Comprobar si el usuario esta logeado
  isAuthenticated(): boolean { 
    const token = localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  logout(): void { // Cerrar sesión
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getUser() { // Obtener datos del usuario
    const user = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  //Comprobacion de permisos de administrado 
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin'; 
  }
  
}
