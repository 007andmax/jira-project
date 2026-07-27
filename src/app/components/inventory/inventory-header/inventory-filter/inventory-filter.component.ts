import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryProduct } from 'src/app/interfaces/product/category-product';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { TitleListType } from '../../../tickets/tickets/tickets-header/class/title-list-type';
import { ProductType } from 'src/app/components/setting/products-settings/class/product-type';
import { InventoryFilter } from '../../class/inventory-filter';
@Component({
  selector: 'inventory-filter',
  templateUrl: './inventory-filter.component.html',
  styleUrls: ['./inventory-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryFilterComponent implements OnInit {
  showAddCategory: boolean = false;
  categories: Array<CategoryProduct> = [];
  sub: Subscription = new Subscription();
  lastSold: Array<TitleListType> = [new TitleListType('Last sold within 30 days', 'WITHIN_30'), new TitleListType('Last sold within 60 Days', 'WITHIN_60'), new TitleListType('Last sold over 30 days ago', 'DAYS_30'), new TitleListType('Last sold over 60 days ago', 'DAYS_60'), new TitleListType('Last sold over 90 days ago', 'DAYS_90'), new TitleListType('Last sold over 180 days ago', 'DAYS_180'), new TitleListType('Last sold over 1 year ago', 'YEAR_1')];
  listActive: Array<TitleListType> = [new TitleListType('Active products', 'ACTIVE'), new TitleListType('Inactive products', 'NO_ACTIVE')];
  selectedActive = new TitleListType('Active products', 'ACTIVE');
  listTypes: Array<ProductType> = [];
  filter: InventoryFilter = new InventoryFilter();
  @ViewChild('categoriesSelect', { static: true }) categoriesSelect: DropDownComponent;
  @ViewChild('productTypeSelect', { static: true }) productTypeSelect: DropDownComponent;
  @ViewChild('lastSoldDb', { static: true }) lastSoldDb: DropDownComponent;
  @Output() onResetSelected: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  constructor(private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,) { }
  ngOnInit() {
    if (this.inventoryStateService.getListTypes().length === 0) {
      this.inventoryStateService.onInitGetServiceTypeList();
    } else {
      this.listTypes = this.inventoryStateService.getListTypes().sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
    }
    let onGetServiceType = this.inventoryStateService.onGetListType.subscribe(data => {
      this.listTypes = data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));;
    })
    this.sub.add(onGetServiceType);
    if (this.inventoryStateService.getSortCategoty()) this.categoriesSelect.selectItemWithOutChanges(this.inventoryStateService.getSortCategoty());
    if (this.inventoryStateService.getCategories().length > 0) this.categories = this.inventoryStateService.getCategories();
    this.cd.markForCheck();
    let getOnCategries = this.inventoryStateService.getOnCategries().subscribe((data) => {
      this.categories = data;
      if (this.categoriesSelect) this.categoriesSelect.reset(this.categories);
      this.cd.detectChanges();
    })
    this.sub.add(getOnCategries);
    let getOnSortCategory = this.inventoryStateService.getOnSortCategory().subscribe(data => {
      this.categoriesSelect.selectItemWithOutChanges(data);
      this.cd.detectChanges();
    })
    this.sub.add(getOnSortCategory);
    let onClearFitler = this.inventoryStateService.onClearFilters.subscribe(res => {
      this.onClearAll();
    })
    this.sub.add(onClearFitler);
  }
  onSelectProuctType(data) {
    this.filter.setSortType(data);
    //  this.inventoryStateService.setSortType(data);
    //  this.onResetSelected.emit(null);
  }
  selectActive(data) {
    this.selectedActive = data;
    this.filter.setActive(data.type === 'ACTIVE');
    //   this.inventoryStateService.setSortActive(data.type === 'ACTIVE');
    //  this.onResetSelected.emit(null);
    // this.cd.detectChanges();
  }
  selectLastSold(data) {
    this.filter.setLastSold(data ? data.type : null);
    // this.inventoryStateService.setLastSold(data ? data.type : null);
    // this.onResetSelected.emit(null);
    //this.cd.detectChanges();
  }
  onSelectCategory(category) {
    this.filter.setSortCategoty(category);
    // this.inventoryStateService.setSortCategory(category);
    //  this.onResetSelected.emit(null);
    // this.cd.detectChanges();
  }
  applyFilters() {
    this.inventoryStateService.setFilter(this.filter);
    this.cd.detectChanges();
  }
  public onClearAll() {
    this.filter = new InventoryFilter();
    this.categoriesSelect.clearWithOutChanges();
    this.productTypeSelect.clearWithOutChanges();
    this.lastSoldDb.clearWithOutChanges();
    this.inventoryStateService.resetSortCategoty();
    this.inventoryStateService.setFilter(this.filter);
  }
  close() {
    this.onClose.emit(null);
  }
}
