import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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

@Component({
  selector: 'inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryHeaderComponent implements OnInit {
  productSearchName: string = '';
  reqInventoryList: Array<InventoryItem> = [];
  selectAll: boolean = false;
  countFilter: number = 0;
  @ViewChild('filtes', { static: true }) filtes: InventoryFilterComponent;
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onSelectAllIventory: EventEmitter<any> = new EventEmitter();
  toggleFilter: boolean = false;
  sortBy: TicketSortBy = new TicketSortBy('description', 'ASC');
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private productService: ProductService,
    private toastrProgressStateService: ToastrProgressStateService,
    public appService: AppService) { }

  ngOnInit() {
    this.cd.markForCheck();
  }
  onBlurSearch(event) {
    this.onSearch.emit(event.target.value);
    this.cd.detectChanges();
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
    this.filtes.onClearAll();
    this.countFilter = 0;
  }
  onChangeCountFilter() {
    this.countFilter = 0;
    if (this.filtes.filter.sortType) this.countFilter++;
    if (this.filtes.filter.sortCategoty) this.countFilter++;
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  filter(data) {
    this.sortBy.sortBy = data;
    this.onFilter.emit(data);
    this.cd.detectChanges();
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
}
