import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthRequest } from '../../models/auth-request';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  jwt: string = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  async submit() {
    const authData = { email: this.email, password: this.password };
    const result = await this.authService.login(authData);

    if (result.success) {
      this.jwt = result.data.accessToken;
      alert('Has iniciado sesión correctamente.');
      sessionStorage.setItem('jwtToken', this.jwt);

      if (this.rememberMe) {
        localStorage.setItem('jwtToken', this.jwt);
      }
      
      this.router.navigate(['/']);

    } else {
      alert('Datos de inicio de sesión incorrectos.');
    }
  }

}
