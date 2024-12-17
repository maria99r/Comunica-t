import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NavComponent } from "./components/nav/nav.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, RouterModule, SweetAlert2Module, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Comunica-T';
  ngOnInit(): void {
    //console.log(window.ethereum);
  }
}
declare global {
  interface Window {
  ethereum: any;
  }
}
