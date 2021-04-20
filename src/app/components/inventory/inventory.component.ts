import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CategoryProductitem } from 'src/class/category-product-item';
import { InventoryListService } from './services/inventory-list.service';
import { InventoryItem } from './class/inventory-item';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { TaxesStateService } from '../../states/taxes/taxes-state.service';
import { InventoryFilter } from './class/inventory-filter';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberStateService } from '../../states/gl-number/gl-number-state.service';
import { Tax } from 'src/class/taxes/tax';
import { InventoryStateService } from '../../states/inventory/inventory-state.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { DELETE_COMPANY, DELETE_PRODUCT } from '../../const/confirm';
import { InventoryChange } from './class/inventory-change';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  providers: [InventoryListService]
})
export class InventoryComponent implements OnInit {
  sortCategoty: CategoryProductitem = null;
  inventoryList: Array<InventoryItem> = [];
  reqInventoryList: Array<InventoryItem> = [];
  filter: InventoryFilter = new InventoryFilter();
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  showPreloader: boolean = true;
  companies = [];
  glNumbers: Array<GlNumber> = [];
  productSearchName: string = '';
  sub: Subscription = new Subscription();
  taxes: Array<Tax> = [];

  constructor(private productService: ProductService,
    private inventoryListService: InventoryListService,
    private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
    private glNumberStateService: GlNumberStateService,
    private inventoryStateService: InventoryStateService,
    private permissionsService: PermissionsService,
    private confirmStateService: ConfirmStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;
    })
    this.sub.add(getOnCompanies);
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.glNumberStateService.getGLNumbers();
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = data;
    })
    this.sub.add(getOnGlNumbers);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    })
    this.sub.add(getOnTaxess);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_COMPANY) this.onRemoveCategory(this.inventoryStateService.getCategoryForDelete().id);
        if (this.confirmStateService.getConfirmAction() === DELETE_PRODUCT) this.onRemoveProduct(this.inventoryStateService.getProductForDelete().versionedId.id);
      }
    })
    this.sub.add(getConfirm);
    let getOnSortCategory = this.inventoryStateService.getOnSortCategory().subscribe(data => {
      window.scrollTo(0, 0);
      this.sortCategoty = data;
      this.page_number = 0;
      this.inventoryListService.setBlockList(false);
      this.inventoryList = [];
      this.onScroll();
    })
    this.sub.add(getOnSortCategory);
    let getChangeProducts = this.inventoryStateService.getChangeProducts().subscribe((data: InventoryChange) => {

      if (data.action === 'PRODUCT_SAVED') {
        const reqIndex = this.reqInventoryList.findIndex((item) => item.versionedId.id === data.data.versionedId.id);
        const Index = this.inventoryList.findIndex((item) => item.versionedId.id === data.data.versionedId.id);
        if (reqIndex > -1) this.reqInventoryList[reqIndex] = new InventoryItem(data.data);
        if (reqIndex === -1) this.reqInventoryList.push(new InventoryItem(data.data));
        if (Index > -1) {
          this.inventoryList[Index] = new InventoryItem(data.data);
        }
        if (Index === -1) {
          this.inventoryList.push(new InventoryItem(data.data));
          this.inventoryList = this.inventoryList.filter(item => (this.sortCategoty) ? item.category.id === this.sortCategoty.id : (!this.sortCategoty) ? true : false);
          this.inventoryList = this.inventoryList.filter(item => (this.productSearchName.length > 0) ? item.description.toLowerCase().includes(this.productSearchName.toLowerCase()) : true);
          this.filter.onFilter(this.inventoryList, this.companies, this.glNumbers);
        }

      }
      if (data.action === 'PRODUCT_DELETED') {
        const reqIndex = this.reqInventoryList.findIndex((item) => item.versionedId.id === data.data.versionedId.id);
        if (reqIndex > -1) this.reqInventoryList.splice(reqIndex, 1);
        const Index = this.inventoryList.findIndex((item) => item.versionedId.id === data.data.versionedId.id);
        if (Index > -1) this.inventoryList.splice(Index, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(getChangeProducts);
    this.getListProducts();
  }
  onRemoveProduct(id) {
    this.productService.removeProduct(id).subscribe(data => {
    })
  }
  onRemoveCategory(id) {
    this.productService.removeCategory(id).subscribe(data => {
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public getListProducts() {
    this.productService.getProducts().subscribe((res: Array<InventoryItem>) => {
      this.reqInventoryList = res;
      this.onScroll();
      this.showPreloader = false;
      this.cd.detectChanges();
    });
  }

  getProducts() {
    if (this.inventoryListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listFilter = this.reqInventoryList.filter(item => (this.sortCategoty) ? item.category.id === this.sortCategoty.id : (!this.sortCategoty) ? true : false);
    listFilter = listFilter.filter(item => (this.productSearchName.length > 0) ? (item.description.toLowerCase().includes(this.productSearchName.toLowerCase()) || item.ilc && item.ilc.toLowerCase().includes(this.productSearchName.toLowerCase()) || item.isFindGlNumber(this.productSearchName) || item.manufacture && item.manufacture.toLowerCase().includes(this.productSearchName.toLowerCase())) : true);
    this.filter.onFilter(listFilter, this.companies, this.glNumbers);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let inventoryList = [];
    for (let i = start; i < end; i++) {
      inventoryList.push(listFilter[i]);
    }
    this.inventoryList = [...this.inventoryList, ...inventoryList];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.inventoryListService.setBlockList(true);
    this.cd.detectChanges();
  }
  onSearch(data) {
    this.productSearchName = data;
    this.page_number = 0;
    this.inventoryListService.setBlockList(false);
    this.inventoryList = [];
    this.onScroll();
  }
  public onFilter(field) {
    this.filter.onSetFilter(field);
    this.page_number = 0;
    this.inventoryListService.setBlockList(false);
    this.inventoryList = [];
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
