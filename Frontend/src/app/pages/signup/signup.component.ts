import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, NgIf, ToastModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  myForm: FormGroup;
  readonly PARAM_KEY: string = 'redirectTo';
  private redirectTo: string = null;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private cartService: CartService
  ) {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
      { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Obtiene la URL a la que el usuario quería acceder
    const queryParams = this.activatedRoute.snapshot.queryParamMap;

    if (queryParams.has(this.PARAM_KEY)) {
      this.redirectTo = queryParams.get(this.PARAM_KEY);
    }
  }

  // Validator personalizado
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPasswordControl = form.get('confirmPassword');
    const confirmPassword = confirmPasswordControl?.value;

    if (password !== confirmPassword && confirmPasswordControl) {
      confirmPasswordControl.setErrors({ mismatch: true });
    } else if (confirmPasswordControl) {
      confirmPasswordControl.setErrors(null);
    }
  }

  async submit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      const signupResult = await this.authService.signup(formData); // Registro

      if (signupResult.success) {

        const authData = { email: formData.email, password: formData.password };
        const loginResult = await this.authService.login(authData, false);

        if (loginResult.success) {

          // Notificar el cambio en la cantidad de productos del carrito
          this.cartService.notifyCartChange();

          const user = this.authService.getUser();
          const name = user ? user.name : null;

          this.throwDialog("signupSuccess", "Te has registrado con éxito.")

        } else {
          this.throwError("signupError", "Error en el inicio de sesión");
        }

      } else {
        this.throwError("signupError", "Error en el registro");
      }

    } else {
      this.throwError("signupError", "Formulario no válido");
    }

  }

  // redirigir al usuario
  redirect() {
    if (this.redirectTo != null) {
      this.router.navigateByUrl(this.redirectTo);
    } else {
      this.router.navigate(['/']);
    }
  }

  // Cuadro de notificación de éxito
  throwDialog(key: string, texto: string) {
    this.messageService.add({ key: key, severity: 'success', summary: 'Éxito', detail: texto })
  }

  // Cuadro de notificación de error
  throwError(key: string, error: string) {
    this.messageService.add({ key: key, severity: 'error', summary: 'Error', detail: error })
  }
}