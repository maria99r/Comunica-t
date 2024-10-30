import { Component } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NavComponent, FooterComponent, InputTextModule, FormsModule, PaginatorModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {

  value: String[];
  first: number;
  rows: unknown;

onPageChange($event: PaginatorState) {
  throw new Error('Method not implemented.');
}

}
