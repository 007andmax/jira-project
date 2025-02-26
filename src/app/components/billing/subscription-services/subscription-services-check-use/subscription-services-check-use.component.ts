import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SubscriptionServices } from '../class/subscription-services';
import { Subscription } from 'rxjs';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';
import { SubscriptionServicesContracts } from '../class/subscription-services-contract';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';

@Component({
  selector: 'app-subscription-services-check-use',
  templateUrl: './subscription-services-check-use.component.html',
  styleUrls: ['./subscription-services-check-use.component.scss'],
  providers: [TicketsListService]
})
export class SubscriptionServicesCheckUseComponent implements OnInit, OnDestroy {
  @Input() service: SubscriptionServices;
  @Input() list: Array<SubscriptionServicesContracts> = [];
  showPreloader: boolean = true;
  valid: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private contractsService: ContractsService,
    private contractsStateService: ContractsStateService,
    public ticketsListService: TicketsListService,
    private confirmStateService: ConfirmStateService,
    public activeModal: NgbActiveModal,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    private subscriptionServicesService: SubscriptionServicesService) { }

  ngOnInit() {
    this.validateServiceForRemove();
    let onRefreshServicesAgreements = this.subscriptionServicesStateService.onRefreshServicesAgreements.subscribe(data => {
      this.validateServiceForRemove();
    })
    this.sub.add(onRefreshServicesAgreements);
  }
  validateServiceForRemove() {
    this.showPreloader = true;
    this.subscriptionServicesService.validateServiceForRemove(this.service.id).subscribe((data: any) => {
      this.getContracts(data);
    })
  }
  getContracts(data) {
    this.valid = data.valid;
    if (!data.valid) this.list = data.agreements.map(item => new SubscriptionServicesContracts(item)).sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
      1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));;
    this.showPreloader = false;
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
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
