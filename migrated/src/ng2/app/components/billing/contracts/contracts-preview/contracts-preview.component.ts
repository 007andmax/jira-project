import { Component, OnInit, Input } from '@angular/core';
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
    private contractsStateService: ContractsStateService,) { }

  ngOnInit() {
    
  }
  closed() {
    this.contractsStateService.togglePreview(false);
  }
}
