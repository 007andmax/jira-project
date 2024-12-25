import { EventEmitter, Injectable } from '@angular/core';
import { SubscriptionServices } from 'src/app/components/billing/subscription-services/class/subscription-services';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionServicesStateService {
  serviceForRemove: SubscriptionServices = null;
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  showAsideForEdit: EventEmitter<any> = new EventEmitter();
  onFastAdd: EventEmitter<any> = new EventEmitter();
  onFastEdit: EventEmitter<any> = new EventEmitter();
  onFastRemove: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public fastRemoveService(data) {
    this.onFastRemove.emit(data);
  }
  public fastAddService(data) {
    this.onFastAdd.emit(data);
  }
  public fastEditService(data) {
    this.onFastEdit.emit(data);
  }
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
