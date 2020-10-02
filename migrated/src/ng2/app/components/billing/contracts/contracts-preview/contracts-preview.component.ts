import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ConstantsService } from 'src/ng2/app/services/constants/constants.service';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { ServiceAgreement } from '../class/service-agreement';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-preview',
  templateUrl: './contracts-preview.component.html',
  styleUrls: ['./contracts-preview.component.scss']
})
export class ContractsPreviewComponent implements OnInit {
  @Input() serviceAgreement: ServiceAgreement;

  constructor(private contractsService: ContractsService,
    public cd: ChangeDetectorRef,
    private contractsStateService: ContractsStateService,) { }

  ngOnInit() {

  }
  copy() {
    this.closed();
    this.contractsStateService.setContractForCopy(this.serviceAgreement);
    this.contractsStateService.toggleCreate(true);
  }
  terminateAndCopy() {
    this.contractsService.terminate(this.serviceAgreement.id).subscribe(data => {
      this.copy();
    })
  }
  closed() {
    this.contractsStateService.togglePreview(false);
    this.cd.detectChanges();
  }
  edit() {
    this.closed();
    this.contractsStateService.setEdit(this.serviceAgreement);
  }
  terminateAndClose() {
    this.contractsService.terminate(this.serviceAgreement.id).subscribe(data => {
      this.closed();
    })
  }
}
