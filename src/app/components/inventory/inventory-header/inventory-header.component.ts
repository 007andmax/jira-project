import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { InventoryItem } from '../class/inventory-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryChangeProductTypeComponent } from '../inventory-change-product-type/inventory-change-product-type.component';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastrProgressStateService } from 'src/app/states/toastr-progress/toastr-progress-state.service';
import { InventoryFilterComponent } from './inventory-filter/inventory-filter.component';
import { TicketSortBy } from '../../tickets/tickets/class/ticket-sort-by';
import { InventoryFilter } from '../class/inventory-filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryHeaderComponent implements OnInit, OnDestroy {
  showAddCategory: boolean = false;
  productSearchName: string = '';
  reqInventoryList: Array<InventoryItem> = [];
  selectAll: boolean = false;
  countFilter: number = 0;
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onSelectAllIventory: EventEmitter<any> = new EventEmitter();
  filter: InventoryFilter = new InventoryFilter();
  toggleFilter: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private productService: ProductService,
    private toastrProgressStateService: ToastrProgressStateService,
    public appService: AppService) { }


  ngOnInit() {
    this.cd.markForCheck();
    let onCloseFitler = this.inventoryStateService.onToggleFitler.subscribe(res => {
      this.toggleFilter = res;
    })
    this.sub.add(onCloseFitler);
    let getFilter = this.inventoryStateService.onFilter.subscribe(data => {
      this.filter = data;
      this.onChangeCountFilter();
    })
    this.sub.add(getFilter);
  }
  onBlurSearch(event) {
    this.onSearch.emit(event.target.value);
    this.cd.detectChanges();
  }
  public onToggleFilters(data) {
    this.toggleFilter = data;
    this.inventoryStateService.onToggleFitler.emit(data);
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onSearch.emit(event.target.value); this.cd.detectChanges();
  }
  parseMarkSelectedProducts() {
    if (this.reqInventoryList.filter(item => item.selected).some(item => item.active)) return "Mark as inactive";
    if (this.reqInventoryList.filter(item => item.selected).some(item => !item.active)) return "Mark as active";
    return '';
  }
  setActive() {
    let id = this.reqInventoryList.filter(item => item.selected)[0].versionedId.id;
    let active = this.reqInventoryList.filter(item => item.selected).some(item => item.active) ? false : true;
    this.toastrProgressStateService.onInit(id);
    this.productService.setProductType(null, this.reqInventoryList.filter(item => item.selected).map(item => item.versionedId.id), active).subscribe(data => {
      this.toastrProgressStateService.clear(id);
    })
  }
  resetSelected() {
    this.selectAll = false;
    this.onSelectAllIventory.emit(false);
    this.onChangeCountFilter();
  }

  clearAll() {
    this.inventoryStateService.onClearFilters.emit(null);
    this.countFilter = 0;
  }
  onChangeCountFilter() {
    this.countFilter = 0;
    if (this.filter.sortType) this.countFilter++;
    if (this.filter.sortCategoty) this.countFilter++;
    if (this.filter.lastSold) this.countFilter++;
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }

  public setReqInventoryList(data) {
    this.reqInventoryList = data;
    this.cd.markForCheck();
  }
  public getCountSelected() {
    return this.reqInventoryList.filter(item => item.selected).length;
  }
  setProductType() {
    const modalRef = this.modalService.open(InventoryChangeProductTypeComponent, { windowClass: 'xs-modal user-modal', container: "app-inventory", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.products = this.reqInventoryList.filter(item => item.selected);
  }
  toggleAllCompanies(event) {
    this.selectAll = event.target.checked;
    this.onSelectAllIventory.emit(event.target.checked);
    this.cd.detectChanges();
  }

  addProduct() {
    this.inventoryStateService.toggleAsideForAdd();
    this.cd.detectChanges();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
