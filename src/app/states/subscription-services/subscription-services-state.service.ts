import { EventEmitter, Injectable } from '@angular/core';
import { SubscriptionServices } from 'src/app/components/billing/subscription-services/class/subscription-services';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionServicesStateService {
  serviceForRemove: SubscriptionServices = null;
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  showAsideForEdit: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public toggleAsideForEdit(data) {
    this.showAsideForEdit.emit(data);
  }
  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public setServiceForRemove(data) {
    this.serviceForRemove = data;
  }
  public getServiceForRemove() {
    return this.serviceForRemove;
  }
}
