import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { map } from 'rxjs/operators';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';
import { InventoryItem } from '../../components/inventory/class/inventory-item';
import { CategoryProduct } from '../../interfaces/product/category-product';

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
    return this.http.get(`${this.apiUrl}products/autocompleteList`).pipe(map((data: any) => data.map(item => new CategoryProductitem(item))));
  }

  /**
  * Get  categories
  */
  public getCategoriesProducts() {
    return this.http.get(`${this.apiUrl}products/categories`).pipe(map((data: any) => data.map(category => {
      let item: CategoryProduct = {
        id: category.id,
        name: category.name,
        productsAmount: category.productsAmount,
        commissionRate: category.commissionRate,
        isDefault: category.isDefault,
        default: category.default,
        products: []
      }
      return item;
    })));
  }

  /**
 * Get products categories
 */
  public getProducts() {
    return this.http.get(`${this.apiUrl}products/`).pipe(map((data: any) => data.map(item => new InventoryItem(item))));
  }

  /**
* Get products categories
*/
  public addCategory(name) {
    return this.http.post(`${this.apiUrl}products/categories`, { name: name });
  }


}
