import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/ng2/environments/environment";

@Injectable({
  providedIn: "root"
})
export class TaxesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  isUniqueName(name: string) {
    return this.http.get(`${this.apiUrl}taxes/isUniqueName?name=${name}`);
  }

  saveTaxes(tax: any) {
    // {"name":"test","rate":1,"isDefault":false}
    return this.http.post(`${this.apiUrl}taxes`, tax);
  }

  taxes(tax: any) {
    // {"id":"cbf9630a-e7a8-49e7-9129-680e729960d7","name":"test","rate":1,"isDefault":true,"companyId":null,"productExpenseId":null,"serviceExpenseId":null}
    return this.http.put(`${this.apiUrl}taxes`, tax);
  }

  delete(id: string) {
    // https://dev.quicktech.com/taxes/cbf9630a-e7a8-49e7-9129-680e729960d7
    return this.http.delete(`${this.apiUrl}taxes/${id}`);
  }

  getTaxes(){
    // https://dev.quicktech.com/taxes
    return this.http.get(`${this.apiUrl}taxes`);
    // Response
    // companyId: null
    // id: "e1d02cbd-f1d6-4dd5-b158-30acc9a03889"
    // isDefault: true
    // name: "GST"
    // productExpenseId: null
    // rate: 5
    // serviceExpenseId: null
  }
}
