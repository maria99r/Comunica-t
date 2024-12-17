import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardModule, FieldsetModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
