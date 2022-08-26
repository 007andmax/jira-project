import { Component, OnInit } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AppService } from 'src/app/states/app/app.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'invoice-export',
  templateUrl: './invoice-export.component.html',
  styleUrls: ['./invoice-export.component.scss']
})
export class InvoiceExportComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  listExport = ['PDF', 'CSV'];
  constructor(private invoicesService: InvoicesService,
    private appService: AppService,
    private reportsService: ReportsService,
    public draftEmailStateService: DraftEmailStateService,
    private invoiceStateService: InvoiceStateService,) { }

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
    console.log("type", type);
    this.export(type).then((data: any) => {
      console.log("data", data);
      window.open(data);
    })
  }
  sendEmail() {
    this.draftEmailStateService.toogleAsideAddReportInvoice();
  }
  onSelectExport(type) {
    if (type == "PDF") this.export(type.toLowerCase()).then((data: any) => {
      console.log("data", data);
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
}
