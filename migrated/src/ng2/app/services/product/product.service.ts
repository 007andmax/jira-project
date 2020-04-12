import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import {  map } from 'rxjs/operators';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';

/**
 * Product service to work with api
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) { }

  /**
   * Get products categories
   */
  public getCategories() {
    return this.http.get(`${this.apiUrl}products/autocompleteList`).pipe( map((data:any) =>  data.map(item => new CategoryProductitem(item))));
  }


}
