import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user';
import { ReviewDto } from '../../models/reviewDto';
import { ProductCart } from '../../models/productCart';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NavComponent, FooterComponent, InputNumberModule, FormsModule, ButtonModule, CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {


  product: Product | null = null;
  productCart: ProductCart;

  reviews: Review[] = [];

  textReview: string;

  public readonly IMG_URL = environment.apiImg;

  users: User[] = [];
  currentUser: any;
  isLog: boolean = false;

  // para ver si el usuario ya ha comentado y que no pueda volver a hacerlo
  hasComment: boolean = false;

  quantity = 1;

  // media reseñas
  avg: number = 0;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private cartApi: CartService,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    // usuario actual
    const user = await this.authService.getUser();
    if (user != null) { this.isLog = true; }
    this.currentUser = user;

    // id del producto
    const id = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;

    // carga el producto
    this.product = await this.api.getProduct(id);

    this.product.id = id;

    // carga sus reseñas
    this.reviews = await this.api.loadReviews(id);

    // ordena las reseñas por fecha de publicación a las más recientes primero
    this.reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // obtiene info de los usuarios que han comentado
    for (const review of this.reviews) {
      this.users.push(await this.api.getUser(review.userId));
    }

    // revisa si el usuario ya ha comentado para que no pueda comentar
    this.hasComment = this.users.some(u => u.userId === user.userId);

    // calcula la media de las reseñas
    this.calculeAvg();

  }


  // añadir al carrito 
  async addToCart(): Promise<void> {

    if (!this.productCart) {
      this.productCart = {
        cartId: 0,
        productId: this.product.id,
        quantity: this.quantity,
        product: this.product
      };
    }

    // si el usuario esta logueado, se trabaja con la bbdd
    if (this.isLog) {
      if (this.product) {
        let cart = await this.cartApi.getCartByUser(this.currentUser.userId);
        console.log(cart)
        // añade producto
        try {
          await this.cartApi.addToCartBBDD(this.quantity, cart.id, Number(this.product.id));
          alert("Producto añadido al carrito.")
        } catch (e) {
          alert("Error al añadir el producto.")
          console.log(e)
        }
      }

      // usuario no logueado, trabaja con localstorage
    } else {
      if (this.product) {
        try {

          console.log("Sesión NO iniciada")
          const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');

          if (this.quantity > this.product.stock) {

            this.quantity = this.product.stock;
            alert("No hay stock suficiente.")

          } else {

            const productInCart = cart.find((p: ProductCart) => p.productId === this.product.id);

            if (productInCart) {
              productInCart.quantity += this.quantity;
            } else {
              cart.push({ ...this.productCart });
            }
            localStorage.setItem('cartProducts', JSON.stringify(cart));
            console.log('Producto añadido al carrito:', this.productCart);
            alert("El producto se ha añadido correctamente su carrito.");
          }

        } catch (error) {
          console.log("Error: " + error)
        }

      }
    }
  }

  // crear reseña 
  async publicReview() {
    try {
      // Validar que el texto de la reseña no sea vacío o contenga solo espacios
      if (!this.textReview || this.textReview.trim().length === 0) {
        alert("La reseña no puede estar vacía.");
      } else {
        const user = this.authService.getUser();
        const idProduct = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;

        const reviewData: ReviewDto = {
          text: this.textReview,
          userId: user.userId,
          productId: idProduct
        };

        const result = await this.api.publicReview(reviewData);

        if (result.success) {
          // se recarga la info de reseñas
          this.reviews = await this.api.loadReviews(idProduct);
          // obtiene info de los usuarios que han comentado
          for (const review of this.reviews) {
            this.users.push(await this.api.getUser(review.userId));
          }
          // revisa si el usuario ya ha comentado para que no pueda comentar
          this.hasComment = this.users.some(u => u.userId === user.userId);
        }

      }
    } catch (error) {
      console.error('Error al publicar la reseña: ', error);
    }

  }
  // calculo media de reseñas
  calculeAvg(): void {
    if (this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.label, 0);
      this.avg = sum / this.reviews.length;
      this.avg = Math.round(this.avg)
    } else {
      this.avg = 0;
    }

  }
}