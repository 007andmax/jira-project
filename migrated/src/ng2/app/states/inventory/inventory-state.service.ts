import { Injectable, EventEmitter } from '@angular/core';
import { InventoryItem } from '../../components/inventory/class/inventory-item';
import { CategoryProduct } from '../../interfaces/product/category-product';

@Injectable({
  providedIn: 'root'
})
export class InventoryStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  onEditInventory: EventEmitter<InventoryItem> = new EventEmitter();
  categoryForDelete: CategoryProduct = null;
  onSortCategory: EventEmitter<any> = new EventEmitter();
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
  public setCategoryForDelete(data) {
    this.categoryForDelete = data;
  }
  public getCategoryForDelete() {
    return this.categoryForDelete;
  }
  public setSortCategory(data) {
    this.onSortCategory.emit(data);
  }

  public getOnSortCategory() {
    return this.onSortCategory;
  }
}
