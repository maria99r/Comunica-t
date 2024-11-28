import { Component, OnInit  } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FooterComponent, NavComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent  implements OnInit{
  user: User | null = null; // Datos del usuario
  isEditing = false; // Modo edición
  orders: any[] = []; // Lista de pedidos

  constructor(private authService: AuthService) {}

  // Obtiene los datos del usuario autenticado
  ngOnInit() {
    this.user = this.authService.getUser(); 
  }

  // Lógica para habilitar la edición solo en el campo necesario
  toggleEdit(field: string) {
    this.isEditing = !this.isEditing;
  }
}
