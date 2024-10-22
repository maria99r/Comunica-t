import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgClass, MenubarModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  
  items: MenuItem[] = [];

  ngOnInit() {

    // elementos del menú  
    this.items = [
      {
        label: 'logo',
        icon: '',
        routerLink: '/'
      },
      {
        label: 'Inicio',
        icon: '',
        routerLink: '/'
      },
      {
        label: 'Tienda',
        icon: '',
        routerLink: '/shop'
      },
      {
        label: 'Sobre nosotros',
        icon: '',
        routerLink: '/about-us'
      }
    ];
}
}
