import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ConstantsService } from 'src/ng2/app/services/constants/constants.service';
import { ContractsAsideHourlyBillingComponent } from './contracts-aside-hourly-billing/contracts-aside-hourly-billing.component';

@Component({
  selector: 'app-contracts-aside',
  templateUrl: './contracts-aside.component.html',
  styleUrls: ['./contracts-aside.component.scss']
})
export class ContractsAsideComponent implements OnInit {
  @ViewChild('hourlyContract') hourlyContract: ContractsAsideHourlyBillingComponent;
  type: string = null;
  step: number = 1;
  constructor(private contractsStateService: ContractsStateService,
    private constantsService: ConstantsService) { }

  ngOnInit() {
    this.contractsStateService.getOnChangeType().subscribe(data => {
      this.type = `${data.type}${(data.billType) ? "_" + data.billType : ""}`;
    })
    this.constantsService.getDefaultServices().subscribe(data => {
      this.contractsStateService.setDefaultService(data);
    })
  }
  onCreate() {
    if (this.hourlyContract) this.hourlyContract.onCreate();

  }
  continue() {
    if (!this.type) return;
    this.step = 2;
  }
  closed() {
    this.contractsStateService.toggleCreate(false);
  }
  onSelectType(data) {
    this.type = data;
  }
}
