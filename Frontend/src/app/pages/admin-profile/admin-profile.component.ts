import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { newProductDto } from '../../models/newProductDto';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent, FormsModule, CommonModule, ReactiveFormsModule],
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
  insertProductImage: File

  editProductForm : FormGroup;

  public readonly IMG_URL = environment.apiImg;

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService, private formBuild: FormBuilder) {

        // formulario para modificar producto
        this.editProductForm = this.formBuild.group({
          name: [''],
          price: [''],
          stock: [''],
          image: ['']
        });

  }

  //obtiene los datos del usuario autenticado
  async ngOnInit() {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.user = this.authService.getUser();

    this.products = await this.apiService.allProducts();
    this.users = await this.apiService.allUser();

    // que aparezca oculto al principio
    let element = document.getElementById("newProduct");
    let hidden = element.getAttribute("hidden");
    element.removeAttribute("hidden");
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

        const productData: newProductDto = {
          name: this.insertProductName,
          price: this.insertProductPrice*100,
          stock: this.insertProductStock,
          description: this.insertProductDescription,
          image: this.insertProductImage
        };

        const result = await this.apiService.insertProduct(productData);
        alert("Producto creado .")
      }
    } catch (error) {
      console.error('Error al crear el producto: ', error);
    }

  }

  async deleteUser(id: number) {
    const confirmation = confirm(`¿Estás seguro de que deseas borrar el usuario con id ${id}?`);
    console.log(confirmation)
    if (confirmation) {
      console.log(id);
      const remove = await this.apiService.deleteUser(id); // NO BORRA
      console.log(remove)
    }

  }

  // envia cambios para mofidicar producto
  editProduct(id :number): void {
    if (this.editProductForm.valid) {
      
        this.apiService.updateProduct(id, this.editProductForm.value).subscribe(
          () => {
            this.isEditing = false;
          }
        );
        alert('Producto actualizado correctamente.');
    }
  }

  /*onFileSelected(event: any) {
    const image = event.target.files[0] as File;
    this.newProductForm.patchValue({ file: image });
  }*/
}