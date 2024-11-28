import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Result } from '../models/result';
import { Product } from '../models/product';
import { CheckoutSession } from '../models/checkoutSession';
import { CheckoutSessionStatus } from '../models/checkoutSessionStatus';
import { TemporalOrder } from '../models/temporal-order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private api: ApiService) { }

  // Consulta los datos de la orden temporal por ID
  getOrderDetails(temporalOrderId: number): Promise<Result<TemporalOrder>> {
    return this.api.get<TemporalOrder>(`TemporalOrder/${temporalOrderId}`);
  }

  // Vincula al usuario con la orden temporal
  linkUserToOrder(temporalOrderId: number): Promise<Result<any>> {
    return this.api.post<any>(`Checkout/link-order`, { temporalOrderId });
  }

  // Inicializa el checkout embebido de Stripe
  getEmbededCheckout(): Promise<Result<CheckoutSession>> {
    return this.api.get<CheckoutSession>('Checkout/embedded');
  }

  // Refresca la expiración de la orden temporal
  refreshOrder(temporalOrderId: number): Promise<Result<any>> {
    return this.api.get<any>(`TemporalOrder/refresh-order`, { temporalOrderId });
  }

  orderOnComplete(sessionId: number): Promise<Result<TemporalOrder>> {
    return this.api.get<TemporalOrder>(`Checkout/status/${sessionId}`);
  }
}
