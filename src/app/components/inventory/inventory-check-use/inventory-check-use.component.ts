import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ProductService } from 'src/app/services/product/product.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { InventoryItem } from '../class/inventory-item';
import { InventoryAgreement } from './class/inventory-agreement';

@Component({
  selector: 'inventory-check-use',
  templateUrl: './inventory-check-use.component.html',
  styleUrls: ['./inventory-check-use.component.scss']
})
export class InventoryCheckUseComponent implements OnInit, OnDestroy {
  @Input() inventory: InventoryItem;
  @Input() agreements: Array<InventoryAgreement> = [];
  sub: Subscription = new Subscription();
  constructor(private contractsService: ContractsService,
    private inventoryStateService: InventoryStateService,
    private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService,
    private productService: ProductService) { }


  ngOnInit() {
    let onRefreshProductsAgreements = this.inventoryStateService.onRefreshProductsAgreements.subscribe(data => {
      this.productService.validateproductForRemove(this.inventory.versionedId.id).subscribe((data: any) => {
        if (data.valid) {
        } else {
          this.agreements = data.agreements.map(item => new InventoryAgreement(item));
        }
      });
    })
    this.sub.add(onRefreshProductsAgreements);
  }
  getCompanyName(data) {
    return this.companiesStateService.getCompanies().find(item => item.id === data).name;
  }
  showContract(agreement) {
    this.contractsService.getServiceAgreement(agreement.id).subscribe(data => {
      this.contractsStateService.setEdit(data);
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
