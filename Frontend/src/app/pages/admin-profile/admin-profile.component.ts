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
import { DropdownModule } from 'primeng/dropdown';
import Swal from 'sweetalert2';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image';
import { CreateOrUpdateImageRequest } from '../../models/create-update-image-request';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent, FormsModule, CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  
  public readonly IMG_URL = environment.apiImg;

  products: Product[] = [] // Lista de productos
  users: User[] = [] // lista de usuarios
  user: User | null = null // datos del usuario
  
  isEditing = false // modo edición
  isNewPasswordHidden = true // Mostrar div de cambiar contraseña
  isInsertProductHidden = true // Mostrar div de crear producto
  isEditProductHidden = true // Mostrar div de editar producto

  userForm: FormGroup
  passwordForm: FormGroup
  editProductForm : FormGroup
  addOrEditForm: FormGroup
  selectedProduct: any = null;
  images: Image[] = [];
  imageToEdit: Image = null;

  // Datos nuevo producto
  insertProductName: string
  insertProductPrice: number
  insertProductStock: number
  insertProductDescription: string
  insertProductImage: File

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private apiService: ApiService,
    private imageService: ImageService, 
    private formBuild: FormBuilder) {

    this.userForm = this.formBuild.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['']
    });

    this.passwordForm = this.formBuild.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
      { validators: this.passwordMatchValidator });

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

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.actualizarUser();

    this.products = await this.apiService.allProducts();
    this.users = await this.apiService.allUser();

    this.addOrEditForm = this.formBuild.group({
      name: [''],
      file: [null]
    });

    await this.upateImageList();
  }

  // -------------------------- INICIO activar o desactivar visibilidad divs --------------------------

  // Habilitar la edición solo en el campo necesario
  edit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) { // Restaura los datos
      this.userForm.reset(this.user);
    }
  }

  // Muestra u oculta el formulario de cambiar contraseña
  showEditPassword() {
    this.isNewPasswordHidden = !this.isNewPasswordHidden;
  }

  // Muestra u oculta el formulario de crear producto
  showInsertProductForm(){
    this.isInsertProductHidden = !this.isInsertProductHidden;
  }

  // Muestra u oculta el formulario de editar producto
  showEditProductForm(product: any){
    this.selectedProduct = { ...product };
    this.isEditProductHidden = !this.isEditProductHidden;
  }

  // -------------------------- FIN activar o desactivar visibilidad de divs --------------------------

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPasswordControl = form.get('confirmPassword');
    const confirmPassword = confirmPasswordControl?.value;

    if (password !== confirmPassword && confirmPasswordControl) {
      confirmPasswordControl.setErrors({ mismatch: true });
    } else if (confirmPasswordControl) {
      confirmPasswordControl.setErrors(null);
    }
  }

  actualizarUser() {
    this.user = this.authService.getUser();

    // Poner los datos en el formulario
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: this.user.address,
      });
    }
  }

  // Envía cambios para modificar el usuario
  onSubmit(): void {
    if (this.userForm.valid) {

      this.apiService.updateUser(this.userForm.value).subscribe(
        () => {
          this.isEditing = false;
          this.authService.updateUserData(this.userForm.value);
        }
      );
      Swal.fire({ // Cuadro de diálogo
        title: "Perfil actualizado correctamente.",
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => this.actualizarUser()
      });
    }
  }

  // Cambiar la contraseña
  editPassword() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('newPassword')?.value;
      
      if (!newPassword) {
        console.error("Error: El campo de la contraseña está vacío.");
        return;
      }

      this.apiService.modifyPassword(newPassword).subscribe(() => {
        Swal.fire({ // Cuadro de diálogo
          title: "Contraseña modificada con éxito.",
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        this.showEditPassword()
      }
      );
    }
  }

  // Editar el rol de un usuario
  async modifyUserRole(userId: number, userRole: string) {
    try {
      await this.apiService.modifyRole(userId, userRole);
      console.log("Rol modificado correctamente: ", userRole)
    } catch (error) {
      console.error("Error al modificar el rol", error)
    }
    this.users = await this.apiService.allUser();
  }

  // Eliminar un usuario
  async deleteUser(id: number) {

    const confirmation = confirm(`¿Estás seguro de que deseas borrar el usuario con id ${id}?`);
    console.log(confirmation)

    if (confirmation) {
      console.log(id);
      await this.apiService.deleteUser(id);
      console.log("Usuario", id, "eliminado con éxito")
    } 
    this.users = await this.apiService.allUser(); // Recargar lista de usuarios automáticamente
  }

  // Crear producto 
  async insertProduct() {
    try {
      // Validar que el texto de la reseña no esté vacío o contenga solo espacios
      if (!this.insertProductName || !this.insertProductPrice || !this.insertProductStock || !this.insertProductDescription || !this.insertProductImage) {
        alert("El formulario no puede tener datos vacíos.");
      } else {

        const productData: newProductDto = {
          name: this.insertProductName,
          price: this.insertProductPrice * 100,
          stock: this.insertProductStock,
          description: this.insertProductDescription,
          image: this.insertProductImage
        };

        await this.apiService.insertProduct(productData);
        alert("Producto creado con éxito")
      }
    } catch (error) {
      alert("Error al crear el producto")
      console.error("Error al crear el producto: ", error);
    }
    this.products = await this.apiService.allProducts(); // Recargar lista de productos automáticamente
  }

  // envia cambios para modificar producto
  editProduct(productId: number): void {
    if (this.editProductForm.valid) {
      
      this.apiService.updateProduct(productId, this.editProductForm.value).subscribe(
        () => {
          this.isEditing = false;
        }
      );
      alert('Producto actualizado correctamente.');
    }
    console.log(this.selectedProduct)
    this.selectedProduct = null;
  }

  // ------------------------------------ LÓGICA IMÁGENES ----------------------------------

  async upateImageList() {
    const request = await this.imageService.getAllImages();

    if (request.success) {
      this.images = request.data;
    }
  }

  onFileSelected(event: any) {
    const image = event.target.files[0] as File;
    this.addOrEditForm.patchValue({ file: image });
  }

  async createOrUpdateImage() {
    const createOrUpdateImageRequest: CreateOrUpdateImageRequest = {
      name: this.addOrEditForm.get('name')?.value,
      file: this.addOrEditForm.get('file')?.value as File
    };

    // Añadir nueva imagen
    if (this.imageToEdit == null) {
      const request = await this.imageService.addImage(createOrUpdateImageRequest);

      if (request.success) {
        alert('Imagen añadida con éxito');
        this.upateImageList();
      } else {
        alert(`Ha ocurrido un error: ${request.error}`)
      }
    } 
    // Actualizar imagen existente
    else {
      const request = await this.imageService.updateImage(this.imageToEdit.id, createOrUpdateImageRequest);

      if (request.success) {
        alert('Imagen actualizada con éxito');
        this.upateImageList();
      } else {
        alert(`Ha ocurrido un error: ${request.error}`)
      }
    }
  }

  // ---------------------------------- FIN LÓGICA IMÁGENES --------------------------------
}