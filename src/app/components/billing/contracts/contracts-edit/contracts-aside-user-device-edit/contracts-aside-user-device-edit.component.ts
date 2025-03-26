import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { NonContractServicesService } from 'src/app/services/non-contract-services/non-contract-services.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { Tax } from 'src/class/taxes/tax';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsUserDeviceValidate } from '../../contracts-aside/class/contracts-user-device-validate';
import * as moment from "moment";
import { ServiceAgreementBlockTimeServices } from '../../class/service-agreement-block-time-services';
import { TaxesComponent } from 'src/app/components/shared/taxes/taxes.component';
import { ContractsAsideUserDeviceServiceComponent } from '../../contracts-aside/contracts-aside-user-device-billing/contracts-aside-user-device-service/contracts-aside-user-device-service.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';

@Component({
  selector: 'app-contracts-aside-user-device-edit',
  templateUrl: './contracts-aside-user-device-edit.component.html',
  styleUrls: ['./contracts-aside-user-device-edit.component.scss']
})
export class ContractsAsideUserDeviceEditComponent implements OnInit, OnDestroy {
  @ViewChild('taxes', { static: true }) taxesDP: TaxesComponent;
  @ViewChild('taxesServices', { static: true }) taxesServicesDP: TaxesComponent;
  selectedCompany: any;
  selectedTaxes = [];
  selectedType = new ContractsFilterType('Service Contract/by device/by user', 'SERVICE_CONTRACT_DEVICE_USER', null);
  validate: ContractsUserDeviceValidate = new ContractsUserDeviceValidate();
  @ViewChildren("deviceService") deviceServices: QueryList<ContractsAsideUserDeviceServiceComponent>;
  @Input() contractsUserDevice: ServiceAgreement = new ServiceAgreement();
  @Output() onClose = new EventEmitter<any>();
  @Output() onInitRequestForEdit = new EventEmitter<any>();
  formatDate: string = FORMAT_DATE_2;
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  taxes: Array<Tax> = [];
  minStartDate: number = null;
  toggleMaximumAmountHours: boolean = false;
  toggleContractServices: boolean = false;
  defaultSelectedTax: Array<Tax> = [];
  sub: Subscription = new Subscription();
  @ViewChild('managedServices', { static: true }) managedServices: NgbTooltip;
  @ViewChild('maximumAmount', { static: true }) maximumAmount: NgbTooltip;
  constructor(private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
    private nonContractServicesService: NonContractServicesService,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    private contractsService: ContractsService,
    private contractsStateService: ContractsStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsUserDevice.companyId);
    if (this.taxesStateService.getTaxes().length > 0) this.setDefaultTaxes(this.taxesStateService.getTaxes());
    let getOnTaxess = this.taxesStateService.onGetTaxes.subscribe((data) => {
      this.setDefaultTaxes(data);
    })
    this.sub.add(getOnTaxess);
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
    let taxIds = [];
    this.contractsUserDevice.serviceContractServices.forEach(item => taxIds = [...taxIds, ...item.taxIds]);
    taxIds = taxIds.filter((item, pos) => taxIds.findIndex(accountItem => accountItem == item) == pos);
    this.taxesServicesDP.setEditItems(this.taxes.filter(item => {
      let find = taxIds.find(taxId => taxId === item.id);
      return (find) ? true : false;
    }))
    if (this.contractsUserDevice.services.length > 0) this.toggleContractServices = true;
    this.minStartDate = this.getMinStartDate(this.contractsUserDevice.intervalstring, this.contractsUserDevice.startDate);
    if (this.contractsUserDevice.includedHours && this.contractsUserDevice.rateExceeding) {
      this.contractsUserDevice.blockTimeServices = this.contractsUserDevice.blockTimeServices;
      this.toggleMaximumAmountHours = true;
    } else {
      this.contractsUserDevice.blockTimeServices = this.contractsUserDevice.serviceContractServicesToTrack;
    }
  }
  setInvoiceAsSingleItem(data) {
    this.contractsUserDevice.invoiceAsSingleItem = data;
    if (data) {
      this.taxesServicesDP.setEditItems(this.defaultSelectedTax);
      this.onServiceTaxesChange(this.defaultSelectedTax);
    }
  }
  showManagedServices() {
    this.managedServices.open();
  }
  onChangeRateExceeding(data) {
    // this.maximumAmount.open();
    this.contractsUserDevice.rateExceeding = data;
  }
  private setDefaultTaxes(lsitTaxes) {
    this.taxes = lsitTaxes;
    let taxes = lsitTaxes.filter(item => item.isDefault === true);
    this.defaultSelectedTax = taxes;
    if (this.contractsUserDevice.invoiceAsSingleItem) this.taxesServicesDP.setEditItems(taxes);
  }
  public onEdit() {
    if (!this.contractsUserDevice.checkDuplicatedBlockTimeServices() || !this.contractsUserDevice.checkDuplicatedServiceContractServices()
      || !this.contractsUserDevice.checkDuplicatedServices() || !this.validate.isValidate(this.contractsUserDevice)) {
      this.cd.detectChanges();
      return;
    };
    this.nonContractServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getAllServicesName()).subscribe(data => {
        if (Object.keys(data).length === 0) {
          this.onInitRequestForEdit.emit(null);
          this.contractsService.updateContract(this.contractsUserDevice.getDataForUpdateServiceContract(this.toggleMaximumAmountHours)).subscribe(res => {
            this.subscriptionServicesStateService.refreshServicesAgreements();
            this.contractsStateService.fastEditContract(res);
            this.onClose.emit(null);
          })
        } else {
          let names = Object.keys(data);
          this.contractsUserDevice.blockTimeServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) {
              item.validate = false;
              item.descriptionValidate = data[item.name];
            }
          })
          this.contractsUserDevice.services.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) {
              item.validate = false;
              item.descriptionValidate = data[item.name];
            }
          })
          this.contractsUserDevice.serviceContractServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) {
              item.validate = false;
              item.descriptionValidate = data[item.name];
            }
          })
        }
      }, err => {

      })
  }
  parsedateForTotal(date) {
    return moment(date).format('DD MMM YYYY');
  }
  setToggleContractServices(data) {
    this.toggleContractServices = data;
    this.contractsUserDevice.services = [];
  }
  onServiceTaxesChange(data) {
    this.contractsUserDevice.serviceContractServices.forEach((item, index) => {
      item.taxIds = data.map(item => item.id);
      this.deviceServices.toArray()[index].setSelectedTaxes(JSON.parse(JSON.stringify(data)));
    })
  }
  onCheckDuplicatedServices() {
    if (this.contractsUserDevice.services.length === 0 || !this.contractsUserDevice.checkDuplicatedServices()) return;
    this.nonContractServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsUserDevice.services.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) {
              item.validate = false;
              item.descriptionValidate = data[item.name];
            }
          })
        }
      }, err => {

      })
  }
  onCheckDuplicatedBlockTimeServices() {
    if (this.contractsUserDevice.blockTimeServices.length === 0 || !this.contractsUserDevice.checkDuplicatedBlockTimeServices()) return;
    this.nonContractServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getBlockTimeServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsUserDevice.blockTimeServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) {
              item.validate = false;
              item.descriptionValidate = data[item.name];
            }
          })
        }
      }, err => {

      })
  }
  onCheckDuplicatedServiceContractServices() {
    if (this.contractsUserDevice.serviceContractServices.length === 0 || !this.contractsUserDevice.checkDuplicatedServiceContractServices()) return;
    this.nonContractServicesService.searchDuplicatedServiceNames(moment(this.contractsUserDevice.startDate).format('DD MMM YYYY'),
      moment(this.contractsUserDevice.endDate).format('DD MMM YYYY'), this.contractsUserDevice.companyId, this.contractsUserDevice.id, this.contractsUserDevice.getServiceContractServicesName()).subscribe(data => {
        if (Object.keys(data).length > 0) {
          let names = Object.keys(data);
          this.contractsUserDevice.serviceContractServices.forEach(item => {
            let find = names.find(name => name === item.name);
            if (find) {
              item.validate = false;
              item.descriptionValidate = data[item.name];
            }
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
      this.contractsUserDevice.rateExceeding = "0.00";
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
    this.maximumAmount.open();
    this.contractsUserDevice.setTaxIds(data.map(item => item.id));
  }
  addBlockTimeService(data) {
    this.validate.resetBlockTimeServices();
    this.contractsUserDevice.blockTimeServices.push(new ServiceAgreementBlockTimeServices(data.getDataFromBillableService(this.toggleMaximumAmountHours), true));
    this.onCheckDuplicatedBlockTimeServices();
  }
  addServiceContractService(data) {
    this.validate.resetServiceContractServices();
    this.contractsUserDevice.serviceContractServices.push(new ServiceAgreementBlockTimeServices(data.getDataForBillableService(), true));
    if (this.contractsUserDevice.invoiceAsSingleItem) this.contractsUserDevice.serviceContractServices[this.contractsUserDevice.serviceContractServices.length - 1].setTaxIds(this.taxesServicesDP.selectedTax.map(item => item.id));
    this.onCheckDuplicatedServiceContractServices();
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

  public trackById(index, item) {
    return item.id;
  }
  public trackByServiceContractServicesId(index, item) {
    return item.subscriptionService.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
