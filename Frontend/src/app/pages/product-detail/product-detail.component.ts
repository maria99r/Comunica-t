import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user';
import { ReviewDto } from '../../models/reviewDto';
import { ProductCart } from '../../models/productCart';
import { OrderService } from '../../services/order.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [InputNumberModule, FormsModule, ButtonModule, CommonModule, RouterModule, ToastModule],
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

  // para verificar si puede poner una reseña
  hasPurchased: boolean = false;

  quantity = 1;

  user : User;  // usuario actual

  // media reseñas
  avg: number = 0;

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private cartApi: CartService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private orderApi: OrderService,
    public messageService: MessageService
  ) { }

  async ngOnInit(): Promise<void> {
    // usuario actual
    const user = await this.authService.getUser();
    this.user = user;
    console.log(this.user)
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

    // obtiene los pedidos para verificar si puede poner una reseña
    const orders = await this.orderApi.getOrdersByUser(user.userId);
    this.hasPurchased = orders.some(order =>
      order.ProductsOrder.some(productOrder => productOrder.productId === Number(this.product.id))
    );

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
        // console.log(cart)
        // añade producto
        try {
          await this.cartApi.addToCartBBDD(this.quantity, cart.id, Number(this.product.id));
          this.throwDialog("productCart", "El producto se ha añadido correctamente su carrito.");
        } catch (e) {
          this.throwError("productCart", "Error al añadir el producto.");
          console.log(e)
        }
      }

      // usuario no logueado, trabaja con localstorage
    } else {
      if (this.product) {
        try {

          //console.log("Sesión NO iniciada")
          const cart = JSON.parse(localStorage.getItem('cartProducts') || '[]');

          if (this.quantity > this.product.stock) {

            this.quantity = this.product.stock;
            this.throwError("productCart", "No hay stock suficiente.");

          } else {

            const productInCart = cart.find((p: ProductCart) => p.productId === this.product.id);

            if (productInCart) {
              productInCart.quantity += this.quantity;
            } else {
              cart.push({ ...this.productCart });
            }
            localStorage.setItem('cartProducts', JSON.stringify(cart));
            //console.log('Producto añadido al carrito:', this.productCart);
            this.throwDialog("productCart", "El producto se ha añadido correctamente su carrito.");
          }

        } catch (error) {
          console.log("Error: " + error)
          this.throwError("productCart", "Se ha producido un error con el producto.");
        }

      }
    }
    this.cartApi.notifyCartChange(); // Notificar el cambio en la cantidad
  }

  // crear reseña 
  async publicReview() {
    try {
      // Validar que el texto de la reseña no sea vacío o contenga solo espacios
      if (!this.textReview || this.textReview.trim().length === 0) {
        this.throwError("productCart", "La reseña no puede estar vacía.");
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
          this.calculeAvg();
        }
      }
    } catch (error) {
      console.error('Error al publicar la reseña: ', error);
      this.throwError("productCart", "Error al publicar la reseña.");
    }
  }

  // Eliminar una reseña
  async deleteReview(reviewId: number) {

    const confirmation = confirm(`¿Estás seguro de que deseas borrar la reseña?`);

    if (confirmation) {
      
      const result = await this.api.deleteReview(reviewId)
      console.log(result);
      
      if (result.statusCode != 200) {
        console.error("Error al eliminar la reseña.");
        this.throwError("delete-review", "Error al eliminar la reseña.");
      } else{
        this.throwDialog("delete-review", "Reseña eliminada con éxito.");
      }

      this.reviews = await this.api.loadReviews(this.product.id)
      this.users = [];

      for (const review of this.reviews) {
        this.users.push(await this.api.getUser(review.userId));
      }

      this.hasComment = this.users.some(u => u.userId === this.user.userId);
      this.textReview = "";
      this.calculeAvg();
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

  // Cuadro de notificación de éxito
  throwDialog(key: string, texto: string) {
    this.messageService.add({ key: key, severity: 'success', summary: 'Éxito', detail: texto })
  }

  // Cuadro de notificación de error
  throwError(key: string, error: string) {
    this.messageService.add({ key: key, severity: 'error', summary: 'Error', detail: error })
  }
}