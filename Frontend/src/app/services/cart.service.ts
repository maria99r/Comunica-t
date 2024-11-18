import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { CartProduct } from '../models/cart-product';
import { Cart } from '../models/cart';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly CART_KEY = 'cartProducts';

  private readonly BASE_URL = environment.apiUrl;
  constructor(private http: HttpClient) { }

  // productos del carrito desde localStorage
  getCartFromLocal(): CartProduct[] {
    const cart = localStorage.getItem(this.CART_KEY);
    console.log(cart)
    return cart ? JSON.parse(cart) : [];
  }

  // obtener carrito de bbdd 
  async getCartByUser(id: number): Promise<Cart> {
    const request: Observable<Object> = 
      this.http.get(`${this.BASE_URL}Cart/byUser/${id}`);

    const dataRaw: any = await lastValueFrom(request);

    const cart: Cart = {
      id: dataRaw.cart,
      userId: dataRaw.userId,
      products: dataRaw.products,
      user: dataRaw.user
    };
    return cart;
  }


  // Guardar productos del carrito en localStorage
  private saveCart(cartProducts: CartProduct[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
  }

  // Agregar un producto al carrito
  addToCart(product: CartProduct): void {
    const cart = this.getCartFromLocal();
    const existingProduct = cart.find(p => p.productId === product.productId);

    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + (product.quantity || 1);
    } else {
      cart.push(product);
    }

    this.saveCart(cart);
  }

  // Actualizar la cantidad de un producto específico en el carrito
  updateCartProduct(product: CartProduct): void {
    const cart = this.getCartFromLocal();
    const index = cart.findIndex(p => p.productId === product.productId);

    if (index !== -1) {
      cart[index] = product;
      this.saveCart(cart);
    }
  }

  // Eliminar un producto del carrito
  removeFromCart(id: number): void {
    const cart = this.getCartFromLocal().filter(p => p.productId !== id);
    
    this.saveCart(cart);
  }

  // Limpiar el carrito completo
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}
