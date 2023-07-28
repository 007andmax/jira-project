import { Component, OnInit, ElementRef, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { DraftEmail } from '../../../shared/draft-email/class/draft-email';
import { FilesInfo } from '../../../shared/draft-email/class/files-Info';
import { User } from '../../../users/class/user';
import { Company } from 'src/app/interfaces/company/company';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { DraftEmailService } from 'src/app/services/draft-email/draft-email.service';
import { FilesInfoItem } from '../../../shared/draft-email/class/files-Info-item';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ReportEmail } from '../../class/report-email';
import { ReportsStateService } from 'src/app/states/reports/reports-state.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { forkJoin } from 'rxjs';
import { DraftEmailComponent } from 'src/app/components/shared/draft-email/draft-email.component';
import { ReportSendEmailValidate } from './class/report-send-email-validate';
import { TYPE_REPORT_INVOICE, TYPE_REPORT_PAYMENT, TYPE_REPORT_PRODUCTS } from 'src/app/const/reports';

@Component({
  selector: 'app-report-send-email',
  templateUrl: './report-send-email.component.html',
  styleUrls: ['./report-send-email.component.scss']
})
export class ReportSendEmailComponent extends DraftEmailComponent {
  draftReport: ReportEmail = new ReportEmail();
  validateReport: ReportSendEmailValidate = new ReportSendEmailValidate();
  type: string;
  @Input() report: string = "";
  @Input() fileName: string = "";
  @Input() template: string = "PDF_TEMPLATE";
  @Input() orientation;
  @Input() selectedClient = null;
  @Input() accountType = 'CLIENT';


  ngOnInit() {
    this.draftEmailStateService.showAsideSendReport.subscribe((data) => {
      this.usersSelected = this.draftEmailStateService.getSelectedUsers();
      this.companiesSelected = this.draftEmailStateService.getSelectedCompanies();
      this.action = this.draftEmailStateService.getAction();

      this.selectedClient = data.selectedClient;
      this.orientation = data.orientation;
      this.report = data.report;
      this.template = data.template;
      this.fileName = data.fileName;
      this.accountType = data.accountType;


      this.opened = true;
      this.draftReport = new ReportEmail();
      this.type = TYPE_REPORT_PRODUCTS;
    })
    this.draftEmailStateService.showAsideSendReportInvoice.subscribe(data => {
      this.opened = true;
      this.draftReport = new ReportEmail();
      this.type = TYPE_REPORT_INVOICE;
    })
    this.draftEmailStateService.showAsideSendReportPayment.subscribe(data => {
      this.opened = true;
      this.draftReport = new ReportEmail();
      this.type = TYPE_REPORT_PAYMENT;
    })
  }

  onChangeCompanyEmails(data) {
    this.draftReport.setEmails(data);
    this.validateReport.resetEmail();
  }

  onSend() {
    if (!this.validateReport.isValidate(this.draftReport)) return;

    this.addBtn.setDisabled(true);
    if (this.type == TYPE_REPORT_PRODUCTS) this.productsReport();
    if (this.type == TYPE_REPORT_INVOICE) this.invoiceReport();
    if (this.type == TYPE_REPORT_PAYMENT) this.paymentReport();

  }
  paymentReport() {
    this.draftReport.setNote(this.messageContent);
    this.draftReport.setFileName("payment_report");
    let payments = this.paymentsStateService.getPayments().map(item => item.getDataForExportPDF());
    this.draftEmailService.sendMessage(this.draftReport.getDataForPaymentReport(payments)).subscribe((data) => {
      this.addBtn.setDisabled(false);
      this.close();
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  invoiceReport() {
    this.draftReport.setNote(this.messageContent);
    this.draftReport.setFileName("invoice_report");
    let invoices = this.invoiceStateService.getInvoices().map(item => item.getDataForExportPDF());
    this.draftEmailService.sendMessage(this.draftReport.getDataForInvoiceReport(invoices)).subscribe((data) => {
      this.addBtn.setDisabled(false);
      this.close();
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  productsReport() {
    this.draftReport.setContent(this.reportsStateService.parseReportContent(this.report));
    this.draftReport.setNote(this.messageContent);
    this.draftReport.setOrientation(this.orientation);
    this.draftReport.setFileName(this.fileName);
    if (this.template === "PDF_TEMPLATE") {
      this.reportsService.sendMessage(this.draftReport).subscribe((data) => {
        this.addBtn.setDisabled(false);
        this.close();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, err => {
        this.addBtn.setDisabled(false);
      })
    } else {
      this.reportsService.sendCustomerMessage(this.draftReport).subscribe((data) => {
        this.addBtn.setDisabled(false);
        this.close();
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, err => {
        this.addBtn.setDisabled(false);
      })
    }
  }

  trackByIndex(index, item) {
    return index;
  }

}



