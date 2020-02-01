import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DummyServiceService {

  constructor(private http: HttpClient) {}

  public getPaymentMethods(): Observable<any> {
   // return this.http.get('http://localhost:8010/payments');
   return this.http.get('http://localhost:8080/payments');
  }

  public createTransaction(data: any): Observable<any> {
    return this.http.post('http://localhost:8080/transaction', data);
   }

   public getUrlForBank(data: any): Observable<any> {
    return this.http.post('http://localhost:8080/get-bank-url', data);
   }
}
