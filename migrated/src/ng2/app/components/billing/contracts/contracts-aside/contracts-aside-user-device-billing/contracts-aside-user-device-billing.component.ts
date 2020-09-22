import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { ContractsBlockTimeService } from '../class/contracts-block-time-service';
import { InvoiceFormTicketEditTaxesComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';

@Component({
  selector: 'app-contracts-aside-user-device-billing',
  templateUrl: './contracts-aside-user-device-billing.component.html',
  styleUrls: ['./contracts-aside-user-device-billing.component.scss']
})
export class ContractsAsideUserDeviceBillingComponent implements OnInit {
  @ViewChild('taxes') taxesDP: InvoiceFormTicketEditTaxesComponent;
  selectedType = new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER', null);
  contractsUserDevice: ContractsUserDevice = new ContractsUserDevice();
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  reviewDate = new Date().getTime();
  validate: ContractsUserDeviceValidate = new ContractsUserDeviceValidate();
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  serviceContractServicesType: string = "DEVICE";
  minStartDate: number = null;
  toggleMaximumAmountHours:boolean = true;
  toggleContractServices: boolean = false;
  defaultSelectedTax: Array<Tax> = [];
  constructor(private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
    private defaultServicesService: DefaultServicesService,
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
    this.contractsUserDevice.serviceContractServices = [new ContractsUserDeviceService(0, "Managed workstations", 0, this.defaultSelectedTax.map(item => item.id)),
    new ContractsUserDeviceService(0, "Managed servers", 0, this.defaultSelectedTax.map(item => item.id))]
  }
  private setDefaultTaxes(lsitTaxes) {
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.defaultSelectedTax = taxes;
    console.log("taxes",taxes);
    this.taxesDP.setEditItems(taxes);
    // this.taxesStateService.setTaxesFromtEdit(taxes);
  }
  setToggleContractServices(data) {
    this.toggleContractServices = data;
    this.contractsUserDevice.services = [];
  }
  onCheckDuplicatedServices() {
    if (this.contractsUserDevice.services.length === 0 || !this.contractsUserDevice.checkDuplicatedServices()) return;
    this.defaultServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, null, this.contractsUserDevice.getServicesName()).subscribe(data => {

        if (Object.keys(data).length === 0) {

        } else {
          let names = Object.keys(data);
          console.log("names", names);
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

        if (Object.keys(data).length === 0) {

        } else {
          let names = Object.keys(data);
          console.log("names", names);
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

        if (Object.keys(data).length === 0) {

        } else {
          let names = Object.keys(data);
          console.log("names", names);
          this.contractsUserDevice.serviceContractServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) item.validate = false;
          })
        }
      }, err => {

      })
  }
  onSetServiceContractServicesType(event, type) {
    console.log("event", event.target.checked);
    if (event.target.checked) {
      this.serviceContractServicesType = type;
      if (type === "DEVICE") this.contractsUserDevice.serviceContractServices = [new ContractsUserDeviceService(0, "Managed workstations", 0, this.defaultSelectedTax.map(item => item.id)),
      new ContractsUserDeviceService(0, "Managed servers", 0, this.defaultSelectedTax.map(item => item.id))];
      if (type === "USER") this.contractsUserDevice.serviceContractServices = [new ContractsUserDeviceService(0, "Managed users", 0, this.defaultSelectedTax.map(item => item.id))];
    }

  }
  setToggleMaximumAmountHours (data) {
    this.toggleMaximumAmountHours = data;
    this.contractsUserDevice.includedHours = "";
    this.contractsUserDevice.rateExceeding = "";
   if (data) this.taxesDP.setEditItems(this.defaultSelectedTax);
  }
  onTaxesChange(data) {
    this.contractsUserDevice.setTaxIds(data.map(item => item.id));
  }
  addBlockTimeService() {
    this.contractsUserDevice.blockTimeServices.push(new ContractsBlockTimeService("", 5));
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
  }
  onChangeStartDate(data) {
    this.contractsUserDevice.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
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
    console.log("this.minStartDate", this.minStartDate);
    this.contractsUserDevice.setInterval(data);
    this.contractsUserDevice.calculateEndDate();
    this.cd.detectChanges();
    console.log("this.contractsUserDevice.includedHours", this.contractsUserDevice);
  }
}
