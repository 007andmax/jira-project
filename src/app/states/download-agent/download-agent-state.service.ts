import { Injectable } from '@angular/core';
import { Company } from '../../interfaces/company/company';

@Injectable({
  providedIn: 'root'
})
export class DownloadAgentStateService {
  company:Company = null;
  constructor() { }

  public setCompnay(data) {
    this.company = data;
  }
  public getCompany() {
    return this.company;
  }
}
