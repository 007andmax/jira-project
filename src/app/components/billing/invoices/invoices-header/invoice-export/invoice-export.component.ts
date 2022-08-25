import { Component, OnInit } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';

@Component({
  selector: 'invoice-export',
  templateUrl: './invoice-export.component.html',
  styleUrls: ['./invoice-export.component.scss']
})
export class InvoiceExportComponent implements OnInit {
  listExport = ['PDF', 'CSV'];
  constructor(private invoicesService: InvoicesService,
    private invoiceStateService: InvoiceStateService,) { }

  ngOnInit() {
  }
  printPdf() {
    let invoices = this.invoiceStateService.getInvoices().map(item => item.getDataForExportPDF());
    this.invoicesService.exportPdf({ invoiceViewDtos: invoices }).subscribe((data: any) => {
      console.log("data", data);
      window.open(data.url);
    })
  }
}
