import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, lastValueFrom, map } from 'rxjs';
import { Result } from '../models/result';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { SearchDto } from '../models/searchDto';
import { Review } from '../models/review';
import { User } from '../models/user';
import { ReviewDto } from '../models/reviewDto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL = environment.apiUrl;

  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'jwtToken';

  jwt: string;

  constructor(private http: HttpClient) { }

  async get<T = void>(path: string, params: any = {}, responseType = null): Promise<Result<T>> {
    const url = `${this.BASE_URL}${path}`;
    const request$ = this.http.get(url, {
      params: new HttpParams({ fromObject: params }),
      headers: this.getHeader(),
      responseType: responseType,
      observe: 'response',
    });

    return this.sendRequest<T>(request$);
  }

  async post<T = void>(path: string, body: Object = {}, contentType = null): Promise<Result<T>> {
    const url = `${this.BASE_URL}${path}`;
    const request$ = this.http.post(url, body, {
      headers: this.getHeader(contentType),
      observe: 'response'
    });

    return this.sendRequest<T>(request$);
  }

  async put<T = void>(path: string, body: Object = {}, contentType = null): Promise<Result<T>> {
    const url = `${this.BASE_URL}${path}`;
    const request$ = this.http.put(url, body, {
      headers: this.getHeader(contentType),
      observe: 'response'
    });

    return this.sendRequest<T>(request$);
  }

  async delete<T = void>(path: string, params: any = {}): Promise<Result<T>> {
    const url = `${this.BASE_URL}${path}`;
    const request$ = this.http.delete(url, {
      params: new HttpParams({ fromObject: params }),
      headers: this.getHeader(),
      observe: 'response'
    });

    return this.sendRequest<T>(request$);
  }

  private async sendRequest<T = void>(request$: Observable<HttpResponse<any>>): Promise<Result<T>> {
    let result: Result<T>;

    try {
      const response = await lastValueFrom(request$);
      const statusCode = response.status;

      if (response.ok) {
        const data = response.body as T;

        if (data == undefined) {
          result = Result.success(statusCode);
        } else {
          result = Result.success(statusCode, data);
        }
      } else {
        result = result = Result.error(statusCode, response.statusText);
      }
    } catch (exception) {
      if (exception instanceof HttpErrorResponse) {
        result = Result.error(exception.status, exception.statusText);
      } else {
        result = Result.error(-1, exception.message);
      }
    }

    return result;
  }

  private getHeader(accept = null, contentType = null): HttpHeaders {
    let header: any = { 'Authorization': `Bearer ${this.jwt}` };
    // Para cuando haya que poner un JWT

    // console.log("JWT: ", this.jwt)

    if (accept)
      header['Accept'] = accept;

    if (contentType)
      header['Content-Type'] = contentType;

    return new HttpHeaders(header);
  }

  // busqueda de productos (con la paginacion) (devuelve los productos y el nº de paginas)
  async searchProducts(searchDto: SearchDto): Promise<{ products: Product[], totalPages: number }> {
    const url = `${this.BASE_URL}Product/search`;
    const headers = this.getHeader();

    const response = await lastValueFrom(
      this.http.post<{ products: Product[], totalPages: number }>(url, searchDto, { headers }));
    return response;
  }

  // devuelve todos los productos
  async allProducts(): Promise<Product[]> {
    const request: Observable<Object> = this.http.get(`${this.BASE_URL}Product/all`);
    const dataRaw: any = await lastValueFrom(request);

    const products: Product[] = [];

    for (const p of dataRaw) {
      const product: Product = {
        id: p.id,
        image: p.image,
        description: p.description,
        price: p.price,
        stock: p.stock,
        name: p.name,
        reviews: p.reviews
      }
      products.push(product);
    }
    return products;
  }

  // devuelve producto con esa id (Para vista detalle de productos)
  async getProduct(id: number): Promise<Product> {
    const request: Observable<Object> =
      this.http.get(`${this.BASE_URL}Product/${id}`);
    const dataRaw: any = await lastValueFrom(request);

    const product: Product = {
      id: dataRaw.productId,
      name: dataRaw.name,
      image: dataRaw.image,
      price: dataRaw.price,
      description: dataRaw.description,
      stock: dataRaw.stock,
      reviews: dataRaw.reviews
    };

    return product;
  }

  // carga de las reseñas segun el producto
  async loadReviews(id: number): Promise<Review[]> {

    const request: Observable<Object> = this.http.get(`${this.BASE_URL}Review/byproduct/${id}`);
    const dataRaw: any = await lastValueFrom(request);

    const reviews: Review[] = [];

    for (const data of dataRaw) {
      const review: Review = {
        reviewId: data.id,
        text: data.text,
        label: data.label,
        date: data.publicationDate,
        userId: data.userId,
        productId: data.productId
      }
      reviews.push(review);
    }
    return reviews;
  }

  async getUser(id: number): Promise<User> {
    const request: Observable<Object> =
      this.http.get(`${this.BASE_URL}User/${id}`);

    const dataRaw: any = await lastValueFrom(request);

    const user: User = {
      userId: id,
      name: dataRaw.name,
      email: dataRaw.email,
      address: dataRaw.address,
      role: dataRaw.role

    };
    return user;
  }

  // devuelve todos los usuarios
  async allUser(): Promise<User[]> {
    const request: Observable<Object> = this.http.get(`${this.BASE_URL}User/allUsers`);
    const dataRaw: any = await lastValueFrom(request);

    const users: User[] = [];

    for (const u of dataRaw) {
      const user: User = {
        userId: u.userId,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role
      }
      users.push(user);
    }
    return users;
  }

  // Crear review
  async publicReview(reviewData: ReviewDto): Promise<Result<any>> {
    return this.post<any>('Review/newReview', reviewData);
  }

  // Elimina usuario
  deleteUser(idUser: number): Observable<any> {
    const url = (`${this.BASE_URL}User/deleteUser/${idUser}`);
    return this.http.delete(url, { responseType: 'text' });
  }

  // actualizar info de usuario
  updateUser(user: any): Observable<any> {
    const headers = this.getHeader(); // para q me lea el token del usuario actual
    return this.http.put(`${this.BASE_URL}User/modifyUser`, user, { headers, responseType: 'text' });
  }

  // actualizar info de producto
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.BASE_URL}Product/modifyProduct/${id}`, product)
  }

  modifyPassword(newPassword: any): Observable<any> {
    const headers = this.getHeader('application/json', 'application/json');
    const body = { newPassword };
    return this.http.put(`${this.BASE_URL}User/modifyPassword`, body, { headers })
  }

  // Crear producto
  async insertProduct(formData: any): Promise<Result<any>> {
    return this.post<any>('Product/insertProduct', formData);
  }

  // Modificar rol del usuario
  modifyRole(userId: number, newRole: string): Observable<any> {
    const headers = this.getHeader('application/json', 'application/json');
    const body = {
        userId: userId,
        newRole: newRole
    }
    return this.http.put(`${this.BASE_URL}User/modifyUserRole`, body, { headers })
  }

}

