import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManageCardsStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  constructor() { }


  public openAsideForAdd() {
    this.showAsideForAdd.emit(true);
  }
}
