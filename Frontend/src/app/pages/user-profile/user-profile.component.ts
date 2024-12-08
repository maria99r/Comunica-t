import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  userForm: FormGroup;

  user: any | null = null; //datos del usuario
  isEditing = false; //modo edición
  orders: Order[] = []; //lista de pedidos

  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'jwtToken';

  public readonly IMG_URL = environment.apiImg;

  constructor(private formBuild: FormBuilder, private authService: AuthService,
    private router: Router, private orderApi: OrderService, private apiService: ApiService) {
    // formulario para modificar datoss
    this.userForm = this.formBuild.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      password: ['']
    });
  }

  async ngOnInit() {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.user = this.authService.getUser();

    // poner los datos en el formulario
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: this.user.address,
        password: ''
      });
    }
    this.orders = await this.orderApi.getOrdersByUser(this.user.userId);
  }

  //logica para habilitar la edición solo en el campo necesario
  edit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) { // restaura los datos
      this.userForm.reset(this.user);
    }
  }

  // enlaza productos con sus paginas
  navigateToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  editPassword(){
    
  }

  // envia cambios para mofidicar el usuario
  onSubmit(): void {
    if (this.userForm.valid) {

        this.apiService.updateUser(this.userForm.value).subscribe(
          () => {
            this.isEditing = false;
          }
        );
        alert('Perfil actualizado correctamente.');
    }
  }
}
