import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgClass, MenubarModule, ImageModule, RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  name: string | null = null; // nombre del usuario

  constructor(public authService: AuthService, public router: Router) { }

  items: MenuItem[] = [];

  ngOnInit() {

    // usuario logueado
    const user = this.authService.getUser();
    this.name = user ? user.name : null;


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

  authClick() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }

 

}
