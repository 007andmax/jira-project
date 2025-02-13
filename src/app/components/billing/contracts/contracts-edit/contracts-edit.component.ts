import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ServiceAgreement } from '../class/service-agreement';
import { ContractsAsideHourlyEditComponent } from './contracts-aside-hourly-edit/contracts-aside-hourly-edit.component';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsAsideBlockTimeEditComponent } from './contracts-aside-block-time-edit/contracts-aside-block-time-edit.component';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { ContractsAsideUserDeviceEditComponent } from './contracts-aside-user-device-edit/contracts-aside-user-device-edit.component';
import { ContractsAsideProductServiceEditComponent } from './contracts-aside-product-service-edit/contracts-aside-product-service-edit.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';

@Component({
  selector: 'app-contracts-edit',
  templateUrl: './contracts-edit.component.html',
  styleUrls: ['./contracts-edit.component.scss']
})
export class ContractsEditComponent implements OnInit {
  @ViewChild('hourlyContract', { static: false }) hourlyContract: ContractsAsideHourlyEditComponent;
  @ViewChild('blockTimeContract', { static: false }) blockTimeContract: ContractsAsideBlockTimeEditComponent;
  @ViewChild('serviceContract', { static: false }) serviceContract: ContractsAsideUserDeviceEditComponent;
  @ViewChild('otherContract', { static: false }) otherContract: ContractsAsideProductServiceEditComponent;
  @ViewChild('editContract', { static: true }) editContract: DisabledBtnDirective;
  @Input() serviceAgreement: ServiceAgreement;
  constructor(private contractsStateService: ContractsStateService,
    public cd: ChangeDetectorRef,
    private nonContractServicesService: NonContractServicesService,
    private subscriptionServicesService: SubscriptionServicesService,) { }

  ngOnInit() {
    this.nonContractServicesService.getNonContractServices().subscribe(data => {
      this.contractsStateService.setDefaultService(data);
    })
    this.subscriptionServicesService.getServices().subscribe(data => {
      this.contractsStateService.setSubscriptionServices(data);
    })
  }
  edit() {

    if (this.hourlyContract) this.hourlyContract.onEdit();
    if (this.blockTimeContract) this.blockTimeContract.onEdit();
    if (this.serviceContract) this.serviceContract.onEdit();
    if (this.otherContract) this.otherContract.onEdit();
    if (!this.serviceContract) this.disabledBtnForEdit();
  }
  public disabledBtnForEdit() {
    this.editContract.setDisabled(true);
  }
  closed() {
    this.contractsStateService.toggleEdit(false);
    this.editContract.setDisabled(false);
  }
}
