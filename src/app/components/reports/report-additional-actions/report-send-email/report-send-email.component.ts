import { Component, Input } from '@angular/core';
import { DraftEmail } from '../../../shared/draft-email/class/draft-email';
import { FilesInfo } from '../../../shared/draft-email/class/files-Info';
import { ReportEmail } from '../../class/report-email';
import { forkJoin, Subscription } from 'rxjs';
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
  sub: Subscription = new Subscription();

  ngOnInit() {
    let showAsideSendReport = this.draftEmailStateService.showAsideSendReport.subscribe((data) => {
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
    this.sub.add(showAsideSendReport);
    let showAsideSendReportInvoice = this.draftEmailStateService.showAsideSendReportInvoice.subscribe(data => {
      this.opened = true;
      this.draftReport = new ReportEmail();
      this.type = TYPE_REPORT_INVOICE;
    })
    this.sub.add(showAsideSendReportInvoice);
    let showAsideSendReportPayment = this.draftEmailStateService.showAsideSendReportPayment.subscribe(data => {
      this.opened = true;
      this.draftReport = new ReportEmail();
      this.type = TYPE_REPORT_PAYMENT;
    })
    this.sub.add(showAsideSendReportPayment);
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
  close() {
    if (this.draftEmail.attachments.length > 0) {
      forkJoin(
        this.draftEmail.attachments.map(item => this.draftEmailService.removeAttachment(item))
      ).subscribe(result => {

      });
    }
    this.opened = false;
    this.draftEmail = new DraftEmail();
    this.tab = 'plain';
    this.messageContent = '';
    this.messageHTML = '';
    this.draftEmailStateService.onClear();
    this.uploadFiles = [];
    this.filesInfo = new FilesInfo();
    this.action = null;
    this.validateReport = new ReportSendEmailValidate();
    this.sub.unsubscribe();
  }
  ngOnDestroy(): void {
    this.validateReport = new ReportSendEmailValidate();
  }
  trackByIndex(index, item) {
    return index;
  }

}



