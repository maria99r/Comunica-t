import { Injectable } from '@angular/core';
import { AuthRequest } from '../models/auth-request';
import { AuthResponse } from '../models/auth-response';
import { Result } from '../models/result';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private api: ApiService) { }

  async login(authData: AuthRequest): Promise<Result<AuthResponse>> {
    const result = await this.api.post<AuthResponse>('Auth/login', authData);

    if (result.success) {
      this.api.jwt = result.data.accessToken;
    }

    return result;
  }

}
