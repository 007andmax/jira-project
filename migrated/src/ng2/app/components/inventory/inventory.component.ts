import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';
import { Product } from '../../interfaces/product/product';
import { InventoryListService } from './services/inventory-list.service';
import { InventoryItem } from './class/inventory-item';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { TaxesStateService } from '../../states/taxes/taxes-state.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  providers: [InventoryListService]
})
export class InventoryComponent implements OnInit {
  sortCategoty: CategoryProductitem = null;
  inventoryList: Array<InventoryItem> = [];
  reqInventoryList: Array<CategoryProductitem> = [];
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  showPreloader: boolean = true;
  companies = [];
  taxes = [];
  sub: Subscription = new Subscription();
  constructor(private productService: ProductService, private inventoryListService: InventoryListService,
    private companiesStateService: CompaniesStateService,
    private taxesStateService:TaxesStateService) { }

  ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {

      this.companies = data;
    })
    this.sub.add(getOnCompanies);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {

      this.taxes = data;
    })
    this.sub.add(getOnTaxess);
    this.getListProducts();
  }
  public getListProducts() {
    this.productService.getCategories().subscribe((res: Array<CategoryProductitem>) => {
      this.reqInventoryList = res;
      this.onScroll();
      this.showPreloader = false;
      console.log("res", res);

    });
  }

  getProducts() {
    if (this.inventoryListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listcategories = this.reqInventoryList.filter(item => (this.sortCategoty) ? item.id === this.sortCategoty.id : (!this.sortCategoty) ? true : false);
    let listFilter = [];
    listcategories.forEach(item => {
      listFilter = [...listFilter, ...item.products.map(product => {
        let iventory = new InventoryItem(product);
        iventory.setCategoryDefault(item.default);
        return iventory;
      })];
    })
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let inventoryList = [];
    for (let i = start; i < end; i++) {
      inventoryList.push(listFilter[i]);
    }
    this.inventoryList = [...this.inventoryList, ...inventoryList];
    console.log("this.inventoryList", this.inventoryList);
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.inventoryListService.setBlockList(true);


  }
  public onFilter(field) {
    this.filter.onFilter(field, this.reqUsers, this.companies)
    this.page_number = 0;
    this.userListService.setBlockList(false);
    this.users = [];
    this.onScroll();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getProducts();

  }

  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
