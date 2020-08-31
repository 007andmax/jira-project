import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-header',
  templateUrl: './contracts-header.component.html',
  styleUrls: ['./contracts-header.component.scss']
})
export class ContractsHeaderComponent implements OnInit {

  constructor(private contractsStateService: ContractsStateService) { }

  ngOnInit() {
  }
  public setFilter(name) {
    this.contractsStateService.setFilter(name);

  }
}
