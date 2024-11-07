import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { environment } from '../../../environments/environment'; // Importa el entorno

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FooterComponent, NavComponent, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public readonly IMG_URL = environment.apiImg; 
  cartProducts: (Product & { quantity: number })[] = []; // Product con cantidad

  ngOnInit(): void {
    this.loadCart();
  }

  // Cargar el carrito desde localStorage
  loadCart(): void {
    const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
    this.cartProducts = cart;
  }

  
}
