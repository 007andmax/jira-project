import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Invoice } from '../../components/billing/invoices/class/invoice';
import { CompaniesStateService } from '../../states/company/companies-state.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private apiUrl = environment.apiUrl;

  /**
   * Product api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
   
  ) { }

  public getInvoices(data) {
    return this.http.post(`${this.apiUrl}receivable`,data).pipe(map((res: any) => res.map(item => new Invoice(item))));
  }
}
