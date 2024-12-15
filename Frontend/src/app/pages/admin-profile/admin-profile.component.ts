import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Image } from '../../models/image';
import { ImageRequest } from '../../models/image-request';
import { ImageService } from '../../services/image.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FooterComponent, 
            NavComponent, 
            FormsModule, 
            CommonModule, 
            ReactiveFormsModule,
            ToastModule
          ],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  products: Product[] = []; // Lista de productos
  users: User[] = [] // lista de usuarios

  @ViewChild('addEditDialog')
  addOrEditDialog: ElementRef<HTMLDialogElement>;
  
  imageToEdit: Image = null;
  imageToDelete: Image = null;

  selectedProduct: Product = null;
  isEditing = false // modo edición
  isNewPasswordHidden = true // Mostrar div de cambiar contraseña
  isInsertProductHidden = true // Mostrar div de crear producto
  isEditProductHidden = true // Mostrar div de editar producto

  // Datos nuevo producto
  insertProductName: string;
  insertProductPrice: number;
  insertProductStock: number;
  insertProductDescription: string;
  insertProductImage: string;

  newProductForm: FormGroup;
  addOrEditForm: FormGroup;
  editProductForm: FormGroup;
  selectedFile: File;

  rutaImgNewProduct: String = "";
  rutaImgModifyProduct: String = "";


  public readonly IMG_URL = environment.apiImg;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private apiService: ApiService, 
    private formBuild: FormBuilder, 
    private imageService: ImageService,
    private messageService: MessageService
  ) {

    this.newProductForm = this.formBuild.group({
      productName: ['', Validators.required],
      productPrice: [null, Validators.required],
      productStock: [null, Validators.required],
      productDescription: ['', Validators.required],
      productImage: ['', Validators.required]
    });

    this.addOrEditForm = this.formBuild.group({
      name: ['', Validators.required],
      file: [null, Validators.required]
    });

    this.editProductForm = this.formBuild.group({
      name: [''],
      price: [null],
      stock: [null],
      description: [''],
      image: ['']
    });
  }

  //obtiene los datos del usuario autenticado
  async ngOnInit() {
    if (!this.authService.isAuthenticated() || !this.authService.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.products = await this.apiService.allProducts();
    await this.loadUsers();
  }

  // Muestra u oculta el formulario de crear producto
  showInsertProductForm() {
    this.isInsertProductHidden = !this.isInsertProductHidden;
  }

  // Muestra u oculta el formulario de editar producto
  showEditProductForm(product: Product) {

    this.selectedProduct = product;
    this.isEditProductHidden = !this.isEditProductHidden;

    this.editProductForm.patchValue({
      name: product.name,
      stock: product.stock,
      price: product.price/100,
      description: product.description,
      image: product.image
    });

    this.rutaImgModifyProduct = product.image;
  }

  // Editar el rol de un usuario
  async modifyUserRole(userId: number, newRole: string) {
    try {
      this.apiService.modifyRole(userId, newRole).subscribe(
        async () => {
          this.loadUsers();
        }
      );
    } catch (error) {
      console.error("Error al modificar el rol", error)
    }
    this.loadUsers();
  }

  // Eliminar un usuario
  async deleteUser(id: number) {

    const confirmation = confirm(`¿Estás seguro de que deseas borrar el usuario con id ${id}?`);

    if (confirmation) {

      this.apiService.deleteUser(id).subscribe({
        next: async () => {
          this.throwDialog("adminDeleteUser", "Usuario eliminado correctamente.")
          this.loadUsers();
        },
        error: (err) => {
            console.error("Error al eliminar usuario:", err);
        }
      });
    }
  }

  async loadUsers(){
    this.users = await this.apiService.allUser()
  }

  // Crear producto 
  async insertProduct() {
    const formData = new FormData();
    const price = this.newProductForm.get('productPrice').value * 100;
    formData.append('name', this.newProductForm.get('productName').value);
    formData.append('price', price.toString());
    formData.append('stock', this.newProductForm.get('productStock').value.toString());
    formData.append('description', this.newProductForm.get('productDescription').value);
    formData.append('image', this.rutaImgNewProduct.toString());

    try {
      const result = await this.apiService.insertProduct(formData);

      if (result.success) {
        this.throwDialog("adminProduct", "Producto creado con éxito.")
        this.loadProducts()
      }
    } catch (error) {
      console.error('Error al crear el producto: ', error);
    }

    this.rutaImgNewProduct = "";
    this.rutaImgModifyProduct = "";
    this.resetInsertProductForm();

  }

  async loadProducts(): Promise<void> {
    this.products = await this.apiService.allProducts();
  }

  resetInsertProductForm(): void {
    this.insertProductName = '';
    this.insertProductPrice = 0;
    this.insertProductStock = 0;
    this.insertProductDescription = '';
    this.insertProductImage = null;
  }

  // mofidicar producto
  async editProduct(id: number): Promise<void> {

    const price = this.editProductForm.get('price').value * 100;

    const formData = {
      ...this.editProductForm.value,
      price: price,
      image: this.rutaImgModifyProduct 
    };

    this.apiService.updateProduct(id, formData).subscribe(
      () => {
        this.throwDialog("adminProduct", "Producto actualizado correctamente.")
        this.loadProducts()
        this.isEditProductHidden = !this.isEditProductHidden;
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
    }
    );

    this.rutaImgModifyProduct = "";
    this.rutaImgNewProduct = "";

  }

  openDialog(dialogRef: ElementRef<HTMLDialogElement>) {
    dialogRef.nativeElement.showModal();
  }

  closeDialog(dialogRef: ElementRef<HTMLDialogElement>) {
    dialogRef.nativeElement.close();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.newProductForm.patchValue({ productImage: file });
      this.editProductForm.patchValue({ productImage: file });
      this.newProductForm.get('productImage').updateValueAndValidity();
    }
  }

  addImage() {
    this.openDialog(this.addOrEditDialog);
  }

  async createOrUpdateImage() {
    const imageRequest: ImageRequest = {
      name: this.addOrEditForm.get('name')?.value,
      file: this.addOrEditForm.get('file')?.value as File
    };

    if (this.selectedFile) { imageRequest.file = this.selectedFile; }

    // Añadir nueva imagen
    if (this.imageToEdit == null) {
      const request = await this.imageService.addImage(imageRequest);

      if (request.success) {
        this.rutaImgNewProduct = request.data.url;
        this.rutaImgModifyProduct = request.data.url;

        this.closeDialog(this.addOrEditDialog);
      } else {
        alert(`Ha ocurrido un error: ${request.error}`)
      }
    }
    // Actualizar imagen existente
    else {
      const request = await this.imageService.updateImage(this.imageToEdit.id, imageRequest);

      if (request.success) {
        alert('Imagen actualizada con éxito');
        this.closeDialog(this.addOrEditDialog);
      } else {
        alert(`Ha ocurrido un error: ${request.error}`)
      }
    }
  }

  // Cuadro de notificación de éxito
  throwDialog(key: string, texto: string) {
    this.messageService.add({ key: key, severity: 'success', summary: 'Éxito', detail: texto })
  }
}