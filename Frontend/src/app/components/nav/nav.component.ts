import { CommonModule, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, ImageModule, RouterModule, CommonModule, ToastModule, ButtonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, OnDestroy {
  cartProductCount: number = 0; // número de productos
  private subscriptions: Subscription = new Subscription();
  user: User | null = null;

  constructor(
    public authService: AuthService,
    public router: Router,
    public cartService: CartService,
    public messageService: MessageService
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
        label: 'Tienda',
        icon: '',
        routerLink: '/catalog',
      },
      {
        label: 'Sobre nosotros',
        icon: '',
        routerLink: '/about-us',
      },
      {
        label: 'Acceder',
        icon: '',
        visible: !this.authService.isAuthenticated() && this.isMobile(),
        routerLink: '/login',
      }
    ];

    window.addEventListener('resize', this.isMobile);

  }

   // Detectar si es móvil
   isMobile(): boolean {
    return window.innerWidth <= 960;
  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  // Toast de cerrar sesión
  showLogoutSuccess() {
    this.messageService.add({ key: 'logout',severity: 'success', summary: 'Éxito', detail: 'Has cerrado sesión con éxito' });
  }

  goToLogin(){
    this.router.navigate(['/login']) // Al cerrarse el toast te redirige al login
  }

  authClick() {
    // Cerrar sesión
    if (this.authService.isAuthenticated()) {

      this.authService.logout()
      this.cartService.notifyCartChange();      
      this.showLogoutSuccess() // Muestra el toast al cerrar sesión con éxito

      // Iniciar sesión
    } else {
      this.cartService.actionSource = 'login';
      this.router.navigate(['/login']);
    }
  }
}
