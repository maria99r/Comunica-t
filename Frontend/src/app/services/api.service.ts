import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin, lastValueFrom } from 'rxjs';
import { Result } from '../models/result';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';

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
    let header: any = {};

    // Para cuando haya que poner un JWT
    header['Authorization'] = `Bearer ${this.jwt}`;

    if (accept)
      header['Accept'] = accept;

    if (contentType)
      header['Content-Type'] = contentType;

    return new HttpHeaders(header);
  }
  

  // Obtener todos los productos

  async getAllProducts(): Promise<Product[]> {
    const requests: Observable<Object>[] = [];
    
    for (let i = 1; i <= 12; i++) {
      requests.push(this.http.get(`${this.BASE_URL}Product/${i}`));
    }

    const allDataRaw: any[] = await lastValueFrom(forkJoin(requests));
    const products: Product[] = [];

    for (const data of allDataRaw) {
      const product: Product = {
        productId: data.productId,
        name: data.name,
        price: data.price,
        stock: data.stock,
        description: data.description,
        image: data.image
      }
      products.push(product)
    }
    return products;
  }
}
