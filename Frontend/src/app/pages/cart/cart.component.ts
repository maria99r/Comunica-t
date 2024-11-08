import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product'; 
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProductWithQuantity } from '../../models/product-with-quantity';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, ButtonModule, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartProducts: ProductWithQuantity[] = [];
  public readonly IMG_URL = environment.apiImg;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Cargar los productos del carrito desde el servicio al inicializar el componente
    this.cartProducts = this.cartService.getCartProducts();
  }

  // Método para actualizar la cantidad de un producto en el carrito
  changeQuantity(product: ProductWithQuantity, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(product.id); // Si la cantidad es 0 o menos, se elimina el producto
    } else {
      product.quantity = quantity;  // Actualiza la cantidad en el producto
      this.cartService.updateCartProduct(product); // Actualiza el producto en el carrito del servicio
    }
  }

  // Método para eliminar un producto del carrito
  removeProduct(id: number): void {
    this.cartService.removeFromCart(id); // Elimina el producto del carrito en el servicio
    this.cartProducts = this.cartProducts.filter(p => p.id !== id); // Actualiza la lista local
  }

  // Calcula el total del carrito
  get total(): number {
    return this.cartProducts.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);
  }
}
