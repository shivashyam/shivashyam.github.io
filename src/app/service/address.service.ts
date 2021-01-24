import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../model/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  public host = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getUserAddresses(userId: string): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.host}/address/all/${userId}`);
  }

}
