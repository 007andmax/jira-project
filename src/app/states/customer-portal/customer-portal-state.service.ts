import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerPortalStateService {
  isCustomerPortal: boolean = false;
  isDefaultPage: boolean = false;
  constructor() { }
  public setCustomerPortal(data) {
    this.isCustomerPortal = data;
  }
  public setCompnayIdInfo(data) {
    localStorage.setItem("company_info_id", data);
  }
}
