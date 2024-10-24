import { Component } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from "../../components/footer/footer.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, CardModule, FieldsetModule, ButtonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
