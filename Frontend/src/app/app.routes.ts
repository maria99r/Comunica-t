import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Ruta pantalla inicio home
    { path: 'login', component: LoginComponent }, // Ruta login
    { path: 'signup', component: SignupComponent}, // Ruta registro
    { path: 'catalog', component: CatalogComponent}, // Ruta catálogo
    { path: 'about-us', component: AboutUsComponent}, //Ruta sobre nosotros   
    { path: 'product/:id', component: ProductDetailComponent },  // Ruta detalles de producto
    { path: 'cart', component: CartComponent}  //Ruta carrito
];