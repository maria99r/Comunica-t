import { Injectable } from '@angular/core';
import { Product } from '../models/product';
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
  getCartFromLocal(): Product[] {
    const cart = localStorage.getItem(this.CART_KEY);
    const cartParsed = cart ? JSON.parse(cart) : [];
    return cartParsed;
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
  private saveCart(cartProducts: Product[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
  }

  // Agregar un producto al carrito
  /*
  addToCart(product: Product): void {
    const cart = this.getCartFromLocal();
    const existingProduct = cart.find(p => p.id === product.id);

    if (existingProduct) {
      existingProduct.stock = (existingProduct.stock || 0) + (product.stock || 1);
    } else {
      cart.push(product);
    }

    this.saveCart(cart);
  }*/

  // Actualizar la cantidad de un producto específico en el carrito
  updateCartProduct(product: Product): void {
    const cart = this.getCartFromLocal();
    const index = cart.findIndex(p => p.id === product.id);

    if (index !== -1) {
      cart[index] = product;
      this.saveCart(cart);
    }
  }

  // Eliminar un producto del carrito
  removeFromCart(id: number): void {

    if (id === null || id === undefined) {

      console.log('Id inválida: ', id); // Odio Angular
    } else{

      const cart = this.getCartFromLocal();
      const index = cart.findIndex(p => p.id == id);
      console.log("Índice: " + index)
      
      if (index !== -1) {
        cart.splice(index, 1);
        this.saveCart(cart);
      }
    }
  }

  // Limpiar el carrito completo
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}