import { Injectable } from '@angular/core';
import { environment } from 'src/ng2/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CommissionService {
  private CATEGORIES_API = `${API_URL}products/categories`;
  private DEFAULT_SERVICES_API = `${API_URL}services/getDefaultServices`;
  private SERVICES_API = `${API_URL}serviceAgreements/services`;
  private AGREEMENTRATES_API = `${API_URL}settings/companyProfile/agreementRates`;
  private CURRENT_COMAPNY_API = `${API_URL}company/current`;

  private SET_CATEGORY_RATE_API = `${API_URL}settings/companyProfile/categoryRate`;
  private SET_SERVICE_RATE_API = `${API_URL}settings/companyProfile/serviceRate`;
  private SET_AGREEMENT_RATES_API = `${API_URL}settings/companyProfile/agreementRates`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<ICategory[]> {
    return this.http
      .get<ICategory[]>(this.CATEGORIES_API)
      .pipe(map(data => data));
  }

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

  setAgreementRates(data: any, setForOldExpenses: boolean) {
    return this.http.post(
      `${this.SET_AGREEMENT_RATES_API}?setForOldExpenses=${setForOldExpenses}`,
      data
    );
  }

  getDefaultServices(): Observable<any> {
    return this.http.get(this.DEFAULT_SERVICES_API).pipe(map(data => data));
  }

  getServices(): Observable<any> {
    return this.http.get(this.SERVICES_API).pipe(map(data => data));
  }

  agreementRates(): Observable<any> {
    return this.http.get(this.AGREEMENTRATES_API).pipe(map(data => data));
  }

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

  getCurrentCompany() {
    return this.http.get(`${this.CURRENT_COMAPNY_API}`);
  }
}

export interface ICategory {
  commissionRate: number;
  default: boolean;
  id: string;
  isDefault: boolean;
  name: string;
  oldCommissionRate: number;
  productsAmount: number;
}
