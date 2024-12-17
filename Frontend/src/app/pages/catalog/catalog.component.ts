import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { Product } from '../../models/product';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CriterioOrden, SearchDto } from '../../models/searchDto';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [InputTextModule,
            FormsModule, PaginatorModule, RouterModule, SelectButtonModule, 
            CommonModule, ToastModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit {
  public readonly IMG_URL = environment.apiImg;
  private readonly USER_CONFIG = 'user_config';

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading: boolean = true;

  query: string = '';
  currentPage = 1;

  sortOrder: boolean = true; // asc por defecto
  sortCriterio: CriterioOrden = CriterioOrden.Name; // nombre por defecto

  constructor(private apiService: ApiService, private messageService: MessageService) { }

  // al cargar la pagina se cargan todos lo productos
  async ngOnInit(): Promise<void> {
    this.loadUserConfig(); // Cargar la configuración de sessionStorage si existe
    await this.loadProducts();
  }

  // Cargar configuración desde sessionStorage
  private loadUserConfig(): void {
    const userConfig = sessionStorage.getItem(this.USER_CONFIG);
    if (userConfig) {
      try {
        const config = JSON.parse(userConfig);
        this.updateProducts(config);
      } catch (error) {
        console.error('Error al cargar la configuración de usuario:', error);
        this.throwError("catalog", "Error al cargar la configuración de usuario.");
      }
    }
  }

  // Guardar configuración actual en sessionStorage
  private saveUserConfig(): void {
    const config = {
      consulta: this.query,
      Criterio: this.sortCriterio,
      Orden: this.sortOrder,
      PaginaActual: this.currentPage,
    };
    sessionStorage.setItem(this.USER_CONFIG, JSON.stringify(config));
  }

  // metodo que carga los productos
  async loadProducts(): Promise<void> {
    this.isLoading = true;
    const searchDto = {
      consulta: this.query,
      Criterio: this.sortCriterio,
      Orden: this.sortOrder, //por defecto asc
      PaginaActual: this.currentPage,
    };

    this.saveUserConfig(); // Guardar la configuración actual en sessionStorage
    await this.resultProducts(searchDto);
    this.isLoading = false;
  }

  // Ejecutar la búsqueda de productos
  async resultProducts(searchDto: SearchDto): Promise<void> {
    try {
      const result = await this.apiService.searchProducts(searchDto);
      this.filteredProducts = result.products;
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      this.throwError("catalog", "Error al cargar los productos.");
    }
  }

  // Actualizar las propiedades con la configuración de sessionStorage
  updateProducts(config: {
    consulta: string;
    Criterio: CriterioOrden;
    Orden: boolean;
    CantidadPaginas: number;
    PaginaActual: number;
  }) {
    this.query = config.consulta;
    this.sortCriterio = config.Criterio;
    this.sortOrder = config.Orden;
    this.currentPage = config.PaginaActual;

  }

  // cuando cambie criterio de orden se vuelve a cargar la pagina
  onSortChange(criterio: CriterioOrden) {
    this.currentPage = 1;
    this.sortCriterio = criterio;
    this.loadProducts();
  }

  // cuando cambie el orden se vuelve a cargar la pagina
  onOrderChange(order: boolean) {
    this.currentPage = 1;
    this.sortOrder = order;
    this.loadProducts();
  }

  // al darle al boton de buscar
  search() {
    this.currentPage = 1;
    this.loadProducts();
  }

  // nº de productos por pagina
  onPageSizeChange(size: number) {
    this.currentPage = 1;
    this.loadProducts();
  }


  // media de reseñas de cada producto
  calculateAvg(reviews: { label: number }[]): number {
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, review) => acc + review.label, 0);
      return Math.round(sum / reviews.length);
    }
    return 0;
  }

  // Cuadro de notificación de error
  throwError(key: string, error: string) {
    this.messageService.add({ key: key, severity: 'error', summary: 'Error', detail: error })
  }
}
