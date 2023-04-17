import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';

@Component({
  selector: 'inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.css']
})
export class InventoryHeaderComponent implements OnInit {
  productSearchName: string = '';
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  toggleFilter: boolean = false;
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    public appService: AppService) { }

  ngOnInit() {
    if (this.appService.checkMobile()) this.toggleFilter = true;
  }
  onBlurSearch(event) {
    this.onSearch.emit(event.target.value);
  }
  onKeyUp(event) {
    console.log("event.keyCode", event.keyCode);
    if (event.keyCode === 13) this.onSearch.emit(event.target.value);
  }
  filter(data) {
    this.onFilter.emit(data);
  }
  addProduct() {
    this.inventoryStateService.toggleAsideForAdd();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
