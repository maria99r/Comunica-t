import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Result } from '../models/result';
import { Product } from '../models/product';
import { CheckoutSession } from '../models/checkoutSession';
import { CheckoutSessionStatus } from '../models/checkoutSessionStatus';
import { TemporalOrder } from '../models/temporal-order';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient, private api: ApiService) { }

  // Consulta los datos de la orden temporal por ID
  getOrderDetails(temporalOrderId: number): Promise<Result<TemporalOrder>> {
    return this.api.get<TemporalOrder>(`TemporalOrder/${temporalOrderId}`);
  }

  // Vincula al usuario con la orden temporal
  linkUserToOrder(sessionId: number): Promise<Result<any>> {
    return this.api.post<any>(`Checkout/link-order`, { sessionId });
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

  // crea pedido desde una orden temporal
  newOrder(temporal: TemporalOrder): Observable<Order> {
    const url = `${this.BASE_URL}Order/newOrder`;
    return this.http.post<Order>(url, temporal);
  }
}
