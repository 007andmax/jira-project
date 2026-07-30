import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AppService } from 'src/app/states/app/app.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { InvoicesFilterComponent } from './invoices-filter/invoices-filter.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';
import { InvoicesFilter } from '../class/invoices-filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoices-header',
  templateUrl: './invoices-header.component.html',
  styleUrls: ['./invoices-header.component.scss']
})
export class InvoicesHeaderComponent implements OnInit, OnDestroy {
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Output() onCreateInvoice = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  sub: Subscription = new Subscription();
  constructor(public appService: AppService,
    private invoicesService: InvoicesService,
    private reportsService: ReportsService,
    public draftEmailStateService: DraftEmailStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private invoiceStateService: InvoiceStateService) { }


  ngOnInit() {
    let onCloseFitler = this.invoiceStateService.onToggleFitler.subscribe(res => {
      this.toggleFilter = res;
    })
    this.sub.add(onCloseFitler);
    let getFilter = this.invoiceStateService.getOnInitFilter().subscribe(data => {
      this.invoicesFilter = data;
      this.onChangeCounterFilter();
    })
    this.sub.add(getFilter);
  }
  public onChangeCounterFilter() {
    this.countFilter = 0;
    if (this.invoicesFilter.companyIds.length > 0) this.countFilter++;
    if (this.invoicesFilter.endDate && this.invoicesFilter.startDate) this.countFilter++;
    if (this.invoicesFilter.invoiceNumber) this.countFilter++;
    if (this.invoicesFilter.status) this.countFilter++;
    if (this.invoicesFilter.amount) this.countFilter++;

  }
  clearAll() {
    this.invoiceStateService.onClearFitler.emit(null);
  }
  export(type) {
    return new Promise((resolve, reject) => {
      let invoices = this.invoiceStateService.getInvoices().map(item => item.getDataForExportPDF());
      this.invoicesService.export(type, { invoiceViewDtos: invoices }).subscribe((data: any) => {
        resolve(data.url);
      })
    });
  }
  print(type) {
    this.export(type).then((data: any) => {
      window.open(data);
    })
  }
  public onToggleFilters(data) {
    this.toggleFilter = data;
    this.invoiceStateService.onToggleFitler.emit(data);
  }
  onSelectExport(type) {
    if (type == "PDF") this.export(type.toLowerCase()).then((data: any) => {
      this.appService.downloadByUrl(`${data}?isDownload=true`, 'report-invoice.' + type);
    })
    if (type == "CSV") {
      let invoices = this.invoiceStateService.getInvoices().map(item => item.getDataForExportPDF());
      this.reportsService.getCSV(`reports/invoice/csv`, { invoiceViewDtos: invoices }).subscribe((resp: any) => {
        var blob = new Blob([resp]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        link.download = 'report-invoice.csv';
        link.click();
        window.URL.revokeObjectURL(link.href);
      })
    }
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  sendEmail() {
    this.draftEmailStateService.toogleAsideAddReportInvoice();
  }

  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreateInvoice() {
    this.onCreateInvoice.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
