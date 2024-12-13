import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ProductCart } from '../../models/productCart';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CheckboxModule, NavComponent, FooterComponent],
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

      // INICIO SINCRONIZACIÓN CARRITO LOCAL -> CARRITO BBDD
      this.cartProducts = this.cartService.getCartFromLocal(); // Obtener el carrito local
      const user = this.authService.getUser();
      const userId = user ? user.userId : null;

      if (this.cartProducts.length > 0) { // Si hay al menos un producto, el carrito local existe.

        //console.log("Hay carrito local")
        if (this.cartService.actionSource == 'login') {

          // Si se viene desde el login, se sincronizan los carritos
          await this.cartService.addLocalCartToUser(userId, this.cartProducts)
          localStorage.removeItem('cartProducts') // Una vez sincronizados, se borra el local
         // console.log("Se ha eliminado el carrito local");
        } else if (this.cartService.actionSource == 'checkout') {

          // Si se viene desde el botón de pagar, es un pago exprés y no se sincronizan
         // console.log("Has accedido desde pagar, no se sincroniza nada.");
        }
      } else {

        //console.log("No hay carrito local")
      }
      // FIN SINCRONIZACIÓN CARRITOS

      // Notificar el cambio en la cantidad de productos del carrito
      this.cartService.notifyCartChange();
      
      const name = user ? user.name : null;
      
      Swal.fire({ // Cuadro de diálogo
        title: "Inicio de sesión con éxito",
        text: `¡Hola, ${name}!`,
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didClose: () => this.redirect()
      });

    } else {
      Swal.fire({ // Cuadro de diálogo
        title: "Usuario o contraseña incorrectos",
        icon: "error",
        confirmButtonText: "Vale"
      });
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

  // redirigir al usuario desde el registro
  redirectToSignup() {
    this.router.navigate(['/signup'], { queryParams: { redirectTo: this.redirectTo } });
  }
}