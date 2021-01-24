import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Discount } from '../model/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  public host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getCoupons(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.host}/discount/all`);
  }

  public deleteCoupon(discountId: number ): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/discount/delete/${discountId}`);
  }
}
