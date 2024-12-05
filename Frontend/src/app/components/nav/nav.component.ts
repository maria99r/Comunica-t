import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';



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

          cart.products.forEach((product) =>
            this.cartProductCount += product.quantity)
          //console.log("(NAV) Cantidad de productos: " + this.cartProductCount)
        }
      } catch (error) {
        console.error('Error al obtener el carrito de la base de datos:', error);
        
        Swal.fire({ 
          title: "Se ha producido un error",
          text: "Error al obtener los productos del carrito.",
          icon: "error",
          confirmButtonText: "Vale"
        });
        
        this.cartProductCount = 0;
      }
    } else {
      
      // si no lo está, se obtiene del localStorage
      const cart = this.cartService.getCartFromLocal();
      cart.forEach((product) => 
        this.cartProductCount += product.quantity)
      console.log("Cantidad de productos: " + this.cartProductCount)
    }

  }

  authClick() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else {
      this.cartService.actionSource = 'login';
      this.router.navigate(['/login']);
    }
  }

  //Funcion para navegar a vista admin o usuario
  navigateToProfile(): void {
    if (this.authService.isAdmin()) { // Verifica si es administrador
      this.router.navigate(['/admin-profile']);
    } else { 
      this.router.navigate(['/user-profile']);
    }
  }
  

}