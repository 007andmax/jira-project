import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { FORMAT_DATE_2 } from 'src/app/const/date-picker';
import { ContractsService } from 'src/app/services/contracts/contracts.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ServiceAgreement } from '../../class/service-agreement';
import { ContractsOtherValidate } from '../../contracts-aside/class/contracts-other-validate';
import * as moment from "moment";
import { ServiceAgreementServiceExpenses } from '../../class/service-agreement-service-expenses';
import { ContractsOtherProduct } from '../../contracts-aside/class/contracts-other-product';
import { ContractsStateService } from 'src/app/states/contracts/contracts-state.service';
import { DatePickerIntervalsComponent } from '../../contracts-aside/date-picker-intervals/date-picker-intervals.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContractsAsideOtherProductComponent } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-product/contracts-aside-other-product.component';
import { ContractsAsideOtherServiceComponent } from '../../contracts-aside/contracts-aside-product-service-contracts/contracts-aside-other-service/contracts-aside-other-service.component';
import { MatErrorComponent } from '../../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { DatePickerComponent as DatePickerComponent_1 } from '../../../../shared/date-picker/date-picker.component';
import { DropDownComponent } from '../../../../shared/drop-down/drop-down.component';

@Component({
    selector: 'app-contracts-aside-product-service-edit',
    templateUrl: './contracts-aside-product-service-edit.component.html',
    styleUrls: ['./contracts-aside-product-service-edit.component.scss'],
    standalone: true,
    imports: [DropDownComponent, DatePickerComponent_1, DatePickerIntervalsComponent, NgClass, FormsModule, NgIf, MatErrorComponent, NgFor, ContractsAsideOtherServiceComponent, ContractsAsideOtherProductComponent, NgbTooltipModule, CurrencyPipe]
})
export class ContractsAsideProductServiceEditComponent implements OnInit {
  selectedType = new ContractsFilterType('Subscriptions', 'SERVICE_CONTRACT', 'OTHER');
  selectedCompany: any;
  @ViewChild('endDateDP', { static: true }) endDateDP: DatePickerIntervalsComponent;
  @ViewChild('startDateDP', { static: true }) startDateDP: DatePickerComponent;
  @ViewChild('reviewDateDP', { static: true }) reviewDateDP: DatePickerComponent;
  @Output() onClose = new EventEmitter<any>();
  @Input() contractsOther: ServiceAgreement = new ServiceAgreement();
  @Output() onInitRequestForEdit = new EventEmitter<any>();
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
    private contractsStateService: ContractsStateService,
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
    this.onInitRequestForEdit.emit(true);
    this.contractsService.updateContract(this.contractsOther.getDataForUpdateOtherContract()).subscribe(res => {
      this.contractsStateService.fastEditContract(res);
      this.onClose.emit(null);
    }, err => {
      this.onInitRequestForEdit.emit(false);
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
    this.endDateDP.setEditDate(this.contractsOther.getEndDateByMilliseconds());
    this.contractsOther.calculateEndDate();
    this.contractsOther.calculateReviewDate();
    this.reviewDate = this.contractsOther.getReviewDateByMilliseconds();
    this.reviewDateDP.setEditDate(this.contractsOther.getReviewDateByMilliseconds());
  }
  onChangeEndDate(data) {
    this.contractsOther.setEndDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsOther.calculateReviewDate();
    this.reviewDate = this.contractsOther.getReviewDateByMilliseconds();
    this.reviewDateDP.setEditDate(this.contractsOther.getReviewDateByMilliseconds());
  }
  setTogglePerpetual(data) {
    this.contractsOther.isPerpetual = data;
  }
  onChangeReviewDate(data) {
    this.contractsOther.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onSelectInterval(data) {
    this.selectedInterval = data;
    this.minStartDate = this.getMinStartDate(data, this.contractsOther.startDate);
    this.contractsOther.setIntervalString(data);
    this.contractsOther.calculateEndDate();
    this.endDateDP.setEditDate(this.contractsOther.getEndDateByMilliseconds());
    this.contractsOther.calculateReviewDate();
    this.reviewDate = this.contractsOther.getReviewDateByMilliseconds();
    this.reviewDateDP.setEditDate(this.contractsOther.getReviewDateByMilliseconds());
    this.cd.detectChanges();
  }
  getMinStartDate(interval, startDate) {
    return new Date().getTime();
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
