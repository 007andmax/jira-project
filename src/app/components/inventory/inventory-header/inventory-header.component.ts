import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppService } from 'src/app/states/app/app.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';

@Component({
  selector: 'inventory-header',
  templateUrl: './inventory-header.component.html',
  styleUrls: ['./inventory-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryHeaderComponent implements OnInit {
  productSearchName: string = '';
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  toggleFilter: boolean = false;
  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    public cd: ChangeDetectorRef,
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
  addProduct() {
    this.inventoryStateService.toggleAsideForAdd();
    this.cd.detectChanges();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
