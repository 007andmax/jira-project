import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/ng2/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceTicketsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * get company profile
   */
  companyProfile() {
    return this.http.get(`${this.apiUrl}settings/companyProfile/`);
  }

  /**
   * get current company
   */
  currentCompany() {
    return this.http.get(`${this.apiUrl}company/current`);
  }

  /**
   * actual number
   * @param type 
   */
  actualNumber(type: string) {
    return this.http
      .get(`${this.apiUrl}data/actualNumber?type=${type}`)
      .pipe(map(data => data));
  }

  /**
   * get invoice contact
   */
  getInvoiceContact() {
    return this.http
      .get(`${this.apiUrl}settings/emailPages/invoiceContact`)
      .pipe(map(data => data));
  }

  /**
   * get tax number
   */
  getTaxNumber() {
    return this.http
      .get(`${this.apiUrl}settings/emailPages/taxNumber`)
      .pipe(map(data => data));
  }

  /**
   * update tax number
   * @param taxIds
   */
  TaxNumber(taxIds: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}settings/emailPages/taxNumber`, taxIds)
      .pipe(map(data => data));
  }

  public updateTermsAndConditions(termsAndConditions) {
    return this.http.put(this.apiUrl + `settings/companyProfile/invoiceSettings`, {
      emailSettingPageNumberFormDto: {
        termsAndConditions: termsAndConditions
      }
    });
  }

  /**
   * terms and conditions
   */
  termsAndConditions() {
    return this.http
      .get(`${this.apiUrl}settings/emailPages/termsAndConditions`)
      .pipe(map(data => data));
  }

  /**
   * updated ticket setting
   * @param ticketForm 
   */
  updateTicketsetting(ticketForm: any) {
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/ticketSettings`,
      ticketForm
    );
  }

  /**
   * updated invoice contact
   * @param invoice 
   */
  updateInvoiceContact(invoice) {
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/invoiceSettings`,
      invoice
    );
  }

  /**
   * update quoutes setting 
   * @param quote 
   */
  updateQuotesSettings(quote: any) {
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/saleQuoteSettings`,
      quote
    );
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}
