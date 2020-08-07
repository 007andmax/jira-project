import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Payment } from './class/payment';
import { PaymentsFilter } from './class/payments-filter';
import { Subscription } from 'rxjs';
import { PaymentsService } from 'src/ng2/app/services/payments/payments.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { PaymentsStateService } from 'src/ng2/app/states/payments/payments-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { PaymentsListService } from './services/payments-list.service';
import { DELETE_PAYMENT } from 'src/ng2/app/const/confirm';
import { Invoice } from '../invoices/class/invoice';
import { InvoicesAsidePreviewComponent } from '../invoices/invoices-aside-preview/invoices-aside-preview.component';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  providers: [PaymentsListService]
})
export class PaymentsComponent implements OnInit {

  paymentsFilter: PaymentsFilter = new PaymentsFilter();
  payments: Array<Payment> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  selectedCompanyId: string = null;
  public sort: string = '';
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  showCreatePayment: boolean = false;
  showDetailsPayment: boolean = false;
  showRefundPayment: boolean = false;
  showEditPayment:boolean = false;
  offset: number = 20;
  public direction: string = 'ASC';
  detailsPayment: Payment;
  refundPayment: Payment;
  previewInvoiceId: string;
  showPreviewInvoice: boolean = false;
  selectedPayments: Array<Payment> = [];
  @ViewChild('previewInvoiceAside') previewInvoiceAside: InvoicesAsidePreviewComponent;
  sub: Subscription = new Subscription();
  constructor(private paymentsService: PaymentsService,
    public cd: ChangeDetectorRef,
    //private invoiceRealTimeService: InvoiceRealTimeService,
    private companiesStateService: CompaniesStateService,
    private paymentsStateService: PaymentsStateService,
    private confirmStateService: ConfirmStateService,
    private paymentsListService: PaymentsListService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.companiesStateService.getCompanies().length > 0) this.onScroll();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.onScroll();
    })
    this.sub.add(getOnCompanies);

    let getOnInitFilter = this.paymentsStateService.getOnInitFilter().subscribe(data => {
      this.selectedPayments = [];
      this.selectedCompanyId = null;
      this.paymentsFilter = data;
      this.showPreloader = true;
      window.scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_PAYMENT) {
          this.onRemovePayment(this.paymentsStateService.getPaymentForRemove());
        }
        /* if (this.confirmStateService.getConfirmAction() === ROLLBACK_INVOICE) {
           this.onRollbackInvoice(this.invoiceStateService.getInvoiceForRollback());
         }
         if (this.confirmStateService.getConfirmAction() === REFUND_PAYMENTS) {
           this.onRollbackInvoice(this.invoiceStateService.getInvoiceForRefund());
         }*/
      }
    })
    this.sub.add(getConfirm);

    /*   let changeInvoice = this.invoiceRealTimeService.changeInvoice.subscribe(data => {
         if (data.action === 'INVOICE_SAVED') {
           let index = this.invoices.findIndex(item => item.id === data.data.id);
           let invoice = new Invoice(data.data);
           if (index > -1) {
             this.invoices[index] = invoice;
           } else {
             this.invoices.unshift(invoice);
           }
         }
         if (data.action === 'INVOICE_STATUS' || data.action === 'INVOICE_ROLLBACK') {
           let index = this.invoices.findIndex(item => item.id === data.data.id);
           let invoice = new Invoice(data.data);
           if (index > -1) this.invoices[index] = invoice;
         }
         if (data.action === 'PAYMENT_RECEIVED') {
           data.data.forEach(element => {
             let index = this.invoices.findIndex(item => item.id === element.id);
             let invoice = new Invoice(element);
             invoice.sum = invoice.totalSum;
             if (index > -1) this.invoices[index] = invoice;
           });
         }
         if (data.action === 'INVOICE_DELETED') {
           let index = this.invoices.findIndex(item => item.id === data.data.id);
           if (index > -1) this.invoices.splice(index, 1);
         }
       })
       this.sub.add(changeInvoice);*/
  }
  /* getTotal() {
     let total = 0;
     this.invoices.forEach(item => {
       total += item.sum;
     })
     return total;
   }*/
  /* onCreatePayment() {
     this.selectedInvoices = [];
     if (this.selectedCompanyId) {
       this.invoices.forEach(item => {
         if (item.selected) this.selectedInvoices.push(item);
       })
     }
     this.showCreateInvoice = true;
 
   }*/
  /* onCloseCreatePayment() {
     this.showCreateInvoice = false;
     this.selectedCompanyId = null;
     this.invoices.forEach(item => {
       item.selected = false;
       item.blockSelected = false;
     })
   }*/
  /*  onPreviewInvoice(data) {
      this.previewInvoice = data;
      if (this.showPreviewInvoice) {
        this.cd.detectChanges();
        this.previewInvoiceAside.onGetInvoice();
      }
      this.showPreviewInvoice = true;
    }
    onRollbackInvoice(invoice) {
      this.invoicesService.rollback(invoice.id).subscribe(data => {
  
      })
    }*/
  onPreviewInvoice(data) {
    this.previewInvoiceId = data;
    if (this.showPreviewInvoice) {
      this.cd.detectChanges();
      this.previewInvoiceAside.onGetInvoice();
    }
    this.showPreviewInvoice = true;
  }
  onRefundPayment(data) {
    this.refundPayment = data;
    this.showRefundPayment = true;
  }
  onDetailsPayment(data) {
    this.detailsPayment = data;
    this.showDetailsPayment = true;

  }
  onRemovePayment(payment) {
    this.paymentsService.deletePayment(payment).subscribe(data => {

    })
  }
  public sortBy(sort) {
    this.showPreloader = true;
    this.selectedPayments = [];
    this.selectedCompanyId = null;
    this.direction = this.paymentsListService.getDirection(this.direction, this.sort, sort);
    this.sort = sort;
    this.paymentsFilter.setSortBy(`${this.sort}_${this.direction}`);
    this.setDefaultScoll();
    window.scrollTo(0, 0);
    this.onScroll();
  }
  /* onSelectInvoice() {
     let find = this.invoices.find(item => item.selected);
     if (find) {
       this.selectedCompanyId = find.companyId;
       this.invoices.forEach(item => {
         if (item.companyId !== this.selectedCompanyId) item.blockSelected = true;
         if (item.companyId === this.selectedCompanyId) item.blockSelected = false;
       })
     } else {
       this.selectedCompanyId = null;
       this.invoices.forEach(item => {
         item.blockSelected = false
       })
     }
     this.cd.detectChanges();
   }*/
  /* onRemoveInvoice(invoice) {
     this.invoicesService.remove(invoice.id).subscribe(data => {
       this.showPreviewInvoice = false;
     })
   }*/
  getInvoices() {
    if (this.paymentsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.paymentsFilter.setOffset(this.page_number * this.offset);
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.paymentsService.getPayments(this.paymentsFilter.getFIlter()).subscribe((data: any) => {
      this.payments = [...this.payments, ...data];
      /* if (this.selectedCompanyId) this.payments.forEach(item => {
         if (item.companyId !== this.selectedCompanyId) item.blockSelected = true;
         if (item.companyId === this.selectedCompanyId) item.blockSelected = false;
       })*/
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.paymentsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.paymentsListService.setBlockList(false);
    this.payments = [];
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getInvoices();

  }


}
