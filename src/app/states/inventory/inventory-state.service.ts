import { Injectable, EventEmitter } from '@angular/core';
import { InventoryItem } from '../../components/inventory/class/inventory-item';
import { CategoryProduct } from '../../interfaces/product/category-product';
import { ProductService } from '../../services/product/product.service';
import { InventoryRealTimeService } from './inventory-real-time.service';
import { InventoryChange } from '../../components/inventory/class/inventory-change';
import { CategoryProductitem } from 'src/class/category-product-item';
import { ProductType } from 'src/app/components/setting/products-settings/class/product-type';
@Injectable({
  providedIn: 'root'
})
export class InventoryStateService {
  sortCategoty: CategoryProduct = null;
  showAsideForAdd: EventEmitter<any> = new EventEmitter();
  onEditInventory: EventEmitter<InventoryItem> = new EventEmitter();
  categoryForDelete: CategoryProduct = null;
  productForDelete: InventoryItem = null;
  onSortCategory: EventEmitter<any> = new EventEmitter();
  onSortActive: EventEmitter<any> = new EventEmitter();
  onGetCategories: EventEmitter<any> = new EventEmitter();
  onGetProducts: EventEmitter<any> = new EventEmitter();
  onRefreshProductsAgreements: EventEmitter<any> = new EventEmitter();
  onChangeProducts: EventEmitter<InventoryChange> = new EventEmitter();
  onGetListType: EventEmitter<any> = new EventEmitter();
  listCategoriesForRemove = [];
  categories = [];
  productList: Array<CategoryProductitem> = [];
  preloader: boolean = true;
  listTypes: Array<ProductType> = [];
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
          let indexProduct = this.productList[Index].products.findIndex(item => item.versionedId.id === newChange.data.versionedId.id)
          if (indexProduct > -1) {
            if (newChange.data.active) this.productList[Index].products[indexProduct] = newChange.data;
            if (!newChange.data.active) this.productList[Index].products.splice(indexProduct, 1);
          }
          if (indexProduct === -1 && newChange.data.active) this.productList[Index].products.push(newChange.data);
        }
      }
      this.onInitGetProducts(this.productList);
      this.onChangeProducts.emit(new InventoryChange(newChange.action, newChange.data, []));
    })
    // this.getProducts();
  }
  public onInitGetServiceTypeList() {
    this.productService.getProductsTypes().subscribe((data: any) => {
      this.listTypes = data.productTypeDtos.map(item => new ProductType(item));
      this.onGetListType.emit(this.listTypes)
    })
    this.inventoryRealTimeService.changeProductsArray.subscribe(data => {
      if (data.action === "PRODUCT_TYPE_SAVED") this.listTypes.push(new ProductType(data.data));
      if (data.action === "PRODUCT_TYPE_EDITED") {
        let index = this.listTypes.findIndex(item => item.id === data.data.id);
        if (index > -1) this.listTypes[index] = new ProductType(data.data);
      }
      /* if (data.action === "SERVICE_TYPE_REMOVED") {
         let index = this.serviceTypeList.findIndex(item => item.id === data.data);
         if (index > -1) this.serviceTypeList.splice(index, 1);
       }*/
      this.onGetListType.emit(this.listTypes);
    })
  }
  public getListTypes() {
    return this.listTypes;
  }
  public setPreloader(data) {
    this.preloader = data;
  }
  public getProducts() {
    this.preloader = true;
    this.productService.getCategories().subscribe((res: any) => {
      this.preloader = false;
      this.setproducts(res);
      this.onInitGetProducts(this.productList);
    });
  }
  public getSortCategoty() {
    return this.sortCategoty;
  }
  public refreshProductsAgreements() {
    this.onRefreshProductsAgreements.emit(null);
  }
  public setListCategoriesForRemove(data) {
    this.listCategoriesForRemove = data;
  }
  public getListCategoriesForRemove() {
    return this.listCategoriesForRemove;
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
    this.sortCategoty = data;
    this.onSortCategory.emit(data);
  }
  public setSortActive(data) {
    this.onSortActive.emit(data);
  }
  public getOnSortCategory() {
    return this.onSortCategory;
  }
}
