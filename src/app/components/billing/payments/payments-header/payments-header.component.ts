import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments/payments.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AppService } from 'src/app/states/app/app.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { PaymentsStateService } from 'src/app/states/payments/payments-state.service';
import { PaymentsFilterComponent } from './payments-filter/payments-filter.component';

@Component({
  selector: 'app-payments-header',
  templateUrl: './payments-header.component.html',
  styleUrls: ['./payments-header.component.scss']
})
export class PaymentsHeaderComponent implements OnInit {
  @ViewChild('filter', { static: true }) filter: PaymentsFilterComponent;
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Output() onCreatePayment = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  constructor(private permissionsService: PermissionsService,
    public appService: AppService,
    private reportsService: ReportsService,
    private paymentsService: PaymentsService,
    private paymentsStateService: PaymentsStateService,
    public draftEmailStateService: DraftEmailStateService) { }

  ngOnInit() {
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
  sortBy(data) {
    this.onSortBy.emit(data);
  }
  clearAll() {
    this.filter.onClearAll();
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
