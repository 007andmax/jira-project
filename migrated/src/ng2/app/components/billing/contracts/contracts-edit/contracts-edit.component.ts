import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ServiceAgreement } from '../class/service-agreement';
import { ContractsAsideHourlyEditComponent } from './contracts-aside-hourly-edit/contracts-aside-hourly-edit.component';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ContractsAsideBlockTimeEditComponent } from './contracts-aside-block-time-edit/contracts-aside-block-time-edit.component';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';

@Component({
  selector: 'app-contracts-edit',
  templateUrl: './contracts-edit.component.html',
  styleUrls: ['./contracts-edit.component.scss']
})
export class ContractsEditComponent implements OnInit {
  @ViewChild('hourlyContract') hourlyContract: ContractsAsideHourlyEditComponent;
  @ViewChild('blockTimeContract') blockTimeContract: ContractsAsideBlockTimeEditComponent;
  
  @Input() serviceAgreement: ServiceAgreement;
  constructor(private contractsStateService: ContractsStateService,
    private defaultServicesService: DefaultServicesService,) { }

  ngOnInit() {
    console.log("serviceAgreement",this.serviceAgreement);
    this.defaultServicesService.getDefaultServices().subscribe(data => {
      this.contractsStateService.setDefaultService(data);
    })
  }
  edit() {
    if (this.hourlyContract) this.hourlyContract.onEdit();
    if (this.blockTimeContract) this.blockTimeContract.onEdit();
  }
  closed() {
    this.contractsStateService.toggleEdit(false);
  }
}
