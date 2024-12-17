import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductCart } from '../../models/productCart';
import { CartService } from '../../services/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CheckboxModule,ToastModule],
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
    private cartService: CartService,
    public messageService: MessageService
  ) { }

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
      //console.log('Inicio de sesión exitoso', result);

      if (this.rememberMe) {
        localStorage.setItem('jwtToken', this.jwt);
      }

      // ------------------  INICIO SINCRONIZACIÓN CARRITO LOCAL -> CARRITO BBDD ------------------
      this.cartProducts = this.cartService.getCartFromLocal(); // Obtener el carrito local
      const user = this.authService.getUser();
      const userId = user ? user.userId : null;

      if (this.cartProducts.length > 0) { // Si hay al menos un producto, el carrito local existe.

        if (this.cartService.actionSource == 'login') {

          // Si se viene desde el login, se sincronizan los carritos
          await this.cartService.addLocalCartToUser(userId, this.cartProducts)
          localStorage.removeItem('cartProducts') // Una vez sincronizados, se borra el local
          
        }
      }
      // --------------------------- FIN SINCRONIZACIÓN CARRITOS ---------------------------

      // Notificar el cambio en la cantidad de productos del carrito
      this.cartService.notifyCartChange();

      // Mensaje toast
      this.messageService.add({ key: 'login', severity: 'success', summary: 'Éxito', detail: 'Has iniciado sesión con éxito' });
      this.redirectTo = "/"

    } else {
      this.messageService.add({ key: 'login', severity: 'error', summary: 'Error', detail: 'Error al iniciar sesión' });
    }
  }

  // redirigir al usuario
  redirect() {
    if (this.redirectTo != null) {
      this.router.navigateByUrl(this.redirectTo);
    }
  }

  // redirigir al usuario desde el registro
  redirectToSignup() {
    this.router.navigate(['/signup'], { queryParams: { redirectTo: this.redirectTo } });
  }
}