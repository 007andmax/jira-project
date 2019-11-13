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
  /* Добавить глобальную переменную списка компаний и запрос должен быть глобальным и один, проверить страницы где уже так забираются компаний и исправить их */
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
    return this.http.get(this.apiUrl + 'company/clients');/*.subscribe((response)=> {
      this.clientsCompany.next(response);
    })*/
  }
  public getCompany(id) {
    return this.http.get(this.apiUrl + `company/${id}/data`);
  }
   
  public checkCompanyName(id,name) {
    return this.http.get(this.apiUrl + `company/isCompanyNameUnique?id=${id}&name=${name}`); 
  }

  public  archiveCompany (id) {
    return this.http.get(this.apiUrl + 'company/archive/' + id);
  }

  public  createCompany (data) {
    let company = data;
    company.onCheckFullVersion();
    return this.http.post(this.apiUrl + 'company',company);
  }
  public  updateCompany (data) {
    let company = data;
    company.onCheckFullVersion();
    return this.http.put(this.apiUrl + 'company',company);
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


  public getIndustries () {
    return this.http.get(this.apiUrl + '/company/getIndustries');
  }

public uploadAvatar (file) {
  return this.http.post(this.apiUrl + 'file?isAvatar=true&ratio=1',{file:file});
}

}
