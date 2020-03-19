import { Injectable, EventEmitter } from '@angular/core';
import { InventoryItem } from '../../components/inventory/class/inventory-item';

@Injectable({
  providedIn: 'root'
})
export class InventoryStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  onEditInventory: EventEmitter<InventoryItem> = new EventEmitter();
  constructor() { }

  public toggleAsideForAdd() {
    this.showAsideForAdd.emit();
  }
  public getShowAsideForAdd() {
    return this.showAsideForAdd;
  }
  public getInventoryFromEdit() {
    return this.onEditInventory;
  }
  public setEditInventory(data) {

    this.onEditInventory.emit(data);
  }
}
