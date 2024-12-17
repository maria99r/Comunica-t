import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';
import { ProductOrder } from '../../models/productOrder';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent implements OnInit {

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public cartService: CartService
  ) { }

  public readonly IMG_URL = environment.apiImg;

  id: number;
  order: Order = null;
  products: ProductOrder[] = [];
  isLoading: boolean = true;

  async ngOnInit(): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Notificar el cambio en la cantidad de productos del carrito
    this.cartService.notifyCartChange();

    const actualId = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;

    this.id = actualId;

    // pedido actual
    this.order = await this.orderService.getOrderById(this.id);

    this.products = this.order.ProductsOrder;

    this.isLoading = false;

  }

}
