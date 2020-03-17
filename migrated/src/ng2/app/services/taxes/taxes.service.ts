import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {

  private apiUrl = environment.apiUrl;
  constructor( private http: HttpClient) { }


  public getTaxes() {
    return this.http.get(this.apiUrl + 'taxes');
  }

  public addTax(data) {
    return this.http.post(this.apiUrl + 'taxes',data);
  }
}
