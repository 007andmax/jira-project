import { Component, OnInit, ChangeDetectorRef, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsBlockTime } from '../class/contracts-block-time';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsBlockTimeService } from '../class/contracts-block-time-service';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import * as moment from "moment";
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { TehUsersSateService } from 'src/ng2/app/components/shared/teh-users/services/teh-users-sate.service';
import { ContractsBlockTimeValidate } from '../class/contracts-block-time-validate';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractsConfirmComponent } from '../../contracts-confirm/contracts-confirm.component';

import { Subscription } from 'rxjs';
import { СontractsBlockTimeShare } from '../class/contracts-block-time-share';
import { DatePickerComponent } from 'src/ng2/app/components/shared/date-picker/date-picker.component';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';
import { InvoiceFormTicketEditTaxesComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/class/taxes/tax';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { ContractsListService } from '../../services/contracts-list.service';

@Component({
  selector: 'app-contracts-aside-block-time-billing',
  templateUrl: './contracts-aside-block-time-billing.component.html',
  styleUrls: ['./contracts-aside-block-time-billing.component.scss'],
  providers: [ContractsListService]
})
export class ContractsAsideBlockTimeBillingComponent implements OnInit, OnDestroy {
  @Output() onClose = new EventEmitter<any>();
  @ViewChild('startDateDP') startDateDP: DatePickerComponent;
  @ViewChild('reviewDateDP') reviewDateDP: DatePickerComponent;
  @ViewChild('topContract') topContract: ContractsAsideTopComponent;
  @ViewChild('taxes') taxesDP: InvoiceFormTicketEditTaxesComponent;
  selectedType = new ContractsFilterType('Block Time', 'BLOCK_TIME', null);
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  minStartDate: number = null;
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  customDate = new Date().getTime();
  minCustomDate = new Date().getTime();
  maxCustomDate = new Date().getTime();
  reviewDate = new Date().getTime();
  toggleContractServices: boolean = false;
  toggleTimeRollover: boolean = false;
  toggleNotifyAgentsUser: boolean = false;
  toggleCustomBillingDate:boolean = false;
  selectedUsers = [];
  userList = [];
  taxes: Array<Tax> = [];
  contractsBlockTime: ContractsBlockTime = new ContractsBlockTime();
  validate: ContractsBlockTimeValidate = new ContractsBlockTimeValidate();
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private сontractsStateService: ContractsStateService,
    private contractsService: ContractsService,
    private usersStateService: UsersStateService,
    private defaultServicesService: DefaultServicesService,
    private tehState: TehUsersSateService,
    private modalService: NgbModal,
    private taxesStateService: TaxesStateService,
    private contractsListService: ContractsListService,
    public cd: ChangeDetectorRef) { }


  ngOnInit() {
    let today = new Date();
      
    today.setMonth(today.getMonth() + 1);
   this.setMinMaxCustomDate();
    this.contractsBlockTime.setStartDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsBlockTime.setReviewDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.minStartDate = this.getMinStartDate('MONTHLY', this.contractsBlockTime.startDate);
    this.getUsers();
    let getConfirm = this.сontractsStateService.getConfirm().subscribe(data => {
      this.onCheckServicesForAdd(data);
    })
    this.sub.add(getConfirm);
    if (this.taxesStateService.getTaxes().length > 0) {
      this.taxes = this.taxesStateService.getTaxes();
      this.setDefaultTaxes(this.taxesStateService.getTaxes());
    }
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
      this.setDefaultTaxes(data);
    })
    if (this.сontractsStateService.getContractForCopy()) this.onInitCopy();
  }
  private setMinMaxCustomDate() {
    let today = new Date();
    this.minCustomDate =new Date(today.getFullYear(),today.getMonth(),1).getTime();
    this.maxCustomDate =new Date(today.getFullYear(),today.getMonth(),new Date(today.getFullYear(), today.getMonth() +1, 0).getDate()).getTime();
   
  }
  private setDefaultTaxes(lsitTaxes) {
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.taxesDP.setEditItems(taxes);
    this.contractsBlockTime.setTaxIds(taxes.map(item => item.id));
  }
  public onInitCopy() {
    this.contractsBlockTime.setDataFromCopy(this.сontractsStateService.getContractForCopy());
    this.selectedInterval = this.contractsBlockTime.intervalstring;
    this.startDate = this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.startDateDP.minDate = this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.reviewDate = this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.reviewDateDP.minDate = this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.startDateDP.setEditDate(this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds());
    this.reviewDateDP.setEditDate(this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds());
    this.topContract.companiesDP.selectedItem = this.companiesStateService.getCompanies().find(item => item.id === this.contractsBlockTime.companyId);
    this.taxesDP.setEditItems(this.taxes.filter(item => {
      let find = this.contractsBlockTime.taxIds.find(taxId => taxId === item.id);
      return (find) ? true : false;
    }))
    if (this.contractsBlockTime.services.length > 0) this.toggleContractServices = true;
    if (this.contractsBlockTime.maxRolloverHours) this.toggleTimeRollover = true;
    if (this.contractsBlockTime.shares.length > 0) {
      this.selectedUsers = this.usersStateService.getAllUsers().filter(item => {
        let find = this.contractsBlockTime.shares.find(user => user.userId === item.id);
        return (find) ? true : false;
      })
      this.toggleNotifyAgentsUser = true;
    }
  }
  selectAllUsers() {
    this.tehState.setUsersFromtEdit(JSON.parse(JSON.stringify(this.userList)));
    this.selectedUsers = JSON.parse(JSON.stringify(this.userList));
    this.contractsBlockTime.setShares(this.selectedUsers.map(item => new СontractsBlockTimeShare(item.id)));
  }
  clearAllSelectedUsers() {
    this.tehState.onInitClear();
    this.selectedUsers = [];
    this.contractsBlockTime.setShares([]);
  }
  getMinStartDate(interval, startDate) {
    let newMinStartDate;
    let now = new Date(startDate);
    let n = new Date(now);
    let day = 1000 * 60 * 60 * 24;
    if (interval === 'MONTHLY') {
      n.setMonth(n.getMonth() - 1);
      newMinStartDate = n.getTime() + day;
    } else if (interval === 'YEARLY') {
      n.setFullYear(n.getFullYear() - 1);
      newMinStartDate = n.getTime() + day;
    } else if (interval === '30 days') {
      newMinStartDate = now.getTime() - (29 * day);
    } else if (interval === '15 days') {
      newMinStartDate = now.getTime() - (14 * day);
    } else if (interval === '7 days') {
      newMinStartDate = now.getTime() - (6 * day);
    }
    return newMinStartDate;
  }
  onCheckServicesForAdd(createBillableItem) {
    if (this.contractsBlockTime.blockTimeServices.length === 0 || !this.contractsBlockTime.checkDuplicatedBlockTimeServices() || !this.contractsBlockTime.checkDuplicatedServices()) {
      this.cd.detectChanges();
      return;
    }
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsBlockTime.startDate).format('DD MMM YYYY'),
      moment(this.contractsBlockTime.endDate).format('DD MMM YYYY'), this.contractsBlockTime.companyId, null, this.contractsBlockTime.getAllServicesName()).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.contractsService.createContract(createBillableItem, this.contractsBlockTime.getDataForCreate()).subscribe(res => {
            this.onClose.emit(null);
          })
        } else {
          let names = Object.keys(data);
          this.contractsBlockTime.blockTimeServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
          this.contractsBlockTime.services.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  onAddDefaultService(data) {
    this.contractsBlockTime.addDefaultService(data);
    this.onCheckDuplicatedService();
  }
  onCheckDuplicatedCustomService() {
    if (this.contractsBlockTime.blockTimeServices.length === 0 || !this.contractsBlockTime.checkDuplicatedBlockTimeServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsBlockTime.startDate).format('DD MMM YYYY'),
      moment(this.contractsBlockTime.endDate).format('DD MMM YYYY'), this.contractsBlockTime.companyId, null, this.contractsBlockTime.getBlockTimeServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsBlockTime.blockTimeServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  onCheckDuplicatedService() {
    if (this.contractsBlockTime.services.length === 0 || !this.contractsBlockTime.checkDuplicatedServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsBlockTime.startDate).format('DD MMM YYYY'),
      moment(this.contractsBlockTime.endDate).format('DD MMM YYYY'), this.contractsBlockTime.companyId, null, this.contractsBlockTime.getServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsBlockTime.services.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  getUsers() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
    let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.company.id === this.contractsBlockTime.companyId);
    this.userList = [...techusers, ...clientUsers];

  }
  parsedateForTotal(date) {
    return moment(date).format('DD MMM YYYY');
  }
  getIntervalText() {
    return this.selectedInterval.toLowerCase();
  }
  public onChangeUser(data) {
    this.selectedUsers = data;
    this.contractsBlockTime.setShares(this.selectedUsers.map(item => new СontractsBlockTimeShare(item.id)));
  }
  setToggleCustomBillingDate (data) {
    this.toggleCustomBillingDate = data;
    if (!data) {
      this.contractsBlockTime.clearCustomBillingDate();
    } else {
      this.contractsBlockTime.customBillingDate = this.contractsBlockTime.startDate;
    }
  }
  setToggleNotifyAgentsUser(data) {
    this.toggleNotifyAgentsUser = data;
    if (!data) this.clearAllSelectedUsers();
  }
  setToggleContractServices(data) {
    this.toggleContractServices = data;
    this.contractsBlockTime.services = [];
  }
  setToggleTimeRollover(data) {
    this.toggleTimeRollover = data;
    this.contractsBlockTime.maxRolloverHours = "";
  }
  addCustomService() {
    this.contractsBlockTime.blockTimeServices.push(new ContractsBlockTimeService("", 5));
  }
  onRemoveDefaultService(i) {
    this.contractsBlockTime.services.splice(i, 1);
  }
  onRemoveCustomService(i) {
    this.contractsBlockTime.blockTimeServices.splice(i, 1);
  }
  onSelectCompany(data) {
    this.contractsBlockTime.setCompanyId((data) ? data.id : null);
    this.validate.resetCompany();
  }
  onTaxesChange(data) {
    this.contractsBlockTime.setTaxIds(data.map(item => item.id));
  }
  onSelectInterval(data) {
    this.selectedInterval = data;
    this.minStartDate = this.getMinStartDate(data, this.contractsBlockTime.startDate);
    this.contractsBlockTime.setInterval(data);
    this.contractsBlockTime.calculateEndDate();
    this.cd.detectChanges();
  }
  onChangeStartDate(data) {
    this.contractsBlockTime.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeCustomDate(data) {
    this.contractsBlockTime.setCustomDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeReviewDate(data) {
    this.contractsBlockTime.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  public onCreate() {
    if (!this.validate.isValidate(this.contractsBlockTime)) return;
    if (this.contractsListService.compareDateNowWithDate(this.contractsBlockTime.startDate)) {
      const modalRef = this.modalService.open(ContractsConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: false });
      modalRef.componentInstance.message = `Do we need to create the billable item now?`;
    } else {
      this.onCheckServicesForAdd(false);
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
