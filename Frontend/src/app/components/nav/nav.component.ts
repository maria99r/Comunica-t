import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';



@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MenubarModule, ImageModule, RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  name: string | null = null; // nombre del usuario
  userId: number | null = null; // id del usuario
  cartProductCount: number = 0; // número de productos

  constructor(public authService: AuthService, public router: Router, public cartService: CartService) { }

  items: MenuItem[] = [];

  ngOnInit() {

    // usuario logueado
    const user = this.authService.getUser();
    this.name = user ? user.name : null;
    this.userId = user ? user.userId : null;

    // actualizar número de productos
    this.updateCartProductCount();

    // Nav items
    this.items = [
      {
        label: 'Inicio',
        icon: '',
        routerLink: '/'
      },
      {
        label: 'Tienda',
        icon: '',
        routerLink: '/catalog'
      },
      {
        label: 'Sobre nosotros',
        icon: '',
        routerLink: '/about-us'
      }
    ];
  }

  // actualizar el número de productos del carrito
  async updateCartProductCount(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      // si el usuario está logueado, se obtiene el carrito de la base de datos
      try {
        const userId = this.userId;
        const cart = await this.cartService.getCartByUser(userId);

        if (cart.products === null) {

          this.cartProductCount === 0;
        } else {

          cart.products.forEach((product) => // Recorre el carrito y suma las cantidades
            this.cartProductCount += product.quantity)
          console.log("Cantidad de productos: " + this.cartProductCount)
        }
      } catch (error) {

        console.error('Error al obtener el carrito de la base de datos:', error);
        this.cartProductCount = 0;
      }
    } else {
      // si no lo está, se obtiene del localStorage
      const cart = this.cartService.getCartFromLocal();
      cart.forEach((product) => // Recorre el carrito y suma las cantidades
        this.cartProductCount += product.quantity)
      console.log("Cantidad de productos: " + this.cartProductCount)
    }

  }

  authClick() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}