import { Injectable } from '@angular/core';
import { Product } from '../models/product';
//import { ProductWithstock } from '../models/product-with-stock';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cartProducts';

  // Obtener productos del carrito desde localStorage
  getCartProducts(): Product[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  // Guardar productos del carrito en localStorage
  private saveCart(cartProducts: Product[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
  }

  // Agregar un producto al carrito
  addToCart(product: Product): void {
    const cart = this.getCartProducts();
    const existingProduct = cart.find(p => p.id === product.id);
    
    if (existingProduct) {
      existingProduct.stock = (existingProduct.stock || 0) + (product.stock || 1);
    } else {
      cart.push({ ...product, stock: product.stock || 1 });
    }

    this.saveCart(cart);  
  }

  // Actualizar la cantidad de un producto específico en el carrito
  updateCartProduct(product: Product): void {
    const cart = this.getCartProducts();
    const index = cart.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      cart[index] = product;
      this.saveCart(cart);  
    }
  }

  // Eliminar un producto del carrito
  removeFromCart(id: number): void {
    const cart = this.getCartProducts().filter(p => p.id !== id);
    this.saveCart(cart);  
  }

  // Limpiar el carrito completo
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}
