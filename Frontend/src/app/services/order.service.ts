import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { Result } from '../models/result';
import { Observable, lastValueFrom } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient, private api: ApiService) { }

  // obtener pedido orden por id
  async getOrderById(id: number): Promise<Order> {
    const request: Observable<Object> =
      this.http.get(`${this.BASE_URL}Order/${id}`);

    const dataRaw: any = await lastValueFrom(request);

    console.log(dataRaw);

    const order: Order = {
      id: dataRaw.id,
      PaymentMethod: dataRaw.paymentMethod,
      TotalPrice: dataRaw.totalPrice,
      PaymentDate: dataRaw.paymentDate,
      ProductsOrder: dataRaw.productsOrder,
      User: dataRaw.user,
      UserId: dataRaw.userId
    };

    return order;
  }


}
