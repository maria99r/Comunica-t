import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartProduct } from '../models/cart-product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Cart } from '../models/cart';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cartProducts';
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener productos del carrito desde localStorage
  getCartProducts(): CartProduct[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  // Obtener el carrito por la ID del usuario
  getCartByUserId(userId: string): Observable<Cart> {
    return this.http.get<Cart>(this.BASE_URL + `user/${userId}`);
  }

  // Guardar productos del carrito en localStorage
  private saveCart(cartProducts: CartProduct[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
  }

  // Agregar un producto al carrito
  addToCart(product: CartProduct): void {
    const cart = this.getCartProducts();
    const existingProduct = cart.find(p => p.productId === product.productId);
    
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + (product.quantity || 1);
    } else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }

    this.saveCart(cart);  
  }

  // Actualizar la cantidad de un producto específico en el carrito
  updateCartProduct(product: CartProduct): void {
    const cart = this.getCartProducts();
    const index = cart.findIndex(p => p.productId === product.productId);
    
    if (index !== -1) {
      cart[index] = product;
      this.saveCart(cart);  
    }
  }

  // Eliminar un producto del carrito
  removeFromCart(id: number): void {
    const cart = this.getCartProducts().filter(p => p.productId !== id);
    this.saveCart(cart);  
  }

  // Limpiar el carrito completo
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}