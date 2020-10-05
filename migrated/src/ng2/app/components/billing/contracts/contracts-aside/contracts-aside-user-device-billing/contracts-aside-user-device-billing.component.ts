import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/class/taxes/tax';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ContractsUserDevice } from '../class/contracts-user-device';
import { ContractsUserDeviceService } from '../class/contracts-user-device-service';
import { ContractsUserDeviceValidate } from '../class/contracts-user-device-validate';
import * as moment from "moment";
import { InvoiceFormTicketEditTaxesComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractsConfirmComponent } from '../../contracts-confirm/contracts-confirm.component';
import { DatePickerComponent } from 'src/ng2/app/components/shared/date-picker/date-picker.component';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';
import { ContractsBlockTimeService } from '../class/contracts-block-time-service';
import { Subscription } from 'rxjs';
import { ContractsListService } from '../../services/contracts-list.service';

@Component({
  selector: 'app-contracts-aside-user-device-billing',
  templateUrl: './contracts-aside-user-device-billing.component.html',
  styleUrls: ['./contracts-aside-user-device-billing.component.scss'],
  providers: [ContractsListService]
})
export class ContractsAsideUserDeviceBillingComponent implements OnInit, OnDestroy {
  @ViewChild('taxes') taxesDP: InvoiceFormTicketEditTaxesComponent;
  @ViewChild('startDateDP') startDateDP: DatePickerComponent;
  @ViewChild('reviewDateDP') reviewDateDP: DatePickerComponent;
  @ViewChild('topContract') topContract: ContractsAsideTopComponent;
  @ViewChild('customDateDP') customDateDP: DatePickerComponent;
  @Output() onClose = new EventEmitter<any>();
  selectedType = new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER', null);
  contractsUserDevice: ContractsUserDevice = new ContractsUserDevice();
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  reviewDate = new Date().getTime();
  validate: ContractsUserDeviceValidate = new ContractsUserDeviceValidate();
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  minStartDate: number = null;
  customDate = new Date().getTime();
  minCustomDate = new Date().getTime();
  maxCustomDate = new Date().getTime();
  taxes: Array<Tax> = [];
  toggleMaximumAmountHours: boolean = false;
  toggleContractServices: boolean = false;
  defaultSelectedTax: Array<Tax> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
    private defaultServicesService: DefaultServicesService,
    private contractsService: ContractsService,
    private modalService: NgbModal,
    private сontractsStateService: ContractsStateService,
    private contractsListService:ContractsListService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    let today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.contractsUserDevice.setStartDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsUserDevice.setReviewDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
   
