import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Result } from '../models/result';
import { Product } from '../models/product';
import { CheckoutSession } from '../models/checkout-session';
import { CheckoutSessionStatus } from '../models/checkout-session-status';
import { TemporalOrder } from '../models/temporal-order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private api: ApiService) { }

  // Consulta los datos de la orden temporal por ID
  getOrderDetails(sessionId: string): Promise<Result<TemporalOrder>> {
    return this.api.get<TemporalOrder>(`checkout/order/${sessionId}`);
  }

  // Vincula al usuario con la orden temporal
  linkUserToOrder(sessionId: string): Promise<Result<any>> {
    return this.api.post<any>(`checkout/link-order`, { sessionId });
  }

  // Inicializa el checkout embebido de Stripe
  getEmbededCheckout(): Promise<Result<CheckoutSession>> {
    return this.api.get<CheckoutSession>('checkout/embedded');
  }

  // Refresca la expiración de la orden temporal
  refreshOrder(sessionId: string): Promise<Result<any>> {
    return this.api.post<any>(`checkout/refresh-order`, { sessionId });
  }
}
