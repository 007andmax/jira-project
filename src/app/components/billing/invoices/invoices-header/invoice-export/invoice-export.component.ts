import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AppService } from 'src/app/states/app/app.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'invoice-export',
  templateUrl: './invoice-export.component.html',
  styleUrls: ['./invoice-export.component.scss']
})
export class InvoiceExportComponent implements OnInit {
  listExport = ['PDF', 'CSV'];
  @Output() onPrint = new EventEmitter();
  @Output() onEmail = new EventEmitter();
  @Output() onExport = new EventEmitter();
  constructor(
    public draftEmailStateService: DraftEmailStateService,
    public customerPortalStateService: CustomerPortalStateService,) { }

  ngOnInit() {
  }
  print(type) {
    this.onPrint.emit(type);
  }
  sendEmail() {
    this.onEmail.emit(null);
  }
  onSelectExport(type) {
    this.onExport.emit(type);
  }
}
