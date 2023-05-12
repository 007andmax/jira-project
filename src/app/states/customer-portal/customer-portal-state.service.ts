import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerPortalStateService {
  isCustomerPortal: boolean = false;
  constructor() { }
  public setCustomerPortal(data) {
    this.isCustomerPortal = data;
  }
}
