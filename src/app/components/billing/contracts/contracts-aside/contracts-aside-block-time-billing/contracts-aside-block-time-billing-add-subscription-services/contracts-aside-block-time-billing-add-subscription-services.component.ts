import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubscriptionServices } from 'src/app/components/billing/subscription-services/class/subscription-services';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-aside-block-time-billing-add-subscription-services',
  templateUrl: './contracts-aside-block-time-billing-add-subscription-services.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-add-subscription-services.component.scss']
})
export class ContractsAsideBlockTimeBillingAddSubscriptionServicesComponent implements OnInit, OnDestroy {
  subscriptionServices: Array<SubscriptionServices> = [];
  selectedItem: SubscriptionServices;
  sub: Subscription = new Subscription();
  @Output() onSelect = new EventEmitter<any>();
  constructor(private contractsStateService: ContractsStateService,) { }


  ngOnInit() {
    if (this.contractsStateService.getSubscriptionServices().length > 0) this.subscriptionServices = this.contractsStateService.getSubscriptionServices().map(item => new SubscriptionServices(item));
    this.subscriptionServices.sort((a, b) => a.name.localeCompare(b.name));
    let getOnDefaultServices = this.contractsStateService.onSubscriptionServices.subscribe(data => {
      this.subscriptionServices = data.map(item => new SubscriptionServices(item));
      this.subscriptionServices.sort((a, b) => a.name.localeCompare(b.name));
    })
    this.sub.add(getOnDefaultServices);
  }
  public isSelected(id) {
    return this.selectedItem && this.selectedItem.id == id;
  }
  select(data) {
    this.selectedItem = data;
    this.onSelect.emit(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
