import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
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
  toggleFilter: boolean = true;
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,) { }

  ngOnInit() {
  }
  search() {
    this.onSearch.emit(this.productSearchName);
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
