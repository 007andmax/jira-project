import { Injectable } from '@angular/core';
import { BillableProfile } from '../../components/billing/billable/class/billable-profile';

@Injectable({
  providedIn: 'root'
})
export class BillableStateService {
  billableProfile:BillableProfile;
  constructor() { }

  public getBillableProfile() {
    return this.billableProfile;
  }
  public setBillableProfile(data) {
    this.billableProfile = data;
  }
}
