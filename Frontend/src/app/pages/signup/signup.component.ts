import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { Footer } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, NgIf, NavComponent, FooterComponent], //ReactiveFormsModule, FormsModule, NgIf
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  myForm: FormGroup;
  readonly PARAM_KEY: string = 'redirectTo';
  private redirectTo: string = null;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartApi: CartService,
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
        //console.log('Registro exitoso', signupResult);      

        const authData = { email: formData.email, password: formData.password };
        const loginResult = await this.authService.login(authData, false);

        if (loginResult.success) {
          //console.log('Inicio de sesión exitoso', loginResult);

          // Notificar el cambio en la cantidad de productos del carrito
          this.cartService.notifyCartChange();

          const user = this.authService.getUser();
          const name = user ? user.name : null;

          Swal.fire({ // Cuadro de diálogo
            title: "Te has registrado con éxito",
            text: `¡Hola, ${name}!`,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didClose: () => this.redirect()
          });

        } else {
          this.throwError("Error en el inicio de sesión");
        }

      } else {
        this.throwError("Error en el registro");
      }

    } else {
      this.throwError("Formulario no válido");
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

  throwError(error: string) {
    Swal.fire({ // Cuadro de diálogo
      title: "Se ha producido un error",
      text: error,
      icon: "error",
      confirmButtonText: "Vale"
    });
  }
}