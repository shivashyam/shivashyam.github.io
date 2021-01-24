import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../model/product';
import { User } from '../model/user';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Discount } from '../model/discount';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products/all`);
  }

  public getNewProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products/new`);
  }
  public getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products/featured`);
  }
  public getArchivedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products/all`);
  }

  public getProductsById(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products/category/${categoryId}`);
  }

  public getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.host}/products/category/${categoryId}`);
  }

  public addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.host}/products/save`, product);
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.host}/products/update`, product);
  }

  public deleteProduct(id: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/products/delete/${id}`);
  }


}
