import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { ContractItem } from '../class/contract-item';
import { ContractsFilter } from '../class/contracts-filter';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';

@Component({
  selector: 'app-contracts-table',
  templateUrl: './contracts-table.component.html',
  styleUrls: ['./contracts-table.component.scss']
})
export class ContractsTableComponent implements OnInit {
  filter: ContractsFilter = new ContractsFilter();
  list: Array<ContractItem> = [];
  reqList: Array<ContractItem> = [];
  constructor(private contractsService: ContractsService,
    private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.contractsService.getServiceAgreements().subscribe(data => {
      this.reqList = data.map(contact => {
        let company = this.companiesStateService.getCompanies().find(item => item.id === contact.company.id);
        contact.company.name = company.name;
        return contact;
      });
      this.list = JSON.parse(JSON.stringify(this.reqList));
      this.filter.onSort('company', this.list);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.contractsStateService.getSort().subscribe(data => {
      console.log("data", data);
      this.filter.onSort(data, this.list);
      console.log("this.list", this.list);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.contractsStateService.getFilter().subscribe(data => {
      console.log("data", data);
      this.filter.setFilters(data)

      this.list = this.filter.getFilterList(this.reqList);
      this.filter.onSort('company', this.list);
      console.log("this.list", this.list);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
  }

  onPreview(data) {
    this.contractsService.getServiceAgreement(data.id).subscribe(data => {
      this.contractsStateService.setPreview(data);
    })
  }
  onEdit(data) {
    this.contractsService.getServiceAgreement(data.id).subscribe(data => {
      this.contractsStateService.setEdit(data);
    })
  }
}
