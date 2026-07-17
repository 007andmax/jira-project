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
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'app-contracts-table',
  templateUrl: './contracts-table.component.html',
  styleUrls: ['./contracts-table.component.scss'],
  providers: [ContractsListService]
})
export class ContractsTableComponent implements OnInit, OnDestroy {
  toggleFilter: boolean = false;
  showPreloader: boolean = true;
  showPendingPreloader: boolean = false;
  filter: ContractsFilter = new ContractsFilter();
  list: Array<ContractItem> = [];
  @Input() companyContracts: Company = null;
  sortBy: TicketSortBy = new TicketSortBy('COMPANY', 'ASC');
  public infiniteScrollDisabled = false;
  container = document.body.querySelector(".main-container");
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
    this.showPreloader = true;
    if (this.companyContracts) this.filter.setCompany(this.companyContracts);
    this.onScroll();
    this.cd.detectChanges();
    let getSort = this.contractsStateService.getSort().subscribe(data => {
      this.filter.setSortOrder(data);
      //  this.filter.onSort(data, this.list);
      //  this.contractsStateService.changeSortDirection(this.filter.direction);
      this.showPreloader = true;
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getSort);
    let getFilter = this.contractsStateService.getFilter().subscribe(data => {
      this.filter.setFilters(data)
      this.showPreloader = true;
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getFilter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CONTRACT) this.onDelete(this.contractsStateService.getContractForDelete());
      }
    })
    this.sub.add(getConfirm);
    let onFastAdd = this.contractsStateService.onFastAdd.subscribe(data => {
      if ((this.companyContracts && this.companyContracts.id == data.companyId || !this.companyContracts)) this.addContract(data);
    })
    this.sub.add(onFastAdd);
    let onFastEdit = this.contractsStateService.onFastEdit.subscribe(data => {
      this.addContract(data);
    })
    this.sub.add(onFastEdit);
    let changeContractsArray = this.contractsRealTimeService.changeContractsArray.subscribe(data => {
      if (data.action === 'SERVICE_AGREEMENT_SAVED') {
        if ((this.companyContracts && this.companyContracts.id == data.data.companyId || !this.companyContracts)) this.addContract(data.data);
      } else if (data.action === 'SERVICE_AGREEMENT_DELETED') {
        this.removeContract(data.data.id);
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeContractsArray);
    let onToggleFitler = this.contractsStateService.onToggleFitler.subscribe(res => {
      this.toggleFilter = res;
    })
    this.sub.add(onToggleFitler);
  }
  public setSort(name) {
    this.sortBy.sortBy = name;
    this.sortBy.sortDirection = this.sortBy.sortDirection == 'DESC' ? 'ASC' : 'DESC';
    this.contractsStateService.setSort(`${name}_${this.sortBy.sortDirection}`);
  }

  public setDefaultScoll() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.filter.offset = 0;
    this.contractsListService.setBlockList(false);
    this.list = [];
    this.cd.detectChanges();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getList();
  }
  private getList() {
    if (this.contractsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      this.cd.detectChanges();
      return;
    }
    if (this.filter.offset > 0) this.showPendingPreloader = true;
    this.contractsService.getServiceAgreements(this.filter.getDataForRequest()).subscribe((data: any) => {
      let showNotificationReview = false;
      this.list = [...this.list, ...data.serviceAgreements.map(item => new ContractItem(item))];
      this.list = Array.from(new Map(this.list.map(item => [item.id, item])).values());
      this.infiniteScrollDisabled = false;
      this.list.forEach(item => {
        if (!showNotificationReview) showNotificationReview = this.contractsListService.isShowNotificationReview(item.reviewDate);
      })
      console.log("this.list", this.list);
      if (showNotificationReview) this.contractsStateService.showNotificationReview();
      if (data.serviceAgreements < this.filter.pageSize) this.contractsListService.setBlockList(true);
      this.filter.offset += this.filter.pageSize;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
    this.cd.detectChanges();
  }
  removeContract(id) {
    let findIndex = this.list.findIndex(item => item.id === id);
    if (findIndex > -1) this.list.splice(findIndex, 1);
  }
  addContract(data) {
    let findIndex = this.list.findIndex(item => item.id === data.id);
    if (findIndex > -1) {
      this.list[findIndex] = new ContractItem(data);
    } else {
      if (this.filter.checkFilterItem(data)) {
        this.list.unshift(new ContractItem(data));
      }
    }
  }

  onForceCreate(data) {
    this.contractsService.forceCreate(data.id).subscribe(data => {

    })
  }
  onDelete(data) {
    this.contractsService.delete(data.id).subscribe(res => {
      this.confirmStateService.initRequest(false);
      this.removeContract(data.id);
    }, err => {
      this.confirmStateService.initRequest(false);
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
