import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePickerComponent } from 'src/ng2/app/components/shared/date-picker/date-picker.component';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsOtherValidate } from '../../contracts-aside/class/contracts-other-validate';
import * as moment from "moment";
import { ServiceAgreementServiceExpenses } from '../../class/service-agreement-service-expenses';
import { ContractsOtherProduct } from '../../contracts-aside/class/contracts-other-product';

@Component({
  selector: 'app-contracts-aside-product-service-edit',
  templateUrl: './contracts-aside-product-service-edit.component.html',
  styleUrls: ['./contracts-aside-product-service-edit.component.scss']
})
export class ContractsAsideProductServiceEditComponent implements OnInit {
  selectedType = new ContractsFilterType('Subscriptions', 'SERVICE_CONTRACT', 'OTHER');
  selectedCompany: any;
  @ViewChild('startDateDP') startDateDP: DatePickerComponent;
  @ViewChild('reviewDateDP') reviewDateDP: DatePickerComponent;
  @Output() onClose = new EventEmitter<any>();
  @Input() contractsOther: ServiceAgreement = new ServiceAgreement();
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  reviewDate = new Date().getTime();
  validate: ContractsOtherValidate = new ContractsOtherValidate();
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  minStartDate: number = null;
  type: string = "PRODUCTS";
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private contractsService: ContractsService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.contractsOther.companyId);
    if (this.contractsOther.interval) {
      this.selectedInterval = this.contractsOther.interval;
    } else {
      this.selectedInterval = (this.contractsOther.customInterval === 30) ? '30 days' : (this.contractsOther.customInterval === 15) ? '15 days' : '7 days';
    }
    this.contractsOther.setIntervalString(this.selectedInterval);
    this.minStartDate = this.getMinStartDate(this.contractsOther.intervalstring, this.contractsOther.startDate);
  }
  public onEdit() {
    if (!this.validate.isValidate(this.contractsOther) || !this.contractsOther.checkProductExpenses() || !this.contractsOther.checkServiceExpenses()) {
      this.cd.detectChanges();
      return;
    }
    this.contractsService.updateContract(this.contractsOther.getDataForUpdateOtherContract()).subscribe(res => {
      this.onClose.emit(null);
    })
  }
  addService() {
    this.contractsOther.serviceExpenses.push(new ServiceAgreementServiceExpenses({
      date: new Date().getTime(),
      description: "",
      quantity: 0,
      serviceExpenseDurationEnd: null,
      serviceExpenseDurationStart: null,
      serviceId: "",
      name: null
    }));
    this.validate.resetServicesOrProducts();
  }
  addProduct() {
    this.contractsOther.productExpenses.push(new ContractsOtherProduct("", 0, 0, null));
    this.validate.resetServicesOrProducts();
  }
  onRemoveService(i) {
    this.contractsOther.serviceExpenses.splice(i, 1);
  }
  onRemoveProduct(i) {
    this.contractsOther.productExpenses.splice(i, 1);
  }
  onSelectCompany(data) {
    this.contractsOther.setCompanyId((data) ? data.id : null);
    if (data) this.validate.resetCompany();
  }
  onChangeStartDate(data) {
    this.contractsOther.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsOther.calculateEndDate();
  }
  onChangeReviewDate(data) {
    this.contractsOther.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onSelectInterval(data) {
    this.selectedInterval = data;
    this.minStartDate = this.getMinStartDate(data, this.contractsOther.startDate);
    this.contractsOther.setIntervalString(data);
    this.contractsOther.calculateEndDate();
    this.cd.detectChanges();
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
  parsedateForTotal(date) {
    return moment(date).format('DD MMM YYYY');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
