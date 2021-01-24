import { ShoppingCart } from '../model/shopping-cart';
import { Product } from './../model/product';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';
import { CouponResponse } from '../model/coupon';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public host = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  addToCart(product: Product, userId: string): Observable<CustomHttpRespone> {
    return this.http.post<CustomHttpRespone>(`${this.host}/cart/add/${userId}`, product);
  }

  getUserCart(userId: string): Observable<ShoppingCart[]> {
    return this.http.get<ShoppingCart[]>(`${this.host}/cart/${userId}`);
  }

  deleteCart(id: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/cart/delete/${id}`);
  }

  deleteCartDetail(id: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/cart/delete/cartDetail/${id}`);
  }

  updateCart(cartDetailsId: number, quantity: number): Observable<CustomHttpRespone> {
    return this.http.put<CustomHttpRespone>(`${this.host}/cart/update/${cartDetailsId}/${quantity}`, null);
  }

  applyCoupon(couponCode: string, orderAmount: number): Observable<CouponResponse> {
    return this.http.post<CouponResponse>(`${this.host}/order/applyCoupon/${couponCode}/${orderAmount}`, null);
  }

  calculateDelivery(zip: string): Observable<any>{
    return this.http.post<any>(`${this.host}/geo/zip/${zip}`, null);
  }
}