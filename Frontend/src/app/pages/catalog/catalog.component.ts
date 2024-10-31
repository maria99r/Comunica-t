import { Component } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Product } from '../../models/product';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NavComponent, FooterComponent, InputTextModule, FormsModule, PaginatorModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  products: Product[] = [];
  
  query: string = '';
  value: String[];
  first = 1;
  rows = 2;

  constructor(private apiService: ApiService){}

  async ngOnInit(): Promise<void>{
    
  }

onPageChange($event: PaginatorState) {
  throw new Error('Method not implemented.');
}

search(){
}

}
