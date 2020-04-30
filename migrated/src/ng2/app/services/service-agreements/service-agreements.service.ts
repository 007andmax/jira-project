import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceAgreementsService {

 

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  public getServiceAgreements() {
    return this.http.get(this.apiUrl + `serviceAgreements`);
  }
}
