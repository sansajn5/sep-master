import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentService {

  constructor(
    private http: HttpClient,
  ) { }

  public postPayment(body): Observable<any> {
    return this.http.post(`http://localhost:8010/api/payment-execute`, body);
  }
}