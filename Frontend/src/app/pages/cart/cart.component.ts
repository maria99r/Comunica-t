import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CartProduct } from '../../models/cart-product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, ButtonModule, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {

  cartProducts: CartProduct[] = [];
  userId: string;
  public readonly IMG_URL = environment.apiImg;

  constructor(private cartService: CartService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Cargar los productos del carrito desde el servicio al inicializar el componente
    this.cartProducts = this.cartService.getCartProducts();

    // Obtiene la ID del usuario desde la ruta
    this.userId = this.route.snapshot.paramMap.get(this.userId) || null;
    
    // Si existe la ID, obtenemos su carrito correspondiente
    if (this.userId) {
      this.cartService.getCartByUserId(this.userId).subscribe((cart) => {
          this.cartProducts = cart.products; // Almacena el carrito en la variable `cart`
        },(error) => {
          console.error('Error al obtener el carrito:', error);
        }
      );
    }
  }

  // Método para actualizar la cantidad de un producto en el carrito
  changeQuantity(product: CartProduct, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(product.productId); 
    } else {
      product.quantity = quantity;  
      this.cartService.updateCartProduct(product); 
    }
  }

  // Método para eliminar un producto del carrito
  removeProduct(id: number): void {
    this.cartService.removeFromCart(id); 
    this.cartProducts = this.cartProducts.filter(p => p.productId !== id); 
  }

  // Calcula el total del carrito
  get total(): number {
    return this.cartProducts.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);
  }
}
