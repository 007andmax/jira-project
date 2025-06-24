import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";;

import { environment } from "../../../environments/environment";
import { map, tap } from 'rxjs/operators';
import { CategoryProductitem } from 'src/class/category-product-item';
import { InventoryItem } from '../../components/inventory/class/inventory-item';
import { CategoryProduct } from '../../interfaces/product/category-product';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService
  ) { }

  validateForRemoveProductType(id) {
    return this.http.get(`${this.apiUrl}products/types/validate/${id}`);
  }

  /**
   * Get products categories
   */
  public addProductType(data) {
    return this.http.post(`${this.apiUrl}products/types`, { title: data }).pipe(
      tap(data => {
        this.toastrService.success("The new product type has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  /**
  * Get products categories
  */
  public setProductType(productTypeId, productIds, active = null) {
    let data: any = {
      "productIds": productIds
    }
    if (productTypeId) data.productTypeId = productTypeId;
    if (active != null) data.active = active;
    return this.http.put(`${this.apiUrl}products/update`, data).pipe(
      tap(res => {
        this.toastrService.success("Product type has been successfully changed");
        this.appStateService.changeDetectorRef();
        return res;
      }));
  }

  /**
  * Get products categories
  */
  public removeProductType(id) {
    this.appStateService.setCustomeError(true, "The error has occurred, please check your entries");
    return this.http.delete(`${this.apiUrl}products/types/${id}`).pipe(
      tap(data => {
        this.appStateService.setCustomeError(false);
        this.toastrService.success("The Product type has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  /**
  * Get products categories
  */
  public editProductType(id, data) {
    return this.http.put(`${this.apiUrl}products/types/${id}`, { title: data }).pipe(
      tap(data => {
        this.toastrService.success("The product type has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  /**
  * Get products categories
  */
  public getCategories(needArchived = false) {
    return (needArchived ? this.http.get(`${this.apiUrl}products/autocompleteList?needArchived=${needArchived}`) : this.http.get(`${this.apiUrl}products/autocompleteList`)).pipe(map((data: any) => data.map(item => new CategoryProductitem(item))));
  }

  /**
 * Get products categories
 */
  public getProductsTypes() {
    return this.http.get(`${this.apiUrl}products/types/filtered?titleSortDirection=desc&page=0&size=1000`);
  }

  /**
  * validate product name
  */
  public validateProductManufacture(manufacture, id) {
    return this.http.get(`${this.apiUrl}products/isMfgUnique?manufacture=${manufacture}&id=${id}`);
  }

  public validateproductForRemove(id) {
    return this.http.get(`${this.apiUrl}products/validate/${id}`);
  }

  /**
   * validate product name
   */
  public validateProductILC(ilc, id) {
    return this.http.get(`${this.apiUrl}products/isILCUnique?ilc=${ilc}&id=${id}`);
  }

  /**
  * remove product 
  */
  public removeProduct(id) {
    return this.http.delete(`${this.apiUrl}products/${id}`).pipe(
      tap(data => {
        this.toastrService.success("The product has been successfully removed");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  /**
  * remove category 
  */
  public removeCategory(id) {
    return this.http.delete(`${this.apiUrl}products/categories/${id}`).pipe(
      tap(data => {
        this.toastrService.success("Category removed successfully");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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
        glNumber: category.glNumber,
        products: []
      }
      return item;
    })));
  }

  /**
 * Get products categories
 */
  public getProducts(active, typeId = null) {
    return this.http.get(`${this.apiUrl}products/?active=${active}${typeId ? '&typeId=' + typeId : ''}`).pipe(map((data: any) => data.map(item => new InventoryItem(item))));
  }


  public getProduct(product_id) {
    return this.http.get(`${this.apiUrl}products/${product_id}/view`).pipe(map((data: any) => new InventoryItem(data)));
  }

  /**
* add  category
*/
  public addCategory(name, glNumber) {
    return this.http.post(`${this.apiUrl}products/categories`, { name: name, glNumber: glNumber }).pipe(
      tap(data => {
        this.toastrService.success("The new category has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  public editCategory(id, name) {
    return this.http.put(`${this.apiUrl}products/categories`, { id: id, name: name }).pipe(
      tap(data => {
        this.toastrService.success("The  category has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public setGlNumberCategory(id, glNumber) {
    return this.http.put(`${this.apiUrl}products/categories`, { id: id, glNumber: glNumber }).pipe(
      tap(data => {
        this.toastrService.success("The  category has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }


  /**
* add product
*/

  public addProduct(data) {
    return this.http.post(`${this.apiUrl}products`, data);
  }
  public editProduct(data) {
    return this.http.post(`${this.apiUrl}products`, data).pipe(
      tap(data => {
        this.toastrService.success("The product has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

}
