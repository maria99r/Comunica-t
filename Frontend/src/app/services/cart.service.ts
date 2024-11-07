import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment'; // Importa el entorno

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly baseUrl = `${environment.apiUrl}cart`; // URL base para el carrito

  constructor(private http: HttpClient) {}

  // obtener el carrito completo
  getCart(): Observable<(Product & { quantity: number })[]> {
    return this.http.get<(Product & { quantity: number })[]>(this.baseUrl);
  }

  // añadir un producto al carrito
  addToCart(product: Product): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, { productId: product.productId });
  }

  // eliminar un producto del carrito
  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${productId}`);
  }

  // actualizar cantidad de un producto en el carrito
  updateCart(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, { productId, quantity });
  }
}
