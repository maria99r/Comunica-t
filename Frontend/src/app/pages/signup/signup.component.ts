import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, NgIf], //ReactiveFormsModule, FormsModule, NgIf
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  myForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private cartApi: CartService
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
        alert('Registro exitoso');
        console.log('Registro exitoso', signupResult);

        // creo carrito para usuario
        this.cartApi.createCart(signupResult.data.userId).subscribe({
          next: (response) => {
            console.log('Carrito creado exitosamente:', response);
          },
          error: (err) => {
            console.error('Error al crear el carrito:', err);
          },
        });

        const authData = { email: formData.email, password: formData.password };
        const loginResult = await this.authService.login(authData, false); // Login

        if (loginResult.success) {
          console.log('Inicio de sesión exitoso', loginResult);
          this.router.navigate(['/']);
        } else {
          alert('Error en el inicio de sesión');
        }

      } else {
        alert('Error en el registro');
      }

    } else {
      alert('Formulario no válido');
    }
  }
}