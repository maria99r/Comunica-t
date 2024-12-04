import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: User | null = null; //datos del usuario
  isEditing = false; //modo edición
  orders: Order[] = []; //lista de pedidos

  public readonly IMG_URL = environment.apiImg;

  constructor(private authService: AuthService, private router: Router, private orderApi : OrderService) { }

  //obtiene los datos del usuario autenticado
  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.user = this.authService.getUser();

    this.orders = await this.orderApi.getOrdersByUser(this.user.userId);

    console.log(this.orders)
  }

  //logica para habilitar la edición solo en el campo necesario
  toggleEdit(field: string) {
    this.isEditing = !this.isEditing;
  }
}
