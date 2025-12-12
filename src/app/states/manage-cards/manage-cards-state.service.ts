import { EventEmitter, Injectable } from '@angular/core';
import { Card } from 'src/app/components/billing/manage-cards/class/card';

@Injectable({
  providedIn: 'root'
})
export class ManageCardsStateService {
  cardForRemove: Card = null;
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  showAsideForEdit: EventEmitter<any> = new EventEmitter();
  constructor() { }


  public openAsideForAdd() {
    this.showAsideForAdd.emit(true);
  }
  public openAsideForEdit(data) {
    this.showAsideForEdit.emit(data);
  }
  public setCardForRemove(data) {
    this.cardForRemove = data;
  }
  public getCardForRemove() {
    return this.cardForRemove;
  }
}
