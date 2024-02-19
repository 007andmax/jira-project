import { EventEmitter, Injectable } from '@angular/core';
import { NonContractServices } from '../../components/billing/non-contract-services/class/non-contract-service';

@Injectable({
  providedIn: 'root'
})
export class NonContractServicesStateService {
  serviceForRemove: NonContractServices = null;
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  showAsideForEdit: EventEmitter<any> = new EventEmitter();
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
  public toggleAsideForEdit(data) {
    this.showAsideForEdit.emit(data);
  }
  public getShowAsideForEdit() {
    return this.showAsideForEdit;
  }
}
