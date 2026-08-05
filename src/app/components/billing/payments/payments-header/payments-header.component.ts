import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AppService } from 'src/app/states/app/app.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import { PaymentsFilterComponent } from './payments-filter/payments-filter.component';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';
import { PaymentsFilter } from '../class/payments-filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payments-header',
  templateUrl: './payments-header.component.html',
  styleUrls: ['./payments-header.component.scss']
})
export class PaymentsHeaderComponent implements OnInit, OnDestroy {
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Output() onCreatePayment = new EventEmitter<any>();
  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  sub: Subscription = new Subscription();
  constructor(private permissionsService: PermissionsService,
    public appService: AppService,
    private reportsService: ReportsService,
    private paymentsService: PaymentsService,
    private paymentsStateService: PaymentsStateService,
    public draftEmailStateService: DraftEmailStateService) { }


  ngOnInit() {
    let onCloseFitler = this.paymentsStateService.onToggleFitler.subscribe(res => {
      this.toggleFilter = res;
    })
    this.sub.add(onCloseFitler);
    let getFilter = this.paymentsStateService.filter.subscribe(data => {
      this.paymentsFilter = data;
      this.onChangeCounterFilter();
    })
    this.sub.add(getFilter);
  }
  public onChangeCounterFilter() {
    this.countFilter = 0;
    if (this.paymentsFilter.companyId) this.countFilter++;
    if (this.paymentsFilter.endDate && this.paymentsFilter.startDate) this.countFilter++;
    if (this.paymentsFilter.invoiceNumber) this.countFilter++;
    if (this.paymentsFilter.paymentStatus) this.countFilter++;
    if (this.paymentsFilter.paymentMethod) this.countFilter++;
    if (this.paymentsFilter.amount) this.countFilter++;
  }
  clearAll() {
    this.paymentsStateService.onClearFitler.emit(null);
  }
  export(type) {
    return new Promise((resolve, reject) => {
      let invoices = this.paymentsStateService.getPayments().map(item => item.getDataForExportPDF());
      this.paymentsService.export(type, { paymentViewDtos: invoices }).subscribe((data: any) => {
        resolve(data.url);
      })
    });
  }
  print(type) {
    this.export(type).then((data: any) => {
      window.open(data);
    })
  }
  onSelectExport(type) {
    if (type == "PDF") this.export(type.toLowerCase()).then((data: any) => {
      this.appService.downloadByUrl(`${data}?isDownload=true`, 'report-invoice.' + type);
    })
    if (type == "CSV") {
      let invoices = this.paymentsStateService.getPayments().map(item => item.getDataForExportPDF());
      this.reportsService.getCSV(`reports/payment/csv`, { paymentViewDtos: invoices }).subscribe((resp: any) => {
        var blob = new Blob([resp]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        link.download = 'report-payments.csv';
        link.click();
        window.URL.revokeObjectURL(link.href);
      })
    }
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  sendEmail() {
    this.draftEmailStateService.toogleAsideSendReportPayment();
  }
  public onToggleFilters(data) {
    this.toggleFilter = data;
    this.paymentsStateService.onToggleFitler.emit(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreatePayment() {
    this.onCreatePayment.emit(null);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
