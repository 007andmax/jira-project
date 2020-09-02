import { Component, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-aside',
  templateUrl: './contracts-aside.component.html',
  styleUrls: ['./contracts-aside.component.scss']
})
export class ContractsAsideComponent implements OnInit {
  type: string = null;
  step: number = 1;
  constructor(private contractsStateService: ContractsStateService) { }

  ngOnInit() {
    this.contractsStateService.getOnChangeType().subscribe(data => {
      this.type = `${data.type}${(data.billType) ? "_" + data.billType : ""}`;
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
