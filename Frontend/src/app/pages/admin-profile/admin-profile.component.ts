import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { ProductDto } from '../../models/productDto';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent, FormsModule, DropdownModule, CommonModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  user: User | null = null // datos del usuario
  isEditing = false // modo edición
  orders: any[] = [] // lista de pedidos
  products: Product[] = [] // Lista de productos
  users: User[] = [] // lista de usuarios
  selectedRole: string

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
  
    let element = document.getElementById("newProduct");
    element.setAttribute("hidden", "hidden");
  }

  //logica para habilitar la edición solo en el campo necesario
  toggleEdit(field: string) {
    this.isEditing = !this.isEditing;
  }

  toggleInsertProduct(): void { // Muestra u oculta el div de insertar productos
    let element = document.getElementById("newProduct");
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
          price: this.insertProductPrice * 100,
          stock: this.insertProductStock,
          description: this.insertProductDescription,
          image: this.insertProductImage
        };

        await this.apiService.insertProduct(productData);
        console.log("Producto creado con éxito")
      }
    } catch (error) {
      alert("Error al crear el producto")
      console.error("Error al crear el producto: ", error);
    }
    this.products = await this.apiService.allProducts(); // Recargar lista de productos automáticamente
  }

  async deleteUser(id: number) {
    const confirmation = confirm(`¿Estás seguro de que deseas borrar el usuario con id ${id}?`);
    console.log(confirmation)
    if(confirmation){
      console.log(id);
      await this.apiService.deleteUser(id);
      console.log("Usuario", id, "eliminado con éxito")
    } 
    this.users = await this.apiService.allUser(); // Recargar lista de usuarios automáticamente
  }

  async modifyUserRole(userId: number){
    if (this.user.role === "Admin"){
      await this.apiService.modifyRole(userId)
    }
  }
}