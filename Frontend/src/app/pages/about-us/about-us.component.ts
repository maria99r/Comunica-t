import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { NavComponent } from "../../components/nav/nav.component";


@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [FooterComponent, NavComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {


}


