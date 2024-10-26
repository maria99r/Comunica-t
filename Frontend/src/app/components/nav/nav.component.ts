import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ImageModule } from 'primeng/image';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [NgClass, MenubarModule, ImageModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  
  items: MenuItem[] = [];

  ngOnInit() {

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
