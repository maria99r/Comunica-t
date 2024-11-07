import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment'; // Importa el entorno

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FooterComponent, NavComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public readonly IMG_URL = environment.apiImg; 

  cartProducts: (Product & { quantity: number })[] = []; //  Product con quantity

  ngOnInit(): void {
    this.loadCart();
  }

  // cargar el carrito desde localStorage
  loadCart(): void {
    const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    this.cartProducts = cart;
  }

  // mtodo para eliminar un producto del carrito por su ID
  removeFromCart(productId: number): void {
    this.cartProducts = this.cartProducts.filter(product => product.productId !== productId);
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));  
  }
}
