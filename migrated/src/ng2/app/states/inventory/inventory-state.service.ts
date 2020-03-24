import { Injectable, EventEmitter } from '@angular/core';
import { InventoryItem } from '../../components/inventory/class/inventory-item';
import { CategoryProduct } from '../../interfaces/product/category-product';
import { ProductService } from '../../services/product/product.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryStateService {
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  onEditInventory: EventEmitter<InventoryItem> = new EventEmitter();
  categoryForDelete: CategoryProduct = null;
  productForDelete: InventoryItem = null;
  onSortCategory: EventEmitter<any> = new EventEmitter();
  onGetCategories: EventEmitter<any> = new EventEmitter();
  categories = [];
  constructor(private productService: ProductService) { }
  public onInit() {
    this.productService.getCategoriesProducts().subscribe(data => {
      console.log("data",data);
      this.setCategories(data);
      this.onInitGetCategoriess(this.categories);
    })
  
  }
  public getCategories() {
    return this.categories;
  }
  public getOnCategries() {
    return this.onGetCategories;
  }
  public onInitGetCategoriess(data) {
    this.onGetCategories.emit(data);
  }
  public setCategories(data) {
    this.categories = data.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
    1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
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
  public setProductForDelete(data) {
    this.productForDelete = data;
  }
  public getProductForDelete() {
    return this.productForDelete;
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
