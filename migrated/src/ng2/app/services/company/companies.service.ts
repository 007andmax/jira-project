import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';

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

  constructor(
    private http: HttpClient
  ) {}

  getCompaniesList() {
    return this.http.get(this.apiUrl + 'company/clients');
  }

  setFilteredCompnay(company) {
    this.filteredCompany = company;
    this.filteredCompanyUpdate.emit(company);
  }

}
