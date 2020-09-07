import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ServiceAgreement } from '../class/service-agreement';
import { ContractsAsideHourlyEditComponent } from './contracts-aside-hourly-edit/contracts-aside-hourly-edit.component';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-edit',
  templateUrl: './contracts-edit.component.html',
  styleUrls: ['./contracts-edit.component.scss']
})
export class ContractsEditComponent implements OnInit {
  @ViewChild('hourlyContract') hourlyContract: ContractsAsideHourlyEditComponent;
  @Input() serviceAgreement: ServiceAgreement;
  constructor(private contractsStateService: ContractsStateService,) { }

  ngOnInit() {
    console.log("serviceAgreement",this.serviceAgreement);
  }
  edit() {
    if (this.hourlyContract) this.hourlyContract.onEdit();
  }
  closed() {
    this.contractsStateService.toggleEdit(false);
  }
}
