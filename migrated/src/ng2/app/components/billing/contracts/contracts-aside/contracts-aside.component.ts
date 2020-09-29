import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ConstantsService } from 'src/ng2/app/services/constants/constants.service';
import { ContractsAsideHourlyBillingComponent } from './contracts-aside-hourly-billing/contracts-aside-hourly-billing.component';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { ContractsAsideBlockTimeBillingComponent } from './contracts-aside-block-time-billing/contracts-aside-block-time-billing.component';
import { ContractsAsideUserDeviceBillingComponent } from './contracts-aside-user-device-billing/contracts-aside-user-device-billing.component';
import { ContractsAsideProductServiceContractsComponent } from './contracts-aside-product-service-contracts/contracts-aside-product-service-contracts.component';

@Component({
  selector: 'app-contracts-aside',
  templateUrl: './contracts-aside.component.html',
  styleUrls: ['./contracts-aside.component.scss']
})
export class ContractsAsideComponent implements OnInit {
  @ViewChild('hourlyContract') hourlyContract: ContractsAsideHourlyBillingComponent;
  @ViewChild('blockTimeContract') blockTimeContract: ContractsAsideBlockTimeBillingComponent;
  @ViewChild('deviceUserContract') deviceUserContract: ContractsAsideUserDeviceBillingComponent;
  @ViewChild('otherContract') otherContract: ContractsAsideProductServiceContractsComponent;
  type: string = null;
  step: number = 1;
  constructor(private contractsStateService: ContractsStateService,
    private defaultServicesService: DefaultServicesService
  ) { }

  ngOnInit() {
    if (this.contractsStateService.getContractForCopy()) {
      this.step = 2;
      this.type = `${this.contractsStateService.getContractForCopy().type}${(this.contractsStateService.getContractForCopy().billType) ? "_" + this.contractsStateService.getContractForCopy().billType : ""}`;
    }
    this.contractsStateService.getOnChangeType().subscribe(data => {
      this.type = `${data.type}${(data.billType) ? "_" + data.billType : ""}`;
    })
    this.defaultServicesService.getDefaultServices().subscribe(data => {
      this.contractsStateService.setDefaultService(data);
    })
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
}
