import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

    constructor (
        private http:HttpClient
    ) { }

    public createSubscription(data: any): Observable<any> {
        return this.http.post(`http://localhost:8082/api/subscribe`, data);
    }

    public executeAgreement(token: any, merchantId: any, userId: any): Observable<any> {
        return this.http.get(`http://localhost:8082/api/execute-agreement/${token}/${merchantId}/${userId}`);
    }
}