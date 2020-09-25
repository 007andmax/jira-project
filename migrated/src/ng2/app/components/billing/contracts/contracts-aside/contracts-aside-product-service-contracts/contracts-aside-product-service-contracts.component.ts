import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePickerComponent } from 'src/ng2/app/components/shared/date-picker/date-picker.component';
import { FORMAT_DATE_2 } from 'src/ng2/app/const/date-picker';
import { Tax } from 'src/ng2/class/taxes/tax';
import { InvoiceFormTicketEditTaxesComponent } from '../../../billable/billable-aside/invoice-form/invoice-form-ticket-edit/invoice-form-ticket-edit-taxes/invoice-form-ticket-edit-taxes.component';
import { ContractsFilterType } from '../../class/contracts-filter-type';
import { ContractsOther } from '../class/contracts-other';
import { ContractsUserDeviceValidate } from '../class/contracts-user-device-validate';
import { ContractsAsideTopComponent } from '../contracts-aside-top/contracts-aside-top.component';

@Component({
  selector: 'app-contracts-aside-product-service-contracts',
  templateUrl: './contracts-aside-product-service-contracts.component.html',
  styleUrls: ['./contracts-aside-product-service-contracts.component.scss']
})
export class ContractsAsideProductServiceContractsComponent implements OnInit {
  selectedType = new ContractsFilterType('Service Contract/by other', 'SERVICE_CONTRACT', 'OTHER');
  @ViewChild('taxes') taxesDP: InvoiceFormTicketEditTaxesComponent;
  @ViewChild('startDateDP') startDateDP: DatePickerComponent;
  @ViewChild('reviewDateDP') reviewDateDP: DatePickerComponent;
  @ViewChild('topContract') topContract: ContractsAsideTopComponent;

  @Output() onClose = new EventEmitter<any>();
   contractsUserDevice: ContractsOther = new ContractsOther();
  formatDate: string = FORMAT_DATE_2;
  startDate = new Date().getTime();
  reviewDate = new Date().getTime();
  validate: ContractsUserDeviceValidate = new ContractsUserDeviceValidate();
  intervals: Array<string> = ['YEARLY', 'MONTHLY', '30 days', '15 days', '7 days'];
  selectedInterval: string = 'MONTHLY';
  minStartDate: number = null;
  taxes: Array<Tax> = [];
  toggleMaximumAmountHours: boolean = false;
  toggleContractServices: boolean = false;
  defaultSelectedTax: Array<Tax> = [];
  sub: Subscription = new Subscription();
  constructor() { }

  ngOnInit() {
  }

}
