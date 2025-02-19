import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { ContractItem } from '../class/contract-item';
import { ContractsFilter } from '../class/contracts-filter';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { REMOVE_CONTRACT } from 'src/app/const/confirm';
import { Subscription } from 'rxjs';
import { ContractsRealTimeService } from 'src/app/states/contracts/contracts-real-time.service';
import { ContractsListService } from '../services/contracts-list.service';
import { Company } from 'src/app/interfaces/company/company';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'app-contracts-table',
  templateUrl: './contracts-table.component.html',
  styleUrls: ['./contracts-table.component.scss'],
  providers: [ContractsListService]
})
export class ContractsTableComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  filter: ContractsFilter = new ContractsFilter();
  list: Array<ContractItem> = [];
  reqList: Array<ContractItem> = [];
  @Input() companyContracts: Company = null;
  sub: Subscription = new Subscription();
  constructor(private contractsService: ContractsService,
    private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private contractsRealTimeService: ContractsRealTimeService,
    private contractsListService: ContractsListService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    if (this.companiesStateService.getCompanies().length > 0) this.getServiceAgreements(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getServiceAgreements(data);
    })
    this.sub.add(getOnCompanies);
    let getSort = this.contractsStateService.getSort().subscribe(data => {
      this.filter.onSort(data, this.list);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getSort);
    let getFilter = this.contractsStateService.getFilter().subscribe(data => {
      this.filter.setFilters(data)
      this.list = this.filter.getFilterList(this.reqList);
      this.filter.onSort('company', this.list);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.sub.add(getFilter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CONTRACT) this.onDelete(this.contractsStateService.getContractForDelete());
      }
    })
    this.sub.add(getConfirm);
    let onFastAdd = this.contractsStateService.onFastAdd.subscribe(data => {
      this.addContract(data);
    })
    this.sub.add(onFastAdd);
    let onFastEdit = this.contractsStateService.onFastEdit.subscribe(data => {
      this.addContract(data);
    })
    this.sub.add(onFastEdit);
    let changeContractsArray = this.contractsRealTimeService.changeContractsArray.subscribe(data => {
      if (data.action === 'SERVICE_AGREEMENT_SAVED') {
        this.addContract(data.data);
      } else if (data.action === 'SERVICE_AGREEMENT_DELETED') {
        this.removeContract(data.data.id);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeContractsArray);
  }
  removeContract(id) {
    let findIndexReq = this.reqList.findIndex(item => item.id === id);
    let findIndex = this.list.findIndex(item => item.id === id);
    if (findIndexReq > -1) this.reqList.splice(findIndexReq, 1);
    if (findIndex > -1) this.list.splice(findIndex, 1);
  }
  addContract(data) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === data.company.id);
    data.company.name = company.name;

    let findIndexReq = this.reqList.findIndex(item => item.id === data.id);
    let findIndex = this.list.findIndex(item => item.id === data.id);
    if (findIndexReq > -1) {
      this.reqList[findIndexReq] = new ContractItem(data);
    } else {
      this.reqList.push(new ContractItem(data));
    }
    if (findIndex > -1) {
      this.list[findIndex] = new ContractItem(data);
    } else {
      if (this.filter.checkFilterItem(data)) {
        this.list.push(new ContractItem(data));
        this.filter.onSortList(this.list);
      }
    }
  }

  getServiceAgreements(companies) {
    let subscribe = (this.companyContracts) ? this.contractsService.getServiceAgreementsByCompany(this.companyContracts.id) : this.contractsService.getServiceAgreements();
    subscribe.subscribe(data => {
      let showNotificationReview = false;
      this.reqList = data.map(contact => {
        let company = companies.find(item => item.id === contact.company.id);
        contact.company.name = company.name;
        return contact;
      });
      //  if (this.companyContracts) this.reqList = this.reqList.filter(item => item.company.id === this.companyContracts.id);
      this.reqList.forEach(item => {
        if (!showNotificationReview) showNotificationReview = this.contractsListService.isShowNotificationReview(item.reviewDate);
      })
      if (showNotificationReview) this.contractsStateService.showNotificationReview();
      this.list = JSON.parse(JSON.stringify(this.reqList));
      this.filter.onSort('company', this.list);
      this.showPreloader = false;
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
  }
  onForceCreate(data) {
    this.contractsService.forceCreate(data.id).subscribe(data => {

    })
  }
  onDelete(data) {
    this.contractsService.delete(data.id).subscribe(res => {
      this.removeContract(data.id);
    })
  }
  onTerminate(data) {
    this.contractsService.terminate(data.id).subscribe(data => {

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
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
