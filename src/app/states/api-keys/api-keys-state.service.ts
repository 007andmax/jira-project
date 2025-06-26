import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysStateService {
  onAdd: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public openAddAside() {
    this.onAdd.emit(null);
  }
}
