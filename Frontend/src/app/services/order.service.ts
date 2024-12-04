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


  // obtener pedidos de un usuario por su id
  async getOrdersByUser(id : number) : Promise<Order[]> {
    const request: Observable<Object> =
      this.http.get(`${this.BASE_URL}Order/byUser/${id}`);

      const dataRaw: any = await lastValueFrom(request);
  
      const orders: Order[] = [];
  
      for (const or of dataRaw) {
        const order: Order = {
          id: or.id,
          PaymentDate: or.paymentDate,
          PaymentMethod: or.paymentMethod,
          TotalPrice: or.totalPrice,
          UserId: or.userId,
          ProductsOrder: or.productsOrder,
          User: or.user
        }
        orders.push(order);
      }
      return orders;
  }
}
