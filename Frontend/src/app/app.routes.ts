import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Ruta pantalla inicio home
    { path: 'login', component: LoginComponent }, // Ruta login
    { path: 'signup', component: SignupComponent}, // Ruta registro
    { path: 'catalog', component: CatalogComponent}, // Ruta catálogo
    { path: 'product/:id', component: ProductDetailComponent }  // Ruta detalles de producto
];