import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { Subject } from "rxjs";
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
    private http: HttpClient,
    private toastrService: ToastrService,
    private appStateService: AppStateService
  ) { }

  public deArchive(id) {
    return this.http.get(this.apiUrl + 'company/dearchive/' + id);
  }

  /**
   * Get all companies list
   */
  public getCompaniesList() {
    return this.http.get(this.apiUrl + 'company/clients');
  }

  public getCompaniesListByFilter(data) {
    return this.http.post(this.apiUrl + 'company/filter', data);
  }
  public getCompany(id) {
    return this.http.get(this.apiUrl + `company/${id}/data`);
  }

  public checkCompanyName(id, name) {
    return this.http.get(this.apiUrl + `company/isCompanyNameUnique?id=${id}&name=${name}`);
  }

  public checkCompanyDomain(id, domain) {
    return this.http.get(this.apiUrl + `company/isCompanyDomainUnique?domain=${domain}&id=${id}`);
  }

  public archiveCompany(id) {
    return this.http.get(this.apiUrl + 'company/archive/' + id).pipe(
      tap(data => {
        this.toastrService.success("The company has been successfully archived");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }

  public getClientsByTags(tags) {

    return this.http.post(this.apiUrl + 'company/clientsByTags', tags);

  }
  public getDownloadLink(data) {

    return this.http.post(this.apiUrl + 'data/getAgentDownloadLink', data);

  }
  public createCompany(data) {
    /* let company = data;
     company.onCheckFullVersion();*/
    return this.http.post(this.apiUrl + 'company', data).pipe(
      tap(data => {
        this.toastrService.success("The new company has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public updateCompany(data) {
    // let company = data;
    // company.onCheckFullVersion();
    return this.http.put(this.apiUrl + 'company', data).pipe(
      tap(data => {
        this.toastrService.success("The company has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
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


  public getIndustries() {
    return this.http.get(this.apiUrl + '/company/getIndustries');
  }

  public uploadAvatar(file) {
    return this.http.post(this.apiUrl + 'file?isAvatar=true&ratio=1', { file: file });
  }

  public editCompanyAvatar(id, data) {
    return this.http.post(this.apiUrl + `/company/${id}/logo`, data);
  }

  public setСustomStorage(customKey, value) {
    return this.http.post(this.apiUrl + 'customStorage/user', {
      customKey: customKey,
      value: JSON.stringify(value)
    });
  }

  public getRecentInvoice(name: string) {
    return this.http.post(this.apiUrl + 'receivable', {
      limit: 5,
      offset: 0,
      companyName: name
    });
  }

  public getContractsList(id) {
    return this.http.get(this.apiUrl + `serviceAgreements/${id}/dashboard`);
  }

  public getInvoiceRevenue(data) {
    return this.http.post(this.apiUrl + 'reports/sales/invoiceRevenue', {
      startDate: data.startDate,
      endDate: data.endDate,
      companyId: data.id
    });
  }

  public getTicketGraph(id, frequency) {
    return this.http.get(this.apiUrl + `dashboard/company?companyId=${id}&frequency=${frequency}`);
  }

  public removeTag(id, data) {
    return this.http.put(this.apiUrl + 'commonTags/company/' + id, data);
  }

  public editWoringHours(data) {
    return this.http.put(this.apiUrl + 'company', data);
  }

}
