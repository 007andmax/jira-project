import { Component, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ServiceAgreement } from './class/service-agreement';

@Component({
  selector: 'contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  showCreate = false;
  showPreview = false;
  serviceAgreement: ServiceAgreement;
  constructor(private contractsStateService: ContractsStateService) { }

  ngOnInit() {
    this.contractsStateService.getOnToggleCreate().subscribe(data => {
      this.showCreate = data;
    })
    this.contractsStateService.getOnPreview().subscribe(data => {
      this.serviceAgreement = data;
      this.showPreview = true;
    })
    this.contractsStateService.getOnTogglePreview().subscribe(data => {
    
      this.showPreview = false;
    })
  }

}
