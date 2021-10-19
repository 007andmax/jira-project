import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../../components/users/class/user';
import { Company } from '../../interfaces/company/company';

@Injectable({
  providedIn: 'root'
})
export class DraftEmailStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  clear: EventEmitter<any> = new EventEmitter();
  action: string = null;
  selectedUsers: Array<User> = [];
  selectedCompanies: Array<Company> = [];
  constructor() { }

  public addSelectedCompany(data) {
    this.selectedCompanies.push(data);
  }
  public getSelectedCompanies() {
    return this.selectedCompanies;
  }
  public resetSelectedCompanies() {
    this.selectedCompanies = [];
  }
  public removeSelectedCompany(i) {
    this.selectedCompanies.splice(i, 1);
  }

  public setSelectedUser(data) {
    this.selectedUsers = data;
  }
  public addSelectedUser(data) {
    this.selectedUsers.push(data);
  }
  public getSelectedUsers() {
    return this.selectedUsers;
  }
  public resetSelectedUsers() {
    this.selectedUsers = [];
  }
  public removeSelectedUser(i) {
    this.selectedUsers.splice(i);
  }
  public setAction(data) {
    this.action = data;
  }
  public getAction() {
    return this.action;
  }
  public onClear() {
    this.clear.emit(null);
  }
  public getOnClear() {
    return this.clear;
  }
  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public getShowAsideForAdd() {
    return this.showAsideForAdd;
  }
}
