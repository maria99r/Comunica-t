import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ProductWithQuantity } from '../models/product-with-quantity';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cartProducts';

  // Obtener productos del carrito desde localStorage
  getCartProducts(): ProductWithQuantity[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  // Guardar productos del carrito en localStorage
  private saveCart(cartProducts: ProductWithQuantity[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
  }

  // Agregar un producto al carrito
  addToCart(product: ProductWithQuantity): void {
    const cart = this.getCartProducts();
    const existingProduct = cart.find(p => p.id === product.id);
    
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + (product.quantity || 1);
    } else {
      cart.push({ ...product, quantity: product.quantity || 1 });
    }

    this.saveCart(cart);  // Actualizamos el carrito en localStorage
  }

  // Actualizar la cantidad de un producto específico en el carrito
  updateCartProduct(product: ProductWithQuantity): void {
    const cart = this.getCartProducts();
    const index = cart.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      cart[index] = product;
      this.saveCart(cart);  // Guardamos los cambios en localStorage
    }
  }

  // Eliminar un producto del carrito
  removeFromCart(id: number): void {
    const cart = this.getCartProducts().filter(p => p.id !== id);
    this.saveCart(cart);  // Guardamos el carrito actualizado en localStorage
  }

  // Limpiar el carrito completo
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}
