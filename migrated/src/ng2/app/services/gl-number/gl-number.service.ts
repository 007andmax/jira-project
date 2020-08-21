import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';
import { GlNumber } from 'src/ng2/class/gl-number/gl-number';

@Injectable({
  providedIn: 'root'
})
export class GlNumberService {

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
  public getGlNumbers() {
    return this.http.get(`${this.apiUrl}glNumber`).pipe( map((data:any) =>  data.map(item => new GlNumber(item))));
  }

    /**
   * Get products categories
   */
  public addGlNumber(glNumber,description) {
    return this.http.post(`${this.apiUrl}glNumber`,{glNumber:glNumber,description:description});
  }

  public setGlNumberContract(id,type) {
    return this.http.post(`${this.apiUrl}glNumber/${id}/${type}`,{});
  }
}
