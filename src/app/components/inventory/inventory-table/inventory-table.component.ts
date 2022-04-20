import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { InventoryItem } from '../class/inventory-item';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELETE_PRODUCT } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { InventoryAgreement } from '../inventory-check-use/class/inventory-agreement';
import { InventoryCheckUseComponent } from '../inventory-check-use/inventory-check-use.component';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {
  @Input() inventory: InventoryItem;
  @Input() companies;
  @Input() glNumbers;
  @Input() taxes;

  constructor(private permissionsService: PermissionsService,
    private inventoryStateService: InventoryStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private contractsService: ContractsService,
    private elRef: ElementRef,
    private contractsStateService: ContractsStateService,
    private productService: ProductService) { }

  ngOnInit() {
  }
  edit() {
    this.inventoryStateService.setEditInventory(this.inventory);
  }
  delete() {
    this.productService.validateproductForRemove(this.inventory.versionedId.id).subscribe((data: any) => {
      console.log("data", data);
      if (data.valid) {
        this.confirmStateService.setConfirmAction(DELETE_PRODUCT);
        const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
        modalRef.componentInstance.message = `Do you want to delete product?`;
        this.inventoryStateService.setProductForDelete(this.inventory);
      } else {
        let agreements = data.agreements.map(item => new InventoryAgreement(item));
        const modalRef = this.modalService.open(InventoryCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "app-inventory" });
        modalRef.componentInstance.inventory = this.inventory;
        modalRef.componentInstance.agreements = agreements;
      }
    })
    return;
    this.confirmStateService.setConfirmAction(DELETE_PRODUCT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', container: "app-inventory" });
    modalRef.componentInstance.message = `Do you want to delete product?`;
    this.inventoryStateService.setProductForDelete(this.inventory);

    this.contractsService.getServiceAgreement("11e96241-b1c4-4886-bb00-6bfaa1ed0258").subscribe(data => {
      this.contractsStateService.setEdit(data);
    })
  }
  public getGlNumberName() {
    let glNumber = this.inventory.glNumber;
    if (!glNumber) return '';
    return (glNumber.glNumber) ? glNumber.glNumber : '';
  }
  public getCompanyName() {
    let conpany = this.companies.find(item => item.id === this.inventory.companyId);
    return (conpany) ? conpany.name : "";
  }
  getSelectedTaxNames() {
    let taxes = [];
    this.taxes.forEach(item => {
      let index = this.inventory.taxIds.findIndex(taxId => taxId === item.id);
      if (index > -1) taxes.push(`${item.name} ${item.rate}%`);
    })
    return (taxes.length > 0) ? taxes.join(', ') : 'No taxes';
  };

  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  parseTotal(value) {
    return parseFloat(value.toString()).toFixed(2)
  }
}
