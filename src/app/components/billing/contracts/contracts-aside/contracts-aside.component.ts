import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsAsideHourlyBillingComponent } from './contracts-aside-hourly-billing/contracts-aside-hourly-billing.component';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { ContractsAsideBlockTimeBillingComponent } from './contracts-aside-block-time-billing/contracts-aside-block-time-billing.component';
import { ContractsAsideUserDeviceBillingComponent } from './contracts-aside-user-device-billing/contracts-aside-user-device-billing.component';
import { ContractsAsideProductServiceContractsComponent } from './contracts-aside-product-service-contracts/contracts-aside-product-service-contracts.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-aside',
  templateUrl: './contracts-aside.component.html',
  styleUrls: ['./contracts-aside.component.scss']
})
export class ContractsAsideComponent implements OnInit, OnDestroy {
  @ViewChild('hourlyContract') hourlyContract: ContractsAsideHourlyBillingComponent;
  @ViewChild('blockTimeContract') blockTimeContract: ContractsAsideBlockTimeBillingComponent;
  @ViewChild('deviceUserContract') deviceUserContract: ContractsAsideUserDeviceBillingComponent;
  @ViewChild('otherContract') otherContract: ContractsAsideProductServiceContractsComponent;
  type: string = null;
  step: number = 1;
  sub: Subscription = new Subscription();
  constructor(private contractsStateService: ContractsStateService,
    private nonContractServicesService: NonContractServicesService
  ) { }

  ngOnInit() {
    if (this.contractsStateService.getContractForCopy()) {
      this.step = 2;
      this.type = `${this.contractsStateService.getContractForCopy().type}${(this.contractsStateService.getContractForCopy().billType) ? "_" + this.contractsStateService.getContractForCopy().billType : ""}`;
    }
    let getOnChangeType = this.contractsStateService.getOnChangeType().subscribe(data => {
      this.type = `${data.type}${(data.billType) ? "_" + data.billType : ""}`;
    })
    this.sub.add(getOnChangeType);
    let getNonContractServices = this.nonContractServicesService.getNonContractServices().subscribe(data => {
      this.contractsStateService.setDefaultService(data);
    })
    this.sub.add(getNonContractServices);
  }
  onCreate() {
    if (this.hourlyContract) this.hourlyContract.onCreate();
    if (this.blockTimeContract) this.blockTimeContract.onCreate();
    if (this.deviceUserContract) this.deviceUserContract.onCreate();
    if (this.otherContract) this.otherContract.onCreate();
  }
  continue() {
    if (!this.type) return;
    this.step = 2;
  }
  closed() {
    this.contractsStateService.toggleCreate(false);
    this.contractsStateService.setContractForCopy(null);
  }
  onSelectType(data) {
    this.type = data;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
