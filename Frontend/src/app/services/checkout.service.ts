import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Result } from '../models/result';
import { Product } from '../models/product';
import { CheckoutSession } from '../models/checkout-session';
import { CheckoutSessionStatus } from '../models/checkout-session-status';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private api: ApiService) { }

  // lista de productos que se van a comprar
  getAllProducts(): Promise<Result<Product[]>> {
    return this.api.get<Product[]>('checkout/products');
  }

  // inicialización del checkout embebido de Stripe
  getEmbededCheckout(): Promise<Result<CheckoutSession>> {
    return this.api.get<CheckoutSession>('checkout/embedded');
  }

  // consulta el estado de una sesión
  getStatus(sessionId: string): Promise<Result<CheckoutSessionStatus>> {
    return this.api.get<CheckoutSessionStatus>(`checkout/status/${sessionId}`);
  }
}
