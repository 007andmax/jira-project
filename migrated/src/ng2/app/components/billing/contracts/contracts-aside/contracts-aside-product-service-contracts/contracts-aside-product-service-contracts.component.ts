import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DatePickerComponent } from 'src/ng2/app/components/shared/date-picker/date-picker.component';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { ContractsService } from 'src/ng2/app/services/contracts/contracts.service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ContractsStateService } from 'src/ng2/app/states/contracts/contracts-state.service';
import { TaxesStateService } from 'src/ng2/app/states/taxes/taxes-state.service';
import { Tax } from 'src/ng2/class/taxes/tax';
import { InvoiceFormTicketEditTaxesComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ContractsBlockTimeValidate } from '../class/contracts-block-time-validate';
import { ContractsOther } from '../class/contracts-other';
import { ContractsOtherProduct } from '../class/contracts-other-product';
import { ContractsOtherService } from '../class/contracts-other-service';
import * as moment from "moment";
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';
import { ContractsOtherValidate } from '../class/contracts-other-validate';
import { ContractsConfirmComponent } from '../../contracts-confirm/contracts-confirm.component';
import { ProductService } from 'src/ng2/app/services/product/product.service';
import { InventoryItem } from 'src/ng2/app/components/inventory/class/inventory-item';
import { ContractsListService } from '../../services/contracts-list.service';

@Component({
  selector: 'app-contracts-aside-product-service-contracts',
  templateUrl: './contracts-aside-product-service-contracts.component.html',
  styleUrls: ['./contracts-aside-product-service-contracts.component.scss'],
  providers: [ContractsListService]
})
export class ContractsAsideProductServiceContractsComponent implements OnInit, OnDestroy {
  selectedType = new ContractsFilterType('Service Contract/by other', 'SERVICE_CONTRACT', 'OTHER');

  @ViewChild('startDateDP') startDateDP: DatePickerComponent;
  @ViewChild('reviewDateDP') reviewDateDP: DatePickerComponent;
  @ViewChild('topContract') topContract: ContractsAsideTopComponent;

  @Output() onClose = new EventEmitter<any>();
  contractsOther: ContractsOther = new ContractsOther();
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  reviewDate = new Date().getTime();
  validate: ContractsOtherValidate = new ContractsOtherValidate();
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  minStartDate: number = null;
  toggleMaximumAmountHours: boolean = false;
  toggleContractServices: boolean = false;

  type: string = "PRODUCTS";
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private taxesStateService: TaxesStateService,
    private defaultServicesService: DefaultServicesService,
    private contractsService: ContractsService,
    private modalService: NgbModal,
    private сontractsStateService: ContractsStateService,
    private contractsListService: ContractsListService,
    public cd: ChangeDetectorRef) { }


  ngOnInit() {
    let today = new Date();
    today.setMonth(today.getMonth() + 1);
    this.contractsOther.setStartDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.contractsOther.setReviewDate(today.getDate(), today.getMonth(), today.getFullYear(), this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);

    this.minStartDate = this.getMinStartDate('MONTHLY', this.contractsOther.startDate);
    let getConfirm = this.сontractsStateService.getConfirm().subscribe(data => {
      console.log("data", data);
      this.onCheckServicesForAdd(data);
    })
    this.sub.add(getConfirm);

    if (this.сontractsStateService.getContractForCopy()) this.onInitCopy();
  }
  onInitCopy() {
    this.contractsOther.setDataFromCopy(this.сontractsStateService.getContractForCopy());
    this.selectedInterval = this.contractsOther.intervalstring;

    this.startDate = this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.startDateDP.minDate = this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds();
    this.reviewDate = this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.reviewDateDP.minDate = this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds();
    this.startDateDP.setEditDate(this.сontractsStateService.getContractForCopy().getStartDateByMilliseconds());
    this.reviewDateDP.setEditDate(this.сontractsStateService.getContractForCopy().getReviewDateByMilliseconds());
    this.topContract.companiesDP.selectedItem = this.companiesStateService.getCompanies().find(item => item.id === this.contractsOther.companyId);



  }
  onCheckServicesForAdd(createBillableItem) {


    this.contractsService.createContract(createBillableItem, this.contractsOther.getDataForCreateOther()).subscribe(res => {
      this.onClose.emit(null);
    })
  }
  addService() {
    this.contractsOther.serviceExpenses.push(new ContractsOtherService(new Date().getTime(), "", 0, "", null));
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
  }
  onChangeReviewDate(data) {
    this.contractsOther.setReviewDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
  }
  onSelectInterval(data) {
    this.selectedInterval = data;
    this.minStartDate = this.getMinStartDate(data, this.contractsOther.startDate);
    console.log("this.minStartDate", this.minStartDate);
    this.contractsOther.setInterval(data);
    this.contractsOther.calculateEndDate();
    this.cd.detectChanges();
    console.log("this.contractsOther.includedHours", this.contractsOther);
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
  public onCreate() {
    let checkProductExpenses = this.contractsOther.checkProductExpenses();
    let checkServiceExpenses = this.contractsOther.checkServiceExpenses();
    let isValidate = this.validate.isValidate(this.contractsOther);
    if (!checkProductExpenses || !checkServiceExpenses || !isValidate) {
      this.cd.detectChanges();
      return;
    }
    if (this.contractsListService.compareDateNowWithDate(this.contractsOther.startDate)) {
      const modalRef = this.modalService.open(ContractsConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: false });
      modalRef.componentInstance.message = `Do we need to create the billable item now?`;
      console.log("modalRef", modalRef);
    } else {
      this.onCheckServicesForAdd(false);
    }

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
