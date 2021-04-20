import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CommissionService {
  private CATEGORIES_API = `${API_URL}products/categories`;
  private DEFAULT_SERVICES_API = `${API_URL}services/getDefaultServices`;
  private SPECIAL_SERVICES_API = `${API_URL}serviceAgreements/services`;
  private AGREEMENTRATES_API = `${API_URL}settings/companyProfile/agreementRates`;
  private CURRENT_COMAPNY_API = `${API_URL}company/current`;

  private SET_CATEGORY_RATE_API = `${API_URL}settings/companyProfile/categoryRate`;
  private SET_SERVICE_RATE_API = `${API_URL}settings/companyProfile/serviceRate`;
  private SET_AGREEMENT_RATES_API = `${API_URL}settings/companyProfile/agreementRates`;

  private SET_CLIENT_COMPANIES_INFO_API = `${API_URL}company/clients/info`;
  private GET_COMPANY_API = `${API_URL}company/clients`;
  private GET_USER_API = `${API_URL}users`;
  private SET_TECHLEAD_API = `${API_URL}`;

  constructor(private http: HttpClient,
  ) { }

  /**
   * get categories api
   */
  getCategories(): Observable<ICategory[]> {
    return this.http
      .get<ICategory[]>(this.CATEGORIES_API)
      .pipe(map(data => data));
  }

  /**
   * set category rate based on params
   * @param id
   * @param commissionRate 
   * @param setForOldExpenses 
   */
  setCategoryRate(
    id: string,
    commissionRate: string,
    setForOldExpenses: boolean
  ) {
    return this.http.put(
      `${this.SET_CATEGORY_RATE_API}/${id}?setForOldExpenses=${setForOldExpenses}`,
      {
        commissionRate: commissionRate
      }
    );
  }

  /**
   * set agreement rate based on params
   * @param data 
   * @param setForOldExpenses 
   */
  setAgreementRates(data: any, setForOldExpenses: boolean) {
    return this.http
      .post(
        `${this.SET_AGREEMENT_RATES_API}?setForOldExpenses=${setForOldExpenses}`,
        data
      )
      .pipe(
        map(data => {
          const agreementsCommissions = data || {};
          Object.keys(agreementsCommissions).forEach(key => {
            if (
              key === 'blockTimeContractCommission' ||
              key === 'blockTimeContractCommissionExceeding' ||
              key === 'userOrDeviceContractCommission' ||
              key === 'userOrDeviceContractCommissionExceeding'
            ) {
              agreementsCommissions[key] = +agreementsCommissions[key]
                ? agreementsCommissions[key].toFixed(2)
                : agreementsCommissions[key];
            } else {
              agreementsCommissions[key] = agreementsCommissions[key];
            }
          });
          return agreementsCommissions;
        })
      );
  }

  /**
   * get defaultservice
   */
  getDefaultServices(): Observable<any> {
    return this.http.get(this.DEFAULT_SERVICES_API).pipe(map(data => data));
  }

  /**
   * special services
   */
  getSpecialServices(): Observable<any> {
    return this.http
      .get(this.SPECIAL_SERVICES_API)
      .pipe(map((data: any[]) => data));
  }

  /**
   * agreement commisssions
   */
  agreementRates(): Observable<any> {
    return this.http.get(this.AGREEMENTRATES_API).pipe(
      map(data => {
        const agreementsCommissions = data || {};
        Object.keys(agreementsCommissions).forEach(key => {
          if (
            key === 'blockTimeContractCommission' ||
            key === 'blockTimeContractCommissionExceeding' ||
            key === 'userOrDeviceContractCommission' ||
            key === 'userOrDeviceContractCommissionExceeding'
          ) {
            agreementsCommissions[key] = +agreementsCommissions[key]
              ? agreementsCommissions[key].toFixed(2)
              : agreementsCommissions[key];
          } else {
            agreementsCommissions[key] = agreementsCommissions[key];
          }
        });
        return agreementsCommissions;
      })
    );
  }

  /**
   * set service rate based on params
   * @param id 
   * @param commissionRate 
   * @param setForOldExpenses 
   */
  setServiceRate(
    id: string,
    commissionRate: string,
    setForOldExpenses: boolean
  ) {
    return this.http.put(
      `${this.SET_SERVICE_RATE_API}/${id}?setForOldExpenses=${setForOldExpenses}`,
      {
        commissionRate: commissionRate
      }
    );
  }

  /**
   * get current company
   */
  getCurrentCompany() {
    return this.http.get(`${this.CURRENT_COMAPNY_API}`);
  }

  /**
   * get client companies info
   */
  getClientCompaniesInfo() {
    return this.http.get(`${this.SET_CLIENT_COMPANIES_INFO_API}`);
  }

  /**
   * get companies list
   */
  getCompanies() {
    return this.http.get(`${this.GET_COMPANY_API}`);
  }

  /**
   * get client company
   */
  getUsers() {
    return this.http.get(`${this.GET_USER_API}`);
  }

  /**
   * set Tech lead
   * @param cmpId
   * @param techLeadId 
   */
  setTechLead(cmpId, techLeadId) {
    if (!cmpId || !techLeadId) {
      return;
    }
    console.log("f");
    return this.http.put(
      `${this.SET_TECHLEAD_API}company/${cmpId}/setTechLead/${techLeadId}`,
      ''
    );
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
}

/**
 * inteface ICategory
 */
export interface ICategory {
  commissionRate: number;
  default: boolean;
  id: string;
  isDefault: boolean;
  name: string;
  oldCommissionRate: number;
  productsAmount: number;
}
