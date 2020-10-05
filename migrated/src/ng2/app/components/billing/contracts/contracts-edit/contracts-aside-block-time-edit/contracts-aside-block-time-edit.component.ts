import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { Tax } from 'src/ng2/class/taxes/tax';
import { InvoiceFormTicketEditTaxesComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsBlockTimeValidate } from '../../contracts-aside/class/contracts-block-time-validate';
import * as moment from "moment";
import { TehUsersSateService } from 'src/ng2/app/components/shared/teh-users/services/teh-users-sate.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { СontractsBlockTimeShare } from '../../contracts-aside/class/contracts-block-time-share';
import { ContractsConfirmComponent } from '../../contracts-confirm/contracts-confirm.component';
import { Subscription } from 'rxjs';
import { ServiceAgreementBlockTimeServices } from '../../class/service-agreement-block-time-services';


@Component({
  selector: 'app-contracts-aside-block-time-edit',
  templateUrl: './contracts-aside-block-time-edit.component.html',
  styleUrls: ['./contracts-aside-block-time-edit.component.scss']
})
export class ContractsAsideBlockTimeEditComponent implements OnInit {
  @ViewChild('taxes') taxesDP: InvoiceFormTicketEditTaxesComponent;
  selectedCompany: any;
  selectedTaxes = [];
  selectedType = new ContractsFilterType('Block Time', 'BLOCK_TIME', null);
  validate: ContractsBlockTimeValidate = new ContractsBlockTimeValidate();
  @Input() contractsBlockTime: ServiceAgreement = new ServiceAgreement();
  @Output() onClose = new EventEmitter<any>();
  formatDate: string = FORMAT_DATE_2;
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  taxes: Array<Tax> = [];
  minStartDate: number = null;
  toggleContractServices: boolean = false;
  toggleTimeRollover: boolean = false;
  toggleNotifyAgentsUser: boolean = false;
  selectedUsers: any = [];
  userList = [];
  customDate = new Date().getTime();
  minCustomDate = new Date().getTime();
  maxCustomDate = new Date().getTime();
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private contractsService: ContractsService,
    private taxesStateService: TaxesStateService,
    private usersStateService: UsersStateService,
    private tehState: TehUsersSateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    private contractsStateService: ContractsStateService,
    private defaultServicesService: DefaultServicesService,) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsBlockTime.companyId);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    })
    if (this.contractsBlockTime.interval) {
      this.selectedInterval = this.contractsBlockTime.interval;
    } else {
      this.selectedInterval = (this.contractsBlockTime.customInterval === 30) ? '30 days' : (this.contractsBlockTime.customInterval === 15) ? '15 days' : '7 days';
    }
    this.contractsBlockTime.setIntervalString(this.selectedInterval);
    this.getUsers();
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
    this.minStartDate = this.getMinStartDate(this.contractsBlockTime.intervalstring, this.contractsBlockTime.startDate);
    this.setMinMaxCustomDate();
  }
  private setMinMaxCustomDate() {
    let today = new Date(this.contractsBlockTime.startDate);
    this.minCustomDate =new Date(today.getFullYear(),today.getMonth(),1).getTime();
    this.maxCustomDate =new Date(today.getFullYear(),today.getMonth(),new Date(today.getFullYear(), today.getMonth() +1, 0).getDate()).getTime();

  }
  onChangeCustomDate(data) {
    this.contractsBlockTime.setCustomDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  public onEdit() {
    if (this.contractsBlockTime.blockTimeServices.length === 0 || !this.contractsBlockTime.checkDuplicatedBlockTimeServices() && !this.contractsBlockTime.checkDuplicatedServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsBlockTime.startDate).format('DD MMM YYYY'),
      moment(this.contractsBlockTime.endDate).format('DD MMM YYYY'), this.contractsBlockTime.companyId, this.contractsBlockTime.id, this.contractsBlockTime.getAllServicesName()).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.contractsService.updateContract(this.contractsBlockTime.getDataForUpdateBlockTime()).subscribe(res => {
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
  setToggleCustomBillingDate (data) {
    this.contractsBlockTime.withCustomBillingDate = data;
    if (!data) {
      this.contractsBlockTime.clearCustomBillingDate();
    } else {
      this.contractsBlockTime.customBillingDate = this.contractsBlockTime.startDate;
      this.customDate = new Date(this.contractsBlockTime.startDate).getTime();
    }
  }
  selectAllUsers() {
    this.tehState.setUsersFromtEdit(JSON.parse(JSON.stringify(this.userList)));
    this.selectedUsers = JSON.parse(JSON.stringify(this.userList));
  }
  clearAllSelectedUsers() {
    this.tehState.onInitClear();
    this.selectedUsers = [];
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

  onAddDefaultService(data) {
    this.contractsBlockTime.addDefaultService(data);
    this.onCheckDuplicatedService();
  }
  onCheckDuplicatedCustomService() {
    if (this.contractsBlockTime.blockTimeServices.length === 0 || !this.contractsBlockTime.checkDuplicatedBlockTimeServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsBlockTime.startDate).format('DD MMM YYYY'),
      moment(this.contractsBlockTime.endDate).format('DD MMM YYYY'), this.contractsBlockTime.companyId, this.contractsBlockTime.id, this.contractsBlockTime.getBlockTimeServicesName()).subscribe(data => {
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
      moment(this.contractsBlockTime.endDate).format('DD MMM YYYY'), this.contractsBlockTime.companyId, this.contractsBlockTime.id, this.contractsBlockTime.getServicesName()).subscribe(data => {
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
    this.contractsBlockTime.blockTimeServices.push(new ServiceAgreementBlockTimeServices(this.contractsBlockTime.getDefaultBlockTimeService()));
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
    this.contractsBlockTime.setIntervalString(data);
    this.contractsBlockTime.calculateEndDate();
    this.cd.detectChanges();
  }
  onChangeStartDate(data) {
    this.contractsBlockTime.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsBlockTime.calculateEndDate();
  }
  onChangeReviewDate(data) {
    this.contractsBlockTime.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  public onCreate() {
    if (!this.validate.isValidate(this.contractsBlockTime)) return;
    const modalRef = this.modalService.open(ContractsConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do we need to create the billable item now?`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
