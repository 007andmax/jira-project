import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private apiUrl = environment.apiUrl;
  public filteredCompanyUpdate: EventEmitter<any> = new EventEmitter();
  public filteredCompany: {
    name: '',
    id: ''
  };
  public clientsCompany = new Subject<any>();

  constructor(
    private http: HttpClient
  ) {
    this.getCompaniesList();
  }

  getCompaniesList() {
    return this.http.get(this.apiUrl + 'company/clients').subscribe((response)=> {
      this.clientsCompany.next(response);
    })
  }

  setFilteredCompnay(company) {
    this.filteredCompany = company;
    this.filteredCompanyUpdate.emit(company);
  }

}
