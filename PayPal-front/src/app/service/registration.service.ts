import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

    constructor (
        private http:HttpClient
    ) { }

    public createUser(data: any): Observable<any> {
        return this.http.post(`http://localhost:8082/api/register`, data);
    }

}