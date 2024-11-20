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
import { User } from '../../models/user';
import { ReviewDto } from '../../models/reviewDto';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavComponent, FooterComponent, ButtonModule, FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class ProductDetailComponent implements OnInit {


  product: Product | null = null;

  reviews: Review[] = [];

  textReview: string;

  cart: Cart;
  public readonly IMG_URL = environment.apiImg;

  users: User[] = [];
  actualUser : User;
  isLog : boolean = false;

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
    private cartService: CartService) { }

  async ngOnInit(): Promise<void> {

    this.loadCart();

    this.product.id = id;

    // carga sus reseñas
    this.reviews = await this.api.loadReviews(id);

    // obtiene info de los usuarios que han comentado
    for (const review of this.reviews) {
      this.users.push(await this.api.getUser(review.userId));
    }

    // usuario actual
    const user = await this.authService.getUser();
    if(user != null){ this.isLog = true;}

    // revisa si el usuario ya ha comentado para que no pueda comentar
    this.hasComment = this.users.some(u => u.id === user.userId);

    // calcula la media de las reseñas
    this.calculeAvg();
  }


  // añadir al carrito 
  async addToCart(): Promise<void> {

    // si el usuario esta logueado, se trabaja con la bbdd
    if (this.isLog) {
      if (this.product) {
        const cart = await this.cartApi.getCartByUser(this.actualUser.id);
          try {
            await this.cartApi.addToCartBBDD(this.quantity, cart.id, this.product.id).toPromise();
            alert("Producto añadido al carrito.");
          } catch (error) {
            console.error("Error al añadir al carrito:", error);
            alert("Hubo un error al añadir el producto al carrito.");
          }
        
      }
    } else {
      if (this.product) {
        const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');
        if (this.quantity > this.product.stock) {

          this.quantity = this.product.stock;
          alert("No hay stock suficiente.")

        } else {

          const productInCart = cart.find((p: Product & { quantity: number }) => p.id === this.product.id);

          if (productInCart) {
            productInCart.quantity += this.quantity;
          } else {
            cart.push({ ...this.product, quantity: this.quantity });
          }
          localStorage.setItem('cartProducts', JSON.stringify(cart));
          console.log('Producto añadido al carrito:', this.product);
          alert("El producto se ha añadido correctamente su carrito.");
        }

      }
    }
  }



  // crear reseña 
  async publicReview() {
    try {

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
        this.hasComment = this.users.some(u => u.id === user.userId);
      }
    } catch (error) {
      console.error('Error al publicar la reseña: ', error);
    }
  }


  // Método para actualizar la cantidad de un producto en el carrito
  changeStock(product: Product, stock: number): void {
    if (stock <= 0) {
      this.removeProduct(product);
    } else {
      product.stock = stock;
      this.cartService.updateCartProduct(product);
    }
  }
}