import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ContractsFilterComponent } from '../contracts-filter/contracts-filter.component';

@Component({
  selector: 'app-contracts-header',
  templateUrl: './contracts-header.component.html',
  styleUrls: ['./contracts-header.component.scss']
})
export class ContractsHeaderComponent implements OnInit {
  @Input() companyContracts:Company = null;
  @ViewChild('filter') filter: ContractsFilterComponent;
  count = 0;
  toggleFilter: boolean = true;
  countFilter: number = 0;
  constructor(private contractsStateService: ContractsStateService) { }

  ngOnInit() {
  }
  public showCreate() {
    this.contractsStateService.toggleCreate(true);
  }
  public setSort(name) {
    this.contractsStateService.setSort(name);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
}
