import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/ng2/environments/environment';

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
    return this.http.get(`${this.apiUrl}data/actualNumber?type=${type}`);
  }

  invoiceContact(){
    // https://dev.quicktech.com/settings/emailPages/invoiceContact
    return this.http.get(`${this.apiUrl}settings/emailPages/invoiceContact`);
  }

  taxNumber(){
    return this.http.get(`${this.apiUrl}settings/emailPages/taxNumber`);
  }

  termsAndConditions(){
    return this.http.get(`${this.apiUrl}settings/emailPages/termsAndConditions`);
  }
  

}
