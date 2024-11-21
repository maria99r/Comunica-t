import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../models/cart';
import { ProductCart } from '../../models/productCart';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, ButtonModule, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartProducts: ProductCart[] = [];

  cart: Cart;
  public readonly IMG_URL = environment.apiImg;

  isLog: boolean; // para comprobar si esta o no logueado

  constructor(private cartService: CartService, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {

    this.loadCart();

  }

  async loadCart(){
    const user = this.authService.getUser();
    const userId = user ? user.userId : null;

    // dependiendo de si el usuario esta o no logueado
    if (user) {
      console.log("Sesión iniciada")
      this.cart = await this.cartService.getCartByUser(userId);
      console.log(this.cart)
      this.isLog = true;
    }
    else {
      console.log("Sesión NO iniciada")
      this.cartProducts = this.cartService.getCartFromLocal();
      console.log(this.cartProducts)
      this.isLog = false;
    }
  }


  // Método para actualizar la cantidad de un producto en el carrito
  changeQuantityLocal(product: ProductCart, quantity: number): void {
    if (product.quantity <= 0) {
      this.removeProductLocal(product);
    } else {
      product.quantity = quantity;
      this.cartService.updateCartProduct(product);
    }
  }


  // cambiar cantidad de un producto en el carrito de BBDD
  changeQuantityBBDD(product: ProductCart, newQuantity: number): void { // NO FUNCIONA NI EN EL BACK :(
    product.quantity = newQuantity;
    this.cartProducts = this.cartService.getCartFromLocal();
    // this.cartService.updateCartProduct(product);
  }


  // eliminar un producto del carrito
  removeProductLocal(product: ProductCart): void {
    this.cartService.removeFromCartLocal(product.productId);
    this.cartProducts = this.cartService.getCartFromLocal();
    console.log('Eliminado producto con la id:', product.productId); // Log :D
  }

  // eliminar un producto del carrito de la bbdd 
  async removeProductBBDD(productId: number): Promise<void> {
    try {
      const response = await this.cartService.removeFromCartBBDD(this.cart.id, productId).toPromise();
      alert(response);  
      this.loadCart();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      alert('Hubo un error al eliminar el producto.');
    }
  }


  // Calcula el total del carrito
  get total(): number {
    let sum = 0;
    
    if (this.isLog) {
      if (this.cartProducts === null) { // Controla si está vacío
        sum = 0;
      } else {
        for (let line of this.cart.products) {
          sum += line.product.price / 100 * (line.quantity || 1);
        }
      }
      
    } else {
      if (this.cartProducts === null) { // Controla si está vacío
        sum = 0;
      } else {
        for (let product of this.cartProducts) {
          sum += product.product.price / 100 * (product.quantity || 1);
        }
      }
      
    }
    return sum;
  }
}