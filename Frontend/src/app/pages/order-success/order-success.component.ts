import { Component } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';
import { ProductOrder } from '../../models/productOrder';


@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent {

  constructor(private orderService: OrderService, private activatedRoute: ActivatedRoute,
  ) { }

  id : number ;
  order : Order = null;
  products : ProductOrder[] = [];

  async ngOnInit(): Promise<void> {

    const actualId = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number;

    this.id = actualId;

    // pedido actual
    this.order = await this.orderService.getOrderById(this.id);

    this.products = this.order.ProductsOrder;
    console.log(this.order);

  }

}
