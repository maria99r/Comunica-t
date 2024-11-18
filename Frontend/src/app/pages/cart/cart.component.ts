import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product'; 
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
//import { ProductWithQuantity } from '../../models/product-with-quantity';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, ButtonModule, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];
  public readonly IMG_URL = environment.apiImg;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Cargar los productos del carrito desde el servicio al inicializar el componente
    this.cartProducts = this.cartService.getCartProducts();
  }

  // Método para actualizar la cantidad de un producto en el carrito
  changeQuantity(product: Product, stock: number): void {
    if (stock <= 0) {
      this.removeProduct(product.id); 
    } else {
      product.stock = stock;  
      this.cartService.updateCartProduct(product); 
    }
  }

  // Método para eliminar un producto del carrito
  removeProduct(id: number): void {
    this.cartService.removeFromCart(id); 
    this.cartProducts = this.cartProducts.filter(p => p.id !== id); 
  }

  // Calcula el total del carrito
  get total(): number {
    return this.cartProducts.reduce((sum, product) => sum + (product.price * (product.stock || 1)), 0);
  }
}
