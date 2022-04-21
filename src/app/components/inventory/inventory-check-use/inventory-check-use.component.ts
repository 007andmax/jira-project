import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ProductService } from 'src/app/services/product/product.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { InventoryItem } from '../class/inventory-item';
import { InventoryAgreement } from './class/inventory-agreement';

@Component({
  selector: 'inventory-check-use',
  templateUrl: './inventory-check-use.component.html',
  styleUrls: ['./inventory-check-use.component.scss'],
  providers: [TicketsListService]
})
export class InventoryCheckUseComponent implements OnInit, OnDestroy {
  @Input() inventory: InventoryItem;
  @Input() agreements: Array<InventoryAgreement> = [];
  showPreloader: boolean = true;
  valid: boolean = false;
  listColorNoAvatar = ['#0cdeaa', '#16a4fa', '#7c77cb', '#ffb937'];
  sub: Subscription = new Subscription();
  constructor(private contractsService: ContractsService,
    private inventoryStateService: InventoryStateService,
    private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService,
    private ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal,
    private productService: ProductService) { }

  ngOnInit() {
    this.productService.validateproductForRemove(this.inventory.versionedId.id).subscribe((data: any) => {
      this.valid = data.valid;
      if (!data.valid) this.agreements = data.agreements.map(item => new InventoryAgreement(item, this.ticketsListService.randomInteger(0, 3))).sort((a, b) => (this.getCompanyName(a.companyId).toLowerCase() > this.getCompanyName(b.companyId).toLowerCase()) ?
        1 : ((this.getCompanyName(b.companyId).toLowerCase() > this.getCompanyName(a.companyId).toLowerCase()) ? -1 : 0));;
      this.showPreloader = false;
    })
    let onRefreshProductsAgreements = this.inventoryStateService.onRefreshProductsAgreements.subscribe(data => {
      this.productService.validateproductForRemove(this.inventory.versionedId.id).subscribe((data: any) => {
        if (data.valid) {
        } else {
          this.agreements = data.agreements.map(item => new InventoryAgreement(item, this.ticketsListService.randomInteger(0, 3)));
        }
      });
    })
    this.sub.add(onRefreshProductsAgreements);
  }
  getNameForAvatar(name) {
    return name[0].toUpperCase();
  }
  getCompanyName(data) {
    return this.companiesStateService.getCompanies().find(item => item.id === data).name;
  }
  showContract(agreement) {
    this.contractsService.getServiceAgreement(agreement.id).subscribe(data => {
      this.contractsStateService.setEdit(data);
    })
  }
  cancelConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };

  approveConfirm() {
    this.activeModal.close();
    this.confirmStateService.setConfirm(true);
  };

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
