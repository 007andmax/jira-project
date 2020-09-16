import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { ContractItem } from '../class/contract-item';
import { ContractsFilter } from '../class/contracts-filter';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { REMOVE_CONTRACT } from 'src/ng2/app/const/confirm';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contracts-table',
  templateUrl: './contracts-table.component.html',
  styleUrls: ['./contracts-table.component.scss']
})
export class ContractsTableComponent implements OnInit,OnDestroy {
  filter: ContractsFilter = new ContractsFilter();
  list: Array<ContractItem> = [];
  reqList: Array<ContractItem> = [];
  sub:Subscription = new Subscription();
  constructor(private contractsService: ContractsService,
    private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) this.getServiceAgreements(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getServiceAgreements(data);
    })
    this.sub.add(getOnCompanies);
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
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CONTRACT) this.onDelete(this.contractsStateService.getContractForDelete());
      }
    })
    this.sub.add(getConfirm);
  }
  getServiceAgreements(companies) {
    this.contractsService.getServiceAgreements().subscribe(data => {
      this.reqList = data.map(contact => {
        let company = companies.find(item => item.id === contact.company.id);
        contact.company.name = company.name;
        return contact;
      });
      this.list = JSON.parse(JSON.stringify(this.reqList));
      this.filter.onSort('company', this.list);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
  }
  onDelete(data) {
    this.contractsService.delete(data.id).subscribe(data => {
      //  this.contractsStateService.setPreview(data);
    })
  }
  onTerminate(data) {
    this.contractsService.terminate(data.id).subscribe(data => {
      //  this.contractsStateService.setPreview(data);
    })
  }
  onCopy(data) {
    this.contractsService.getServiceAgreement(data.id).subscribe(data => {
      this.contractsStateService.setContractForCopy(data);
      this.contractsStateService.toggleCreate(true);
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
