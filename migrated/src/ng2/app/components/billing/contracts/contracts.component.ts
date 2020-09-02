import { Component, OnInit } from '@angular/core';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';

@Component({
  selector: 'contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  showCreate = false;
  constructor(private contractsStateService: ContractsStateService) { }

  ngOnInit() {
    this.contractsStateService.getOnToggleCreate().subscribe(data => {
      this.showCreate = data;
    })
  }

}
