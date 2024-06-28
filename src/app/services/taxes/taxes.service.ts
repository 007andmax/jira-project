import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService) { }


  public getTaxes() {
    return this.http.get(this.apiUrl + 'taxes');
  }

  public addTax(data) {
    return this.http.post(this.apiUrl + 'taxes', data).pipe(
      tap(data => {
        this.toastrService.success("The new tax has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  /**
  * checked unique name
  * @param name 
  */
  isUniqueName(name: string) {
    return this.http.get(`${this.apiUrl}taxes/isUniqueName?name=${name}`);
  }

  /**
   * saved taxes
   * @param tax 
   */
  saveTaxes(tax: any) {
    return this.http.post(`${this.apiUrl}taxes`, tax).pipe(
      tap(data => {
        this.toastrService.success("The new tax has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  /**
   * edit taxes
   * @param tax 
   */
  editTaxes(tax: any) {
    return this.http.put(`${this.apiUrl}taxes`, tax);
  }

  /**
   * delete 
   * @param id 
   */
  delete(id: string) {
    return this.http.delete(`${this.apiUrl}taxes/${id}`);
  }
}
