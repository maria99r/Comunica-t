import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Cart } from '../models/cart';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductCart } from '../models/productCart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly CART_KEY = 'cartProducts';
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // productos del carrito desde localStorage
  getCartFromLocal(): ProductCart[] {
    const cart = localStorage.getItem(this.CART_KEY);
    const cartParsed = cart ? JSON.parse(cart) : [];
    return cartParsed;
  }

  // obtener carrito de bbdd segun el usuario
  async getCartByUser(id: number): Promise<Cart> {
    const request: Observable<Object> =
      this.http.get(`${this.BASE_URL}Cart/byUser/${id}`);

    const dataRaw: any = await lastValueFrom(request);

    const cart: Cart = {
      id: dataRaw.id,
      userId: dataRaw.userId,
      products: dataRaw.productCarts,
      user: dataRaw.user
    };
    return cart;
  }


  // Guardar productos del carrito en localStorage
  private saveCart(cartProducts: ProductCart[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
  }

  // Actualizar la cantidad de un producto específico en el carrito en localStorage
  updateCartProductLocal(product: ProductCart): void {
    const cart = this.getCartFromLocal();
    const index = cart.findIndex(p => p.productId === product.productId);

    if (index !== -1) { // Si el índice es -1, es que no existe
      cart[index] = product;
      this.saveCart(cart);
    }
  }

  updateCartProductBBDD(idCart: number, idProduct: number, newQuantity: number): Observable<any> {
    const url = (`${this.BASE_URL}ProductCart/updateQuantity/${idCart}/${idProduct}?quantityChange=${newQuantity}`);
    return this.http.put(url, { responseType: 'text' });
  }

  createCart(idUser: number): Observable<any> {
    const url = `${this.BASE_URL}Cart/newCart`;
    const body = {
      userId: idUser,
    };

    return this.http.post(url, idUser);
  }

  addToCartBBDD(quantity: number, cartId: number, productId: number): Observable<any> {
    const url = `${this.BASE_URL}ProductCart/addProduct`;
    const body = {
      quantity: quantity,
      cartId: cartId,
      productId: productId
    };

    return this.http.post(url, body);
  }

  // Eliminar un producto del carrito
  removeFromCartLocal(id: number): void {

    if (id === null || id === undefined) {

      console.log('Id inválida: ', id); // Odio Angular
    } else {

      const cart = this.getCartFromLocal();
      const index = cart.findIndex(p => p.productId == id);
      console.log("Índice: " + index)

      if (index !== -1) {
        cart.splice(index, 1);
        this.saveCart(cart);
      }
    }
  }


  removeFromCartBBDD(idCart: number, idProduct: number): Observable<any> {
    const url = (`${this.BASE_URL}ProductCart/removeProduct/${idCart}/${idProduct}`);
    return this.http.delete(url, { responseType: 'text' });
  }

  // Limpiar el carrito completo
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }

}