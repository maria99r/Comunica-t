import { Component, OnInit } from '@angular/core';
import { NavComponent } from "../../components/nav/nav.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Product } from '../../models/product';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NavComponent, FooterComponent, InputTextModule, FormsModule, PaginatorModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit{

  public readonly IMG_URL = environment.apiImg;

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  products: Product[] = [];
  
  query: string = '';
  value: String[];
  currentPage = 1;
  pageSize = 2;
  totalPages = 4;

  constructor(private apiService: ApiService){}

  async ngOnInit(): Promise<void>{
    this.allProducts = await this.apiService.getAllProducts();
  }


  onPageChange($event: PaginatorState) {
    throw new Error('Method not implemented.');
  }

  search(){
  }

}
