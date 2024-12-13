import { CommonModule, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, ImageModule, RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit, OnDestroy {
  cartProductCount: number = 0; // número de productos
  private subscriptions: Subscription = new Subscription();
  user: User | null = null;

  constructor(
    public authService: AuthService,
    public router: Router,
    public cartService: CartService
  ) { }

  items: MenuItem[] = [];

  ngOnInit() {
    // usuario logueado
    this.user = this.authService.getUser();

    const cartSub = this.cartService.cartProductCount$.subscribe(count => {
      this.cartProductCount = count;
    });
    this.subscriptions.add(cartSub);

    // Nav items
    this.items = [
      {
        label: 'Inicio',
        icon: '',
        routerLink: '/',
      },
      {
        label: 'Tienda',
        icon: '',
        routerLink: '/catalog',
      },
      {
        label: 'Sobre nosotros',
        icon: '',
        routerLink: '/about-us',
      },
    ];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  authClick() {
    // Cerrar sesión
    if (this.authService.isAuthenticated()) {
      Swal.fire({ // Cuadro de diálogo
        title: "Has cerrado sesión con éxito",
        text: `¡Hasta pronto ${this.user.name}!`,
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => {
          this.authService.logout(),
            this.router.navigate(['/login']),
            // Notificar el cambio en la cantidad de productos del carrito
            this.cartService.notifyCartChange();
        }
      });

      // Iniciar sesión
    } else {
      this.cartService.actionSource = 'login';
      this.router.navigate(['/login']);
    }
  }
}
