import { Component, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ConstantsService } from 'src/ng2/app/services/constants/constants.service';

@Component({
  selector: 'app-contracts-aside',
  templateUrl: './contracts-aside.component.html',
  styleUrls: ['./contracts-aside.component.scss']
})
export class ContractsAsideComponent implements OnInit {
  
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
