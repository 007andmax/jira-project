import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiPasswordManagerService {

  public apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRecords() {
    return this.http.get(this.apiUrl + 'passwordRecords');
  }
}
