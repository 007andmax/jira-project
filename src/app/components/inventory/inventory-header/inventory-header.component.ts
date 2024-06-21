import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { InventoryItem } from '../class/inventory-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryChangeProductTypeComponent } from '../inventory-change-product-type/inventory-change-product-type.component';

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
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onSelectAllIventory: EventEmitter<any> = new EventEmitter();
  toggleFilter: boolean = false;
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
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
  filter(data) {
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
