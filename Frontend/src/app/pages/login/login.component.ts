import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthRequest } from '../../models/auth-request';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductCart } from '../../models/productCart';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  readonly PARAM_KEY: string = 'redirectTo';
  private redirectTo: string = null;

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  jwt: string = '';

  cartProducts: ProductCart[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService
  ) {}

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

  async submit() {
    const authData = { email: this.email, password: this.password };
    const result = await this.authService.login(authData, this.rememberMe);

    if (result.success) {
      this.jwt = result.data.accessToken;
      alert('Has iniciado sesión correctamente.');
      console.log('Inicio de sesión exitoso', result);

      if (this.rememberMe) {
        localStorage.setItem('jwtToken', this.jwt);
      }

      this.cartProducts = this.cartService.getCartFromLocal(); // Obtener el carrito local
      const user = this.authService.getUser();
      const userId = user ? user.userId : null;
      
      if (this.cartProducts.length > 0) { // Si hay al menos un producto, sí hay carrito local.
        console.log("Hay carrito local")
        await this.cartService.addLocalCartToUser(userId, this.cartProducts)
        console.log("Productos carrito local 1: ", this.cartProducts)
        localStorage.removeItem('cartProducts')
      } else{
        console.log("No hay carrito local")
      }

      // Si tenemos que redirigir al usuario, lo hacemos
      if (this.redirectTo != null) {
        this.router.navigateByUrl(this.redirectTo);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      alert('Datos de inicio de sesión incorrectos.');
    }
  }
}