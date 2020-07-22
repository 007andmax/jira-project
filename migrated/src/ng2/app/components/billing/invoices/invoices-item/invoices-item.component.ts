import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from "moment";
import { Invoice } from '../class/invoice';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { ARCHIVE_COMPANY, DELETE_INVOICE } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { InvoiceStateService } from 'src/ng2/app/states/invoice/invoice-state.service';
import { AppService } from 'src/ng2/app/states/app/app.service';
@Component({
  selector: 'app-invoices-item',
  templateUrl: './invoices-item.component.html',
  styleUrls: ['./invoices-item.component.scss']
})
export class InvoicesItemComponent implements OnInit {
  @Input() invoice: Invoice;
  company: any;
  @Output() onPreviewInvoice = new EventEmitter<any>();
  constructor(private companiesStateService: CompaniesStateService,
    private modalService: NgbModal,
    private invoiceStateService: InvoiceStateService,
    private confirmStateService: ConfirmStateService,
    private appService: AppService,
    private invoicesService: InvoicesService) { }

  ngOnInit() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.invoice.companyId);
  }
  getDate(date) {
    return (date) ? moment(date).format('DD MMM YYYY') : '';
  }
  getDueDate() {
    var dueDate = new Date(this.invoice.dueDate).getTime();
    var today = Date.now();
    let overDue = (dueDate - today) / 86400000;
    let outstanding = (new Date(this.invoice.date).getTime() - today) / 86400000;
    let isOverDue = (overDue < 0);
    let isOutstanding = (overDue > 0);
    if (isOverDue) {
      //   $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(overDue))) + 1000000000;
      // $scope.invoice.dueDatePositionForSorting = 0;
      return Math.abs(Math.floor(overDue));
    } else if (isOutstanding) {
      //    $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(outstanding))) + 2000000000;
      //  $scope.invoice.dueDatePositionForSorting = 1;
      return Math.abs(Math.floor(outstanding));
    }

  };
  getPaidOnDate() {
    var today = Date.now();
    var paidOn = new Date(this.invoice.paidOn).getTime();
    var paid = (today - paidOn) / 86400000;
    // $scope.invoice.daysDueDateForSorting = (Math.abs(Math.floor(paid))) + 3000000000 ;
    //  $scope.invoice.dueDatePositionForSorting = 2;
    return Math.floor(Math.abs(paid));
  };
  deleteInvoice() {
    this.confirmStateService.setConfirmAction(DELETE_INVOICE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete invoice #${this.invoice.number} ?`;
    this.invoiceStateService.setInvoiceForemove(this.invoice);
  }
  resendInvoices() {
    this.invoicesService.resendInvoices([this.invoice.id]).subscribe(data => {

    })
  }
  markAsRead() {
    this.invoicesService.markAsRead(this.invoice.id).subscribe(data => {

    })
  }
  onShowPreviewInvoice() {
    this.onPreviewInvoice.emit(null);
  }
  exportAsPDF() {
    let company = this.companiesStateService.getCompanies().find(item => item.id === this.invoice.companyId);
    this.appService.downloadByUrl(`/invoice/show/${this.invoice.id}/pdf`, `${company.name}-${this.invoice.number}.pdf`);
  }
}
