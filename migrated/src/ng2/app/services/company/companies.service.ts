import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Subject } from "rxjs";

/**
 * Companies service to work with endpoints
 */
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

  /**
   * Companies api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient
  ) {}

  /**
   * Get all companies list
   */
  public getCompaniesList() {
    return this.http.get(this.apiUrl + 'company/clients').subscribe((response)=> {
      this.clientsCompany.next(response);
    })
  }

  /**
   * Set filtered company
   * @param company - company to set
   */
  public setFilteredCompnay(company) {
    this.filteredCompany = company;
    this.filteredCompanyUpdate.emit(company);
  }

  /**
   * Get tech company
   */
  public getTechCompany() {
    return this.http.get(this.apiUrl + '/company/current');
  }

}
