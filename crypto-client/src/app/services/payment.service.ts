import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {

  constructor(
    private http: HttpClient,
  ) { }

  public createOrder(body): Observable<any> {
    return this.http.post(`https://crypto-service-123.herokuapp.com/api/create-order`, body);
  }
}