import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { ContractItem } from '../class/contract-item';
import { ContractsFilter } from '../class/contracts-filter';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { REMOVE_CONTRACT } from 'src/ng2/app/const/confirm';
import { Subscription } from 'rxjs';
import { ContractsRealTimeService } from 'src/ng2/app/states/contracts/contracts-real-time.service';
import { ContractsListService } from '../services/contracts-list.service';
import { NotificationStateService } from '../../../shared/notification/services/notification-state.service';

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
  sub: Subscription = new Subscription();
  constructor(private contractsService: ContractsService,
    private contractsStateService: ContractsStateService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private contractsRealTimeService: ContractsRealTimeService,
    private contractsListService: ContractsListService,
    private notificationStateService: NotificationStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) this.getServiceAgreements(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getServiceAgreements(data);
    })
    this.sub.add(getOnCompanies);
    this.contractsStateService.getSort().subscribe(data => {
      this.filter.onSort(data, this.list);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
    this.contractsStateService.getFilter().subscribe(data => {
      this.filter.setFilters(data)
      this.list = this.filter.getFilterList(this.reqList);
      this.filter.onSort('company', this.list);
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
    this.contractsRealTimeService.changeContractsArray.subscribe(data => {
      if (data.action === 'SERVICE_AGREEMENT_SAVED') {
        let company = this.companiesStateService.getCompanies().find(item => item.id === data.data.company.id);
        data.data.company.name = company.name;

        let findIndexReq = this.reqList.findIndex(item => item.id === data.data.id);
        let findIndex = this.list.findIndex(item => item.id === data.data.id);
        if (findIndexReq > -1) {
          this.reqList[findIndexReq] = new ContractItem(data.data);
        } else {
          this.reqList.push(new ContractItem(data.data));
        }
        if (findIndex > -1) {
          this.list[findIndex] = new ContractItem(data.data);
        } else {
          if (this.filter.checkFilterItem(data.data)) this.list.push(new ContractItem(data.data));
        }

      } else if (data.action === 'SERVICE_AGREEMENT_DELETED') {
        let findIndexReq = this.reqList.findIndex(item => item.id === data.data.id);
        let findIndex = this.list.findIndex(item => item.id === data.data.id);
        if (findIndexReq > -1) this.reqList.splice(findIndexReq, 1);
        if (findIndex > -1) this.list.splice(findIndex, 1);
      }
      this.cd.detectChanges();
    })
  }

  getServiceAgreements(companies) {
    this.contractsService.getServiceAgreements().subscribe(data => {
      let showNotificationReview = false;
      this.reqList = data.map(contact => {
        if (!showNotificationReview) showNotificationReview = this.contractsListService.isShowNotificationReview(contact.reviewDate);
        let company = companies.find(item => item.id === contact.company.id);
        contact.company.name = company.name;
        return contact;
      });
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
      this.notificationStateService.oninitShowNotification("Billable item created");
    })
  }
  onDelete(data) {
    this.contractsService.delete(data.id).subscribe(data => {
      
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
