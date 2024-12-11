import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const redirectionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    // Verificamos si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      sessionStorage.setItem('authRedirection', 'true');

      // Navegamos al login indicando que después redireccione a donde queríamos ir en un principio
      router.navigate(['login'], { queryParams: { redirectTo: state.url }});
      return false;
    }

    // Si está autenticado, permitimos la navegación
  return true;
};
