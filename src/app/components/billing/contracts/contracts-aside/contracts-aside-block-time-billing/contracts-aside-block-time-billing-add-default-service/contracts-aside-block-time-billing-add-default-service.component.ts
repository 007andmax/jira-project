import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-aside-block-time-billing-add-default-service',
  templateUrl: './contracts-aside-block-time-billing-add-default-service.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-add-default-service.component.scss']
})
export class ContractsAsideBlockTimeBillingAddDefaultServiceComponent implements OnInit, OnDestroy {
  defaultServices: Array<DefaultServicesHourlyContract> = [];
  selectedItem: DefaultServicesHourlyContract;
  sub: Subscription = new Subscription();
  @Input() showError: boolean = false;
  @Output() onSelect = new EventEmitter<any>();
  constructor(private contractsStateService: ContractsStateService,) { }


  ngOnInit() {
    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService().map(item => new DefaultServicesHourlyContract(item));
    this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    let getOnDefaultServices = this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data.map(item => new DefaultServicesHourlyContract(item));
      this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    })
    this.sub.add(getOnDefaultServices);
  }
  public isSelected(id) {
    return this.selectedItem && this.selectedItem.versionedId.id == id;
  }
  select(data) {
    this.selectedItem = data;
    this.onSelect.emit(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
