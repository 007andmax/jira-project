import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {

  private apiUrl = environment.apiUrl;

  /**
   * Device api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }

  /**
   * Get devices from company
   * @param companyId - id of company
   */

  public addCategories(name) {
    return this.http.post(this.apiUrl + `documents/categories`, { name: name });
  }
  public getCategories() {
    return this.http.get(this.apiUrl + `documents/categories`);
  }
  public add(data) {
    return this.http.post(this.apiUrl + `documents`, data);
  }
  public getList() {
    return this.http.get(this.apiUrl + `documents`);
  }
}
