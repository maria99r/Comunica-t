import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { ProductDto } from '../../models/productDto';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  user: User | null = null; //datos del usuario
  isEditing = false; //modo edición
  orders: any[] = []; //lista de pedidos
  products: Product[] = []; // Lista de productos
  users: User[] = [] // lista de usuarios

  // Datos nuevo producto
  insertProductName: string
  insertProductPrice: number
  insertProductStock: number
  insertProductDescription: string
  insertProductImage: string

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

  toggleInsertProduct(): void { // Muestra u oculta el div de insertar productos
    let element = document.getElementById("nuevoProducto");
    let hidden = element.getAttribute("hidden");

    if (hidden) {
      element.removeAttribute("hidden");
    } else {
      element.setAttribute("hidden", "hidden");
    }
  }

  // Crear producto 
  async insertProduct() {
    try {
      // Validar que el texto de la reseña no sea vacío o contenga solo espacios
      if (!this.insertProductName || !this.insertProductPrice || !this.insertProductStock || !this.insertProductDescription || !this.insertProductImage) {
        alert("El formulario no puede tener datos vacíos.");
      } else {

        const productData: ProductDto = {
          name: this.insertProductName,
          price: this.insertProductPrice,
          stock: this.insertProductStock,
          description: this.insertProductDescription,
          image: this.insertProductImage
        };

        const result = await this.apiService.insertProduct(productData);
      }
    } catch (error) {
      console.error('Error al crear el producto: ', error);
    }

  }

  async deleteUser(id: number) {
    const confirmation = confirm(`¿Estás seguro de que deseas borrar el usuario con id ${id}?`);
    console.log(confirmation)
    if(confirmation){
      console.log(id);
      const remove = await this.apiService.deleteUser(id); // NO BORRA
      console.log(remove)
    } 

  }
}