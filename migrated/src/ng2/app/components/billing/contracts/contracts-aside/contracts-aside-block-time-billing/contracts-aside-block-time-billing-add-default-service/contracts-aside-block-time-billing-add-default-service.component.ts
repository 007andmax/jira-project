import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DefaultServicesHourlyContract } from '../../class/default-service-hourly-contract';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-aside-block-time-billing-add-default-service',
  templateUrl: './contracts-aside-block-time-billing-add-default-service.component.html',
  styleUrls: ['./contracts-aside-block-time-billing-add-default-service.component.scss']
})
export class ContractsAsideBlockTimeBillingAddDefaultServiceComponent implements OnInit {
  defaultServices: Array<DefaultServicesHourlyContract> = [];
  @Output() onSelect = new EventEmitter<any>();
  constructor(private contractsStateService: ContractsStateService,) { }

  ngOnInit() {
    if (this.contractsStateService.getDefaultService().length > 0) this.defaultServices = this.contractsStateService.getDefaultService();
    this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    this.contractsStateService.getOnDefaultServices().subscribe(data => {
      this.defaultServices = data.map(item => new DefaultServicesHourlyContract(item));
      this.defaultServices.sort((a, b) => a.name.localeCompare(b.name));
    })
  }
  select(data) {
    this.onSelect.emit(data);
  }
}