    this.minStartDate = this.getMinStartDate('MONTHLY', this.contractsUserDevice.startDate);
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    let getConfirm = this.сontractsStateService.getConfirm().subscribe(data => {
      this.onCheckServicesForAdd(data);
    })
    this.sub.add(getConfirm);
    this.contractsUserDevice.serviceContractServices = [new ContractsUserDeviceService(0, "Managed workstations", 0, this.defaultSelectedTax.map(item => item.id)),
    new ContractsUserDeviceService(0, "Managed servers", 0, this.defaultSelectedTax.map(item => item.id))]
    if (this.сontractsStateService.getContractForCopy()) this.onInitCopy();
    this.setMinMaxCustomDate();
  }
  private setMinMaxCustomDate() {
    let today = new Date(this.startDate);
    this.minCustomDate =today.getTime();
    this.maxCustomDate =new Date(today.getFullYear(),today.getMonth(),new Date(today.getFullYear(), today.getMonth() +1, 0).getDate()).getTime();

  }
  public onInitCopy() {
    this.contractsUserDevice.setDataFromCopy(this.сontractsStateService.getContractForCopy());
    this.selectedInterval = this.contractsUserDevice.intervalstring;
    this.startDate = this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.startDateDP.minDate = this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.reviewDate = this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.reviewDateDP.minDate = this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.startDateDP.setEditDate(this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds());
    this.reviewDateDP.setEditDate(this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds());
    this.topContract.companiesDP.selectedItem = this.companiesStateService.getCompanies().find(item => item.id === this.contractsUserDevice.companyId);
    this.taxesDP.setEditItems(this.taxes.filter(item => {
      let find = this.contractsUserDevice.taxIds.find(taxId => taxId === item.id);
      return (find) ? true : false;
    }))
    if (this.contractsUserDevice.services.length > 0) this.toggleContractServices = true;
    if (this.contractsUserDevice.includedHours && this.contractsUserDevice.rateExceeding) this.toggleMaximumAmountHours = true;
    this.customDate = this.сontractsStateService.getContractForCopy().getCustomDateByMilliseconds();
  }
  private setDefaultTaxes(lsitTaxes) {
    this.taxes = lsitTaxes;
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.defaultSelectedTax = taxes;
    this.taxesDP.setEditItems(taxes);
  }
  parsedateForTotal(date) {
    return moment(date).format('DD MMM YYYY');
  }
  setToggleContractServices(data) {
    this.toggleContractServices = data;
    this.contractsUserDevice.services = [];
  }
  onCheckServicesForAdd(createBillableItem) {
    if (this.contractsUserDevice.blockTimeServices.length === 0 || !this.contractsUserDevice.checkDuplicatedBlockTimeServices() || !this.contractsUserDevice.checkDuplicatedServiceContractServices()
      || !this.contractsUserDevice.checkDuplicatedServices()) {
      this.cd.detectChanges();
      return;
    };
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, null, this.contractsUserDevice.getAllServicesName()).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.contractsService.createContract(createBillableItem, this.contractsUserDevice.getDataForCreate(this.toggleMaximumAmountHours)).subscribe(res => {
            this.onClose.emit(null);
          })
        } else {
          let names = Object.keys(data);
          this.contractsUserDevice.blockTimeServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
          this.contractsUserDevice.services.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
          this.contractsUserDevice.serviceContractServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  onCheckDuplicatedServices() {
    if (this.contractsUserDevice.services.length === 0 || !this.contractsUserDevice.checkDuplicatedServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, null, this.contractsUserDevice.getServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsUserDevice.services.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  onCheckDuplicatedBlockTimeServices() {
    if (this.contractsUserDevice.blockTimeServices.length === 0 || !this.contractsUserDevice.checkDuplicatedBlockTimeServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, null, this.contractsUserDevice.getBlockTimeServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsUserDevice.blockTimeServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  onCheckDuplicatedServiceContractServices() {
    if (this.contractsUserDevice.serviceContractServices.length === 0 || !this.contractsUserDevice.checkDuplicatedServiceContractServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, null, this.contractsUserDevice.getServiceContractServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsUserDevice.serviceContractServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  onSetServiceContractServicesType(event, type) {
    if (event.target.checked) {
      this.contractsUserDevice.billType = type;
      if (type === "DEVICE") this.contractsUserDevice.serviceContractServices = [new ContractsUserDeviceService(0, "Managed workstations", 0, this.defaultSelectedTax.map(item => item.id)),
      new ContractsUserDeviceService(0, "Managed servers", 0, this.defaultSelectedTax.map(item => item.id))];
      if (type === "USER") this.contractsUserDevice.serviceContractServices = [new ContractsUserDeviceService(0, "Managed users", 0, this.defaultSelectedTax.map(item => item.id))];
    }
  }
  setToggleMaximumAmountHours(data) {
    this.toggleMaximumAmountHours = data;
    if (data) {
      this.contractsUserDevice.blockRate = 0;
      this.contractsUserDevice.includedHours = "";
      this.contractsUserDevice.rateExceeding = "";
      this.contractsUserDevice.setTaxIds(this.defaultSelectedTax.map(item => item.id));
      this.taxesDP.setEditItems(this.defaultSelectedTax);
    } else {
      this.contractsUserDevice.setTaxIds(null);
      this.contractsUserDevice.blockRate = undefined;
      this.contractsUserDevice.includedHours = undefined;
      this.contractsUserDevice.rateExceeding = undefined;
    }

    this.validate.resetIncludedHours();
    this.validate.resetRateExceeding();
  }
  setToggleCustomBillingDate (data) {
    this.contractsUserDevice.withCustomBillingDate = data;
    if (!data) {
      this.contractsUserDevice.clearCustomBillingDate();
    } else {
      this.contractsUserDevice.customBillingDate = this.contractsUserDevice.startDate;
      this.resetCustomDate();
    }
    
  }
  private resetCustomDate() {
    let startDate = new Date(this.contractsUserDevice.startDate);
    this.customDate = startDate.getTime();
    if (this.customDateDP) this.customDateDP.setEditDate(startDate.getTime());
    startDate.setMonth(startDate.getMonth() + 1);
    this.contractsUserDevice.setCustomDate(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

  }
  onTaxesChange(data) {
    this.contractsUserDevice.setTaxIds(data.map(item => item.id));
  }
  addBlockTimeService() {
    this.contractsUserDevice.blockTimeServices.push(new ContractsBlockTimeService("", 0));
  }
  addServiceContractService() {
    this.contractsUserDevice.serviceContractServices.push(new ContractsUserDeviceService(0, "", 0, this.defaultSelectedTax.map(item => item.id)));
  }
  onRemoveServices(i) {
    this.contractsUserDevice.services.splice(i, 1);
  }
  onRemoveBlockTimeServices(i) {
    this.contractsUserDevice.blockTimeServices.splice(i, 1);
  }
  onRemoveServiceContractServices(i) {
    this.contractsUserDevice.serviceContractServices.splice(i, 1);
  }
  onSelectCompany(data) {
    this.contractsUserDevice.setCompanyId((data) ? data.id : null);
    if (data) this.validate.resetCompany();
  }
  onChangeCustomDate(data) {
    this.contractsUserDevice.setCustomDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onChangeStartDate(data) {
    this.contractsUserDevice.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    if (this.contractsUserDevice.withCustomBillingDate) this.resetCustomDate();
    this.setMinMaxCustomDate();
  }
  onChangeReviewDate(data) {
    this.contractsUserDevice.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
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
    this.contractsUserDevice.addDefaultService(data);
    this.onCheckDuplicatedServices();
  }
  onSelectInterval(data) {
    this.selectedInterval = data;
    this.minStartDate = this.getMinStartDate(data, this.contractsUserDevice.startDate);
    this.contractsUserDevice.setInterval(data);
    this.contractsUserDevice.calculateEndDate();
    this.cd.detectChanges();
  }
  public onCreate() {
    if (!this.validate.isValidate(this.contractsUserDevice)) return;
    if (this.contractsListService.compareDateNowWithDate(this.contractsUserDevice.startDate)) {
      const modalRef = this.modalService.open(ContractsConfirmComponent, { windowClass: 'xs-modal user-modal',backdrop: false });
      modalRef.componentInstance.message = `Do we need to create the billable item now?`;
    } else {
      this.onCheckServicesForAdd(false);
    }
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
