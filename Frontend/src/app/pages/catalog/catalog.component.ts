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
import { CriterioOrden } from '../../models/searchDto';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [NavComponent, FooterComponent, InputTextModule, 
    FormsModule, PaginatorModule, RouterModule, SelectButtonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {

  public readonly IMG_URL = environment.apiImg;

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  query: string = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 0;

  sortOrder: boolean = true;  // asc por defecto
  sortCriterio: CriterioOrden = CriterioOrden.Name; // nombre por defecto

  constructor(private apiService: ApiService) { }

  // al cargar la pagina se cargan todos lo productos
  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  // metodo que carga los productos
  async loadProducts(): Promise<void> {
    const searchDto = {
      consulta: this.query,
      Criterio: this.sortCriterio, 
      Orden: this.sortOrder, //por defecto asc
      CantidadPaginas: this.pageSize,
      PaginaActual: this.currentPage,
    };
    try {
      const result = await this.apiService.searchProducts(searchDto);
      this.filteredProducts = result.products;
      this.totalPages = result.totalPages;
    }
    catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  }

  // al avanzar la pagina
  onPageChange(event: PaginatorState) {
    this.currentPage = event.page + 1;
    this.loadProducts();
  }

  // cuando cambie criterio de orden se vuelve a cargar la pagina
  onSortChange(criterio: CriterioOrden) {
    this.sortCriterio = criterio;
    this.loadProducts();
  }

  // cuando cambie el orden se vuelve a cargar la pagina
  onOrderChange(order: boolean) {
    this.sortOrder = order;
    this.loadProducts();
  }

  // al darle al boton de buscar
  search() {
    this.currentPage = 1;
    this.loadProducts();
    console.log("Datos enviados:", {
      query: this.query,
      currentPage: this.currentPage,
      pageSize: this.pageSize,
    });
  }

  // nº de productos por pagina
  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.loadProducts();
  }

}
