import { Injectable } from '@angular/core';
import { TicketPreviewServicesCompany } from 'src/app/components/billing/ticket-preview-report/class/ticket-preview-services-company';

@Injectable({
  providedIn: 'root'
})
export class TicketPreviewReportStateService {
  servicesCompany: Array<TicketPreviewServicesCompany> = [];
  constructor() { }

  public setServicesCompany(companyId, list) {
    if (this.servicesCompany.find(item => item.companyId == companyId)) {
      let index = this.servicesCompany.findIndex(item => item.companyId == companyId);
      this.servicesCompany[index].services = list;
    } else {
      this.servicesCompany.push(new TicketPreviewServicesCompany(companyId, list))
    }
  }
  public getServicesCompany(companyId) {
    return this.servicesCompany.find(item => item.companyId == companyId)?.services || [];
  }
}
