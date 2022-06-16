import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PaymentsReport } from './class/payments-report';
import * as moment from 'moment';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { ItemStatus } from 'src/app/components/tickets/class/item-status';

@Component({
  selector: 'payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.scss']
})
export class PaymentsReportComponent implements OnInit {

  paymentsReport: PaymentsReport = new PaymentsReport();
  loadingInProgress: boolean = false;
  onInit = false;
  currentCompany: Company;
  techUser: User;
  listTables: Array<TitleListType> = [new TitleListType('Cash', 'CASH'),
  new TitleListType('Cheque', 'CHEQUE'),
  new TitleListType('Credit Card', 'CREDIT_CARD'),
  new TitleListType('Debit', 'DEBIT_CARD'),
  new TitleListType('Wire Transfer', 'WIRE_TRANSFER'),
  new TitleListType('Refunds', 'REFUND_PAYMENT')];
  constructor(public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.currentCompany = this.companiesStateService.getCurrentCompany();
  }
  public onRequest(data) {
    this.loadingInProgress = data;
    this.cd.detectChanges();
  }
  public getReport(data) {
    this.paymentsReport.setData(data);
    this.onInit = true;
  }
  public getDateForHeader(data) {
    return moment(data).format('DD MMM YYYY');
  }
  public getDateForCashe(data) {
    return moment(new Date(data)).format('YYYY/MM/DD');
  }
  public trackByIndex(index, item) {
    return index;
  }
  public getTotal(data) {
    return data.reduce((partialSum, a) => partialSum + a.partialPaidAmount, 0).toFixed(2);
  }
  perseInvoices(items) {
    return items.join(', ');
  }
  ngOnDestroy(): void {

  }

}
