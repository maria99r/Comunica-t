  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Product } from '../../models/product'; 
  import { CartService } from '../../services/cart.service';
  import { environment } from '../../../environments/environment';
  import { NavComponent } from "../../components/nav/nav.component";
  import { FooterComponent } from "../../components/footer/footer.component";
  import { ButtonModule } from 'primeng/button';
  import { FormsModule } from '@angular/forms';
  import { CartProduct } from '../../models/cart-product';
  import { AuthService } from '../../services/auth.service';


  @Component({
    selector: 'app-cart',
    standalone: true,
    imports: [NavComponent, FooterComponent, ButtonModule, FormsModule, CommonModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
  })
  export class CartComponent implements OnInit {
    cartProducts: CartProduct[] = [];

    public readonly IMG_URL = environment.apiImg;

    constructor(private cartService: CartService, private authService: AuthService) {}

    ngOnInit(): void {
      
      const user = this.authService.getUser();

      // dependiendo de si el usuario esta o no logueado
      if(!user){
      this.cartProducts = this.cartService.getCartFromLocal();
      } this.cartProducts = this.cartService.getCartFromLocal();

      console.log(this.cartProducts)  

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

    // eliminar un producto del carrito
    removeProduct(id: number): void {
      this.cartService.removeFromCart(id); 
      console.log('Removing product with id:', id);  // Add this log to debug

      this.cartProducts = this.cartProducts.filter(p => p.productId !== id); 
    }

    // Calcula el total del carrito
    get total(): number {
      let sum = 0;
      for (let product of this.cartProducts) {
        sum += product.price/100 * (product.quantity || 1);
      }
      return sum;  
    }
  }
