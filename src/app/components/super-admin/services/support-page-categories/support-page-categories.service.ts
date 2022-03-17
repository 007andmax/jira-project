import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupportPageCategoriesService {

  private apiUrl = environment.apiUrl;

  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }

  public addCategory(data) {
    return this.http.post(this.apiUrl + 'support', data);
  }
  public getCategories() {
    return this.http.get(this.apiUrl + 'support/getAll');
  }
}
