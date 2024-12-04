import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  user: User | null = null; //datos del usuario
  isEditing = false; //modo edición
  orders: any[] = []; //lista de pedidos
  products: Product[] = []; // Lista de productos

  users: User[] = [] // lista de usuarios

  public readonly IMG_URL = environment.apiImg;

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) { }

  //obtiene los datos del usuario autenticado
  async ngOnInit() {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.user = this.authService.getUser();

    this.products = await this.apiService.allProducts();
    this.users = await this.apiService.allUser();

  }

  //logica para habilitar la edición solo en el campo necesario
  toggleEdit(field: string) {
    this.isEditing = !this.isEditing;
  }

  async deleteUser(id: number) {
    const confirmation = confirm(`¿Estás seguro de que deseas borrar el usuario con id ${id}?`);
    console.log(confirmation)
    if(confirmation){
      const remove = await this.apiService.deleteUser(id); // NO BORRA
      console.log(remove)
    } 

  }
}