import { Component } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [NavComponent, FooterComponent],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent {

}
