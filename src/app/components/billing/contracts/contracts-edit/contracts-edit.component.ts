import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ServiceAgreement } from '../class/service-agreement';
import { ContractsAsideHourlyEditComponent } from './contracts-aside-hourly-edit/contracts-aside-hourly-edit.component';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { ContractsAsideBlockTimeEditComponent } from './contracts-aside-block-time-edit/contracts-aside-block-time-edit.component';
import { DefaultServicesService } from 'src/app/services/default-services/default-services.service';
import { ContractsAsideUserDeviceEditComponent } from './contracts-aside-user-device-edit/contracts-aside-user-device-edit.component';
import { ContractsAsideProductServiceEditComponent } from './contracts-aside-product-service-edit/contracts-aside-product-service-edit.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  selector: 'app-contracts-edit',
  templateUrl: './contracts-edit.component.html',
  styleUrls: ['./contracts-edit.component.scss']
})
export class ContractsEditComponent implements OnInit {
  @ViewChild('hourlyContract') hourlyContract: ContractsAsideHourlyEditComponent;
  @ViewChild('blockTimeContract') blockTimeContract: ContractsAsideBlockTimeEditComponent;
  @ViewChild('serviceContract') serviceContract: ContractsAsideUserDeviceEditComponent;
  @ViewChild('otherContract') otherContract: ContractsAsideProductServiceEditComponent;
  @ViewChild('editContract') editContract: DisabledBtnDirective;
  @Input() serviceAgreement: ServiceAgreement;
  constructor(private contractsStateService: ContractsStateService,
    public cd: ChangeDetectorRef,
    private defaultServicesService: DefaultServicesService,) { }

  ngOnInit() {
    this.defaultServicesService.getDefaultServices().subscribe(data => {
      this.contractsStateService.setDefaultService(data);
    })
  }
  edit() {

    if (this.hourlyContract) this.hourlyContract.onEdit();
    if (this.blockTimeContract) this.blockTimeContract.onEdit();
    if (this.serviceContract) this.serviceContract.onEdit();
    if (this.otherContract) this.otherContract.onEdit();
    this.editContract.setDisabled(true);
  }
  closed() {
    this.contractsStateService.toggleEdit(false);
    this.editContract.setDisabled(false);
  }
}
