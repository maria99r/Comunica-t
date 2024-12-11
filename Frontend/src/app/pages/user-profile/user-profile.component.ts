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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  userForm: FormGroup;

  passwordForm: FormGroup;
  isNewPasswordHidden = true // Mostrar div de cambiar contraseña

  user: any | null = null; //datos del usuario
  isEditing = false; //modo edición
  orders: Order[] = []; //lista de pedidos

  public readonly IMG_URL = environment.apiImg;

  constructor(private formBuild: FormBuilder, private authService: AuthService,
    private router: Router, private orderApi: OrderService, private apiService: ApiService) {

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
  }

  async ngOnInit() {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.actualizarUser();

    this.orders = await this.orderApi.getOrdersByUser(this.user.userId);

    // ordena los pedidos por fecha de compra a las más recientes primero
    this.orders.sort((a, b) => new Date(b.PaymentDate).getTime() - new Date(a.PaymentDate).getTime());

    let element = document.getElementById("newPassword");
    element.setAttribute("hidden", "hidden");

  }

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

    // poner los datos en el formulario
    if (this.user) {
      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        address: this.user.address,
      });
    }
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

  showEditPassword() {
    let element = document.getElementById("newPassword");
    let hidden = element.getAttribute("hidden");

    if (hidden) {
      element.removeAttribute("hidden");
    } else {
      element.setAttribute("hidden", "hidden");
    }
  }

  // envia cambios para mofidicar el usuario
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
}

