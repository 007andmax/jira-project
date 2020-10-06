import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/class/taxes/tax';
import { InvoiceFormTicketEditTaxesComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsUserDeviceValidate } from '../../contracts-aside/class/contracts-user-device-validate';
import * as moment from "moment";
import { ContractsConfirmComponent } from '../../contracts-confirm/contracts-confirm.component';
import { ServiceAgreementBlockTimeServices } from '../../class/service-agreement-block-time-services';
import { DatePickerComponent } from 'src/ng2/app/components/shared/date-picker/date-picker.component';

@Component({
  selector: 'app-contracts-aside-user-device-edit',
  templateUrl: './contracts-aside-user-device-edit.component.html',
  styleUrls: ['./contracts-aside-user-device-edit.component.scss']
})
export class ContractsAsideUserDeviceEditComponent implements OnInit {
  @ViewChild('taxes') taxesDP: InvoiceFormTicketEditTaxesComponent;
  @ViewChild('customDateDP') customDateDP: DatePickerComponent;
  selectedCompany: any;
  selectedTaxes = [];
  selectedType = new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER', null);
  validate: ContractsUserDeviceValidate = new ContractsUserDeviceValidate();
  @Input() contractsUserDevice: ServiceAgreement = new ServiceAgreement();
  @Output() onClose = new EventEmitter<any>();
  formatDate: string = FORMAT_DATE_2;
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  taxes: Array<Tax> = [];
  minStartDate: number = null;
  toggleMaximumAmountHours: boolean = false;
  toggleContractServices: boolean = false;
  defaultSelectedTax: Array<Tax> = [];
  customDate = new Date().getTime();
  minCustomDate = new Date().getTime();
  
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
    private defaultServicesService: DefaultServicesService,
    private contractsService: ContractsService,
    private modalService: NgbModal,
    private сontractsStateService: ContractsStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsUserDevice.companyId);
    if (this.taxesStateService.getTaxes().length > 0) this.taxes = this.taxesStateService.getTaxes();
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.taxes = data;
    })
    if (this.contractsUserDevice.interval) {
      this.selectedInterval = this.contractsUserDevice.interval;
    } else {
      this.selectedInterval = (this.contractsUserDevice.customInterval === 30) ? '30 days' : (this.contractsUserDevice.customInterval === 15) ? '15 days' : '7 days';
    }
    this.contractsUserDevice.setIntervalString(this.selectedInterval);
    this.taxesDP.setEditItems(this.taxes.filter(item => {
      let find = this.contractsUserDevice.taxIds.find(taxId => taxId === item.id);
      return (find) ? true : false;
    }))
    if (this.contractsUserDevice.services.length > 0) this.toggleContractServices = true;
    this.minStartDate = this.getMinStartDate(this.contractsUserDevice.intervalstring, this.contractsUserDevice.startDate);
    if (this.contractsUserDevice.includedHours && this.contractsUserDevice.rateExceeding) {
     this.contractsUserDevice.blockTimeServices =  this.contractsUserDevice.blockTimeServices;
     this.toggleMaximumAmountHours = true;
    } else {
      this.contractsUserDevice.blockTimeServices =  this.contractsUserDevice.serviceContractServicesToTrack;
    }
    this.setMinCustomDate();
   }
   private setMinCustomDate() {
    let today = new Date(this.contractsUserDevice.startDate);
    this.minCustomDate = today.getTime();
    if (this.customDateDP) this.customDateDP.minDate = this.minCustomDate;
   console.log("this.customDateDP",this.customDateDP);
   this.cd.detectChanges();
  }
  public onEdit() { 
    if (this.contractsUserDevice.blockTimeServices.length === 0 || !this.contractsUserDevice.checkDuplicatedBlockTimeServices() || !this.contractsUserDevice.checkDuplicatedServiceContractServices()
    || !this.contractsUserDevice.checkDuplicatedServices()) {
    this.cd.detectChanges();
    return;
  };
  this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
    moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getAllServicesName()).subscribe(data => {
      if (Object.keys(data).length === 0) {
        this.contractsService.updateContract(this.contractsUserDevice.getDataForUpdateServiceContract(this.toggleMaximumAmountHours)).subscribe(res => {
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
  onChangeCustomDate(data) {
    this.contractsUserDevice.setCustomDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  parsedateForTotal(date) {
    return moment(date).format('DD MMM YYYY');
  }
  setToggleContractServices(data) {
    this.toggleContractServices = data;
    this.contractsUserDevice.services = [];
  }
 
  onCheckDuplicatedServices() {
    if (this.contractsUserDevice.services.length === 0 || !this.contractsUserDevice.checkDuplicatedServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getServicesName()).subscribe(data => {
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
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getBlockTimeServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0)  {
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
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getServiceContractServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0)  {
          let names = Object.keys(data);
          this.contractsUserDevice.serviceContractServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  
  setToggleMaximumAmountHours(data) {
    this.toggleMaximumAmountHours = data;

    if (data) {
      this.contractsUserDevice.blockRate = String(0);
      this.contractsUserDevice.includedHours = 0;
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
  onTaxesChange(data) {
    this.contractsUserDevice.setTaxIds(data.map(item => item.id));
  }
  addBlockTimeService() {
    this.contractsUserDevice.blockTimeServices.push(new ServiceAgreementBlockTimeServices(this.contractsUserDevice.getDefaultBlockTimeService()));
  }
  addServiceContractService() {
    this.contractsUserDevice.serviceContractServices.push(new ServiceAgreementBlockTimeServices(this.contractsUserDevice.getDefaultBlockTimeService()));
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
  onChangeStartDate(data) {
    this.contractsUserDevice.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    if (this.contractsUserDevice.withCustomBillingDate) this.resetCustomDate();
    this.setMinCustomDate();
  }
  private resetCustomDate() {
    let startDate = new Date(this.contractsUserDevice.startDate);
    this.customDate = startDate.getTime();
    if (this.customDateDP) this.customDateDP.setEditDate(startDate.getTime());
    startDate.setMonth(startDate.getMonth() + 1);
    this.contractsUserDevice.setCustomDate(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

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
    this.contractsUserDevice.setIntervalString(data);
    this.contractsUserDevice.calculateEndDate();
    this.cd.detectChanges();
  }
  setToggleCustomBillingDate (data) {
    this.contractsUserDevice.withCustomBillingDate = data;
    if (!data) {
      this.contractsUserDevice.resetCustomBillingDate();
    } else {
      this.contractsUserDevice.customBillingDate = this.contractsUserDevice.startDate;
      this.resetCustomDate();
    }
  }
  
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
}
