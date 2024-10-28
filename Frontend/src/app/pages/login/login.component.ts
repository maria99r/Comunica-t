import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthRequest } from '../../models/auth-request';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  jwt: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async submit() {
    const authData: AuthRequest = { email: this.email, password: this.password };
    const result = await this.authService.login(authData);

    if (result.success) {
      this.jwt = result.data.accessToken;
      alert('Has iniciado sesión correctamente.');
      this.router.navigate(['/']);
    } else {
      alert('Datos de inicio de sesión incorrectos.');
    }
  }

}
