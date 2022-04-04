import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminPublicStateService {
  onOpen: EventEmitter<any> = new EventEmitter();
  constructor() { }
  public showAside() {
    this.onOpen.emit(null);
  }
}
