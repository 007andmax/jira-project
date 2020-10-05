import { Injectable, EventEmitter } from '@angular/core';
import { InventoryItem } from '../../components/inventory/class/inventory-item';
import { CategoryProduct } from '../../interfaces/product/category-product';
import { ProductService } from '../../services/product/product.service';
import { InventoryRealTimeService } from './inventory-real-time.service';
import { InventoryChange } from '../../components/inventory/class/inventory-change';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';

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
  onGetProducts: EventEmitter<any> = new EventEmitter();
  onChangeProducts: EventEmitter<InventoryChange> = new EventEmitter();
  categories = [];
  productList:Array<CategoryProductitem> = [];
  constructor(private productService: ProductService,
    private inventoryRealTimeService: InventoryRealTimeService) { }
  public onInit() {
    this.productService.getCategoriesProducts().subscribe(data => {
      this.setCategories(data);
      this.onInitGetCategoriess(this.categories);
    })
    this.inventoryRealTimeService.changeCompaniesArray.subscribe(newChange => {
      if (newChange.action === 'PRODUCT_CATEGORY_SAVED') {
        let index = this.categories.findIndex(item => item.id === newChange.data.id);
        if (index === -1) this.categories.push(newChange.data);
        if (index > -1) this.categories[index] = newChange.data;
      }
      if (newChange.action === 'PRODUCT_CATEGORY_DELETED') {
        let index = this.categories.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.categories.splice(index, 1);
      }
      this.setCategories(this.categories);
      this.onInitGetCategoriess(this.categories);
    })
    this.inventoryRealTimeService.changeProductsArray.subscribe(newChange => {
      if (newChange.action === 'PRODUCT_SAVED') {
        const Index = this.productList.findIndex((item) => item.id === newChange.data.category.id);
        if (Index > -1) {
          this.productList[Index].products.push(newChange.data);
        }
      }
      this.onInitGetProducts(this.productList);
      this.onChangeProducts.emit(new InventoryChange(newChange.action, newChange.data, []));
    })
    this.productService.getCategories().subscribe((res: any) => {
      this.setproducts(res);
      this.onInitGetProducts(this.productList);


    });
  }
  public getListProducts() {
    return this.productList;
  }

  public setproducts(data) {
    this.productList = data;
  }
  public getChangeProducts() {
    return this.onChangeProducts;
  }
  public getCategories() {
    return this.categories;
  }
  public getOnCategries() {
    return this.onGetCategories;
  }
  public getOnProducts() {
    return this.onGetProducts;
  }
  public onInitGetCategoriess(data) {
    this.onGetCategories.emit(data);
  }
  public onInitGetProducts(data) {
    this.onGetProducts.emit(data);
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
