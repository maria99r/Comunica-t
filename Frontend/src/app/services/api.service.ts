import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
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
      id: id,
      name: dataRaw.name,
      email: dataRaw.email,
      address: dataRaw.address,
      role: dataRaw.role

    };
    return user;
  }

  async publicReview(reviewData: ReviewDto): Promise<Result<any>> { // Registro
    return this.post<any>('Review/newReview', reviewData);
  }



}

