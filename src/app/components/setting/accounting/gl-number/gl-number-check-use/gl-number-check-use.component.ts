import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { InventoryItem } from 'src/app/components/inventory/class/inventory-item';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { ProductService } from 'src/app/services/product/product.service';
import { NonContractServicesStateService } from 'src/app/states/non-contract-services/non-contract-services-state.service';
import { GlNumberStateService } from 'src/app/states/gl-number/gl-number-state.service';
import { InventoryStateService } from 'src/app/states/inventory/inventory-state.service';
import { GlNumber } from 'src/class/gl-number/gl-number';
import { GlNumberService } from '../gl-number.service';
import { GlNumberUse } from './class/gl-number-use';

@Component({
  selector: 'gl-number-check-use',
  templateUrl: './gl-number-check-use.component.html',
  styleUrls: ['./gl-number-check-use.component.scss'],
  providers: [TicketsListService]
})
export class GlNumberCheckUseComponent implements OnInit {

  @Input() glNumber: GlNumber;
  showPreloader: boolean = true;
  valid: boolean = false;
  glNumberUse: GlNumberUse;
  listColorNoAvatar = ['#0cdeaa', '#16a4fa', '#7c77cb', '#ffb937'];
  sub: Subscription = new Subscription();
  constructor(
    public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    private glNumberService: GlNumberService,
    private inventoryStateService: InventoryStateService,
    public activeModal: NgbActiveModal,
    private productService: ProductService,
    private nonContractServicesStateService: NonContractServicesStateService,
    private glNumberStateService: GlNumberStateService,
    private nonContractServicesService: NonContractServicesService
  ) { }

  ngOnInit() {
    this.glNumberService.validateForRemove(this.glNumber.id).subscribe((data: any) => {

      this.getGlNumber(data);
    })
    let onRefreshGlNumbersCheck = this.glNumberStateService.onRefreshGlNumbersCheck.subscribe(data => {
      this.showPreloader = true;
      this.glNumberService.validateForRemove(this.glNumber.id).subscribe((data: any) => {
        this.getGlNumber(data);
      });
    })
    this.sub.add(onRefreshGlNumbersCheck);
  }
  getGlNumber(data) {
    this.valid = data.valid;
    this.glNumberUse = new GlNumberUse(data);
    this.showPreloader = false;
  }
  showService(item) {
    this.nonContractServicesService.getNonContractService(item.versionedId.id).subscribe(data => {
      this.nonContractServicesStateService.toggleAsideForEdit(data);
    })
  }
  showProduct(item) {
    this.productService.getProduct(item.versionedId.id).subscribe(data => {
      this.inventoryStateService.setEditInventory(data);
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
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
