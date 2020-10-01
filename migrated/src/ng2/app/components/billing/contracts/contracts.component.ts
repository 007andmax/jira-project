import { Component, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ServiceAgreement } from './class/service-agreement';
import { DataType } from 'igniteui-angular';

@Component({
  selector: 'contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  showCreate = false;
  showPreview = false;
  showEdit = false;
  serviceAgreement: ServiceAgreement;
  showNotificationReview:boolean = false;
  constructor(private contractsStateService: ContractsStateService,
    ) { }

  ngOnInit() {
   this.contractsStateService.getOnShowNotificationReview().subscribe(data => {
     this.showNotificationReview = true;
   })
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

    this.contractsStateService.getOnEdit().subscribe(data => {
      this.serviceAgreement = data;
      this.showEdit = true;
    })
    this.contractsStateService.getOnToggleEdit().subscribe(data => {
      
      this.showEdit = data;
    })
  }

}
