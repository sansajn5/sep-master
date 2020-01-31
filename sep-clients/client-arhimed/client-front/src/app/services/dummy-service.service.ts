import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DummyServiceService {

  constructor(private http: HttpClient) {}


  public getPaymentMethods(): Observable<any> {
    return this.http.get('http://localhost:8010/payments');
  }
}
