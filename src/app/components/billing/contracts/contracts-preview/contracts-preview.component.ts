import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ServiceAgreement } from '../class/service-agreement';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Component({
  selector: 'app-contracts-preview',
  templateUrl: './contracts-preview.component.html',
  styleUrls: ['./contracts-preview.component.scss']
})
export class ContractsPreviewComponent implements OnInit {
  @Input() serviceAgreement: ServiceAgreement;
  constructor(private contractsService: ContractsService,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
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
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  closed() {
    this.contractsStateService.togglePreview(false);

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
