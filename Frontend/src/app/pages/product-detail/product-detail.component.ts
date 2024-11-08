import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';  // Importa el servicio CartService
import { ProductWithQuantity } from '../../models/product-with-quantity';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NavComponent, FooterComponent, InputNumberModule, FormsModule, ButtonModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  product: Product | null = null;

  reviews: Review[] = [];  

  public readonly IMG_URL = environment.apiImg;



  quantity = 1;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService) { }

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;
    this.product = await this.api.getProduct(id);
    this.reviews = await this.api.loadReviews(id);
  }

  // Método para añadir al carrito
  addToCart(): void {
    if (this.product) {
      const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
      const productInCart = cart.find((p: Product & { quantity: number }) => p.id === this.product!.id);

      if (productInCart) {
        productInCart.quantity += this.quantity;
      } else {
        cart.push({ ...this.product, quantity: this.quantity });
      }

      localStorage.setItem('cartProducts', JSON.stringify(cart));
      console.log('Producto añadido al carrito:', this.product);
    }
  }
}
