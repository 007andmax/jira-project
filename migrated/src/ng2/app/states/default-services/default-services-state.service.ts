import { EventEmitter, Injectable } from '@angular/core';
import { DefaultServices } from '../../components/billing/default-services/class/default-service';

@Injectable({
  providedIn: 'root'
})
export class DefaultServicesStateService {
  serviceForRemove: DefaultServices = null;
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public setServiceForRemove(data) {
    this.serviceForRemove = data;
  }
  public getServiceForRemove() {
    return this.serviceForRemove;
  }
  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public getShowAsideForAdd() {
    return this.showAsideForAdd;
  }
}
