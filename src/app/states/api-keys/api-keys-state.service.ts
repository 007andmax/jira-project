import { EventEmitter, Injectable } from '@angular/core';
import { ApiKeys } from 'src/app/components/setting/company-profile/company-profile-api-keys/class/api-keys';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysStateService {
  onAdd: EventEmitter<any> = new EventEmitter();
  onEdit: EventEmitter<any> = new EventEmitter();
  onFastAdd: EventEmitter<any> = new EventEmitter();
  onFastEdit: EventEmitter<any> = new EventEmitter();
  apiKeyForRemove: ApiKeys;
  constructor() { }

  public setApiKeyForRemove(apiKey: ApiKeys) {
    this.apiKeyForRemove = apiKey;
  }
  public getApiKeyForRemove(): ApiKeys {
    return this.apiKeyForRemove;
  }
  public openAddAside() {
    this.onAdd.emit(null);
  }
  public openEditAside(data) {
    this.onEdit.emit(data);
  }
  public fastAdd(data) {
    this.onFastAdd.emit(data);
  }
  public fastEdit(data) {
    this.onFastEdit.emit(data);
  }
}
