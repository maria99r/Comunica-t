import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductCart } from '../models/productCart';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly CART_KEY = 'cartProducts';
  private readonly BASE_URL = environment.apiUrl;
  localCart: ProductCart[] = [];
  // Para controlar en el login si se viene desde el inicio de sesión o desde el pago
  public actionSource: string | null = null;

  constructor(private http: HttpClient, private api: ApiService) { }

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
      products: dataRaw.products,
      user: dataRaw.user
    };
    return cart;
  }

  createCart(idUser: number): Observable<any> {
    const url = `${this.BASE_URL}Cart/newCart`;
    const body = {
      userId: idUser,
    };

    return this.http.post(url, idUser);
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

  updateCartProductBBDD(userId: number, productId: number, newQuantity: number): Observable<any> {
    const url = (`${this.BASE_URL}ProductCart/updateQuantity/${userId}/${productId}?newQuantity=${newQuantity}`);
    return this.http.put(url, null, { responseType: 'text' });
  }

  async addToCartBBDD(quantity: number, cartId: number, productId: number): Promise<any> {
    console.log("Carritos sincronizados")
    const url = `ProductCart/addProduct`;
    const body = {
      quantity: quantity,
      cartId: cartId,
      productId: productId
    };
    return await this.api.post(url, body);
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

  async addLocalCartToUser(userId: number, localCart: ProductCart[]) {

    const userCart = await this.getCartByUser(userId);

    for (let product of localCart) {
      await this.addToCartBBDD(product.quantity, userCart.id, product.productId)
    }
  }

  // CREAR ORDEN TEMPORAL:

  // si el usuario esta logueado desde la BBDD le enviamos el carrito
  newTemporalOrderBBDD(cart: Cart, paymentMethod: string): Observable<any> {
    console.log("Carrito enviado: ", cart)

    const url = (`${this.BASE_URL}TemporalOrder/newTemporalOrderBBDD?paymentMethod=${paymentMethod}`);

    return this.http.post(url, cart);
  }

  // si el usuario esta logueado desde el local Storage le enviamos el carrito
  newTemporalOrderLocal(cart: ProductCart[], paymentMethod: string): Observable<any> {
    const url = `${this.BASE_URL}TemporalOrder/newTemporalOrderLocal?paymentMethod=${paymentMethod}`;
    return this.http.post(url, cart);
  }

}