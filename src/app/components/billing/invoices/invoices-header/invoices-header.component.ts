
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AppService } from 'src/app/states/app/app.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { InvoicesFilterComponent } from './invoices-filter/invoices-filter.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { InvoiceExportComponent } from './invoice-export/invoice-export.component';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  standalone: true,
  imports: [InvoiceExportComponent, CommonModule, InvoicesFilterComponent],
  selector: 'app-invoices-header',
  templateUrl: './invoices-header.component.html',
  styleUrls: ['./invoices-header.component.scss'],

})
export class InvoicesHeaderComponent implements OnInit {
  @ViewChild('filter', { static: true }) filter: InvoicesFilterComponent;
  countFilter: number = 0;
  toggleFilter: boolean = false;
  @Output() onCreateInvoice = new EventEmitter<any>();
  @Output() onSortBy = new EventEmitter<any>();
  sortBy: TicketSortBy = new TicketSortBy('INVOICE_NUMBER', 'DESC');
  constructor(public appService: AppService,
    private invoicesService: InvoicesService,
    private reportsService: ReportsService,
    public draftEmailStateService: DraftEmailStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private invoiceStateService: InvoiceStateService) { }

  ngOnInit() {
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
  sortList(data) {
    this.sortBy.sortBy = data;
    this.onSortBy.emit(data);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  onShowCreateInvoice() {
    this.onCreateInvoice.emit(null);
  }
}
