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

  constructor(private http: HttpClient) {}

  companyProfile() {
    return this.http.get(`${this.apiUrl}settings/companyProfile/`);
  }

  actualNumber(type: string) {
    // https://dev.quicktech.com/data/actualNumber?type=SALE_QUOTE
    // https://dev.quicktech.com/data/actualNumber?type=TICKET
    // https://dev.quicktech.com/data/actualNumber?type=SALE_QUOTE
    // https://dev.quicktech.com/data/actualNumber?type=TICKET
    // https://dev.quicktech.com/data/actualNumber?type=INVOICE
    return this.http
      .get(`${this.apiUrl}data/actualNumber?type=${type}`)
      .pipe(map(data => data));
  }

  getInvoiceContact() {
    // https://dev.quicktech.com/settings/emailPages/invoiceContact
    return this.http
      .get(`${this.apiUrl}settings/emailPages/invoiceContact`)
      .pipe(map(data => data));
  }

  getTaxNumber() {
    return this.http
      .get(`${this.apiUrl}settings/emailPages/taxNumber`)
      .pipe(map(data => data));
  }

  TaxNumber(taxIds: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}settings/emailPages/taxNumber`, taxIds)
      .pipe(map(data => data));
  }

  termsAndConditions() {
    return this.http
      .get(`${this.apiUrl}settings/emailPages/termsAndConditions`)
      .pipe(map(data => data));
  }

  updateTicketForm(ticketForm: any) {
    // {"count":"8501","prefix":"","type":"TICKET"}
    return this.http.put(
      `${this.apiUrl}settings/emailPages/updateNumberForm`,
      ticketForm
    );
  }

  invoiceContact(invoiceForm) {
    // https://dev.quicktech.com/settings/emailPages/invoiceContact
    // {"enabled":true,"firstName":"aadddd","lastName":"aa","email":"jigspatel.04@gmail.com","designation":"aaaa","phoneNumbers":[{"number":"+1 (403) 266-1041","typeNumber":"OFFICE"}]}
    return this.http.put(`${this.apiUrl}settings/emailPages/invoiceContact`, {
      invoiceForm
    });
  }
}
