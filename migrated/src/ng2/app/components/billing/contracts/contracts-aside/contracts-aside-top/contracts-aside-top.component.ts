import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { DropDownComponent } from 'src/ng2/app/components/shared/drop-down/drop-down.component';
@Component({
  selector: 'app-contracts-aside-top',
  templateUrl: './contracts-aside-top.component.html',
  styleUrls: ['./contracts-aside-top.component.scss']
})
export class ContractsAsideTopComponent implements OnInit {
  companies = [];
  listsTypes = [new ContractsFilterType('Hourly', 'HOURLY', null),
  new ContractsFilterType('Block Time', 'BLOCK_TIME', null),
  new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE', null),
  new ContractsFilterType('Service Contract/by other', 'SERVICE_CONTRACT', 'OTHER')];
  @Input() selectedType = new ContractsFilterType('Hourly', 'HOURLY', null);
  @Input() validateCompany: boolean = true;
  @Output() onSelectCompany = new EventEmitter<any>();
  @ViewChild('companiesDP') companiesDP: DropDownComponent;
  sub: Subscription = new Subscription();
  constructor(private contractsStateService: ContractsStateService,
    private companiesState: CompaniesStateService,) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  onSelectType(data) {
    this.contractsStateService.setType(data);
  }
  selectCompany(item) {
    this.onSelectCompany.emit(item);
  }
}
