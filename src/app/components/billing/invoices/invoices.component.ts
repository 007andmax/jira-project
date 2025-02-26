import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices/invoices.service';
import { InvoicesFilter } from './class/invoices-filter';
import { InvoicesListService } from './services/invoices-list.service';
import { Invoice } from './class/invoice';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ROLLBACK_INVOICE, REFUND_PAYMENTS } from 'src/app/const/confirm';
import { InvoiceRealTimeService } from 'src/app/states/invoice/invoice-real-time.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { ToastrProgressStateService } from 'src/app/states/toastr-progress/toastr-progress-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { fadeInAnimation } from 'src/app/animations';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  providers: [InvoicesListService]
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  invoices: Array<Invoice> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  selectedCompanyIds: Array<string> = [];
  public sort: string = '';
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  offset: number = 40;
  public direction: string = 'ASC';
  selectedInvoices: Array<Invoice> = [];
  sub: Subscription = new Subscription();
  container = document.body.querySelector(".main-container");
  constructor(private invoicesService: InvoicesService,
    public cd: ChangeDetectorRef,
    private invoiceRealTimeService: InvoiceRealTimeService,
    private companiesStateService: CompaniesStateService,
    private invoiceStateService: InvoiceStateService,
    private confirmStateService: ConfirmStateService,
    private leftPanelStateService: LeftPanelStateService,
    private toastrProgressStateService: ToastrProgressStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private websocketService: WebsocketService,
    private invoicesListService: InvoicesListService) { }

  ngOnInit() {
    this.leftPanelStateService.setBillingPage('new-billable-invoices');
    document.body.querySelector(".main-container").scrollTo(0, 0);
    if (this.companiesStateService.getCompanies().length > 0) this.onScroll();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.onScroll();
    })
    this.sub.add(getOnCompanies);
    let getOnInitFilter = this.invoiceStateService.getOnInitFilter().subscribe(data => {
      this.invoicesFilter.onInitLeftOffset(false);
      this.invoicesFilter.resetLeftOffset();
      this.selectedInvoices = [];
      this.selectedCompanyIds = [];
      this.invoicesFilter = data;
      this.invoicesFilter.resetSortBy();
      this.showPreloader = true;
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ROLLBACK_INVOICE) {
          this.onRollbackInvoice(this.invoiceStateService.getInvoiceForRollback());
        }
        if (this.confirmStateService.getConfirmAction() === REFUND_PAYMENTS) {
          this.onRollbackInvoice(this.invoiceStateService.getInvoiceForRefund());
        }
      }
    })
    this.sub.add(getConfirm);
    let changeInvoice = this.invoiceRealTimeService.changeInvoice.subscribe(data => {
      if (data.action === 'INVOICE_SAVED') {
        let index = this.invoices.findIndex(item => item.id === data.data.id);
        let invoice = new Invoice(data.data);
        if (index > -1) {
          this.invoices[index] = invoice;
        } else {
          if (this.invoicesFilter.checkAddInvoice(invoice, this.companiesStateService.getCompanies())) this.invoices.unshift(invoice);
        }
      }
      if (data.action === 'INVOICE_STATUS' || data.action === 'INVOICE_ROLLBACK') {
        let index = this.invoices.findIndex(item => item.id === data.data.id);
        let invoice = new Invoice(data.data);
        if (index > -1) this.invoices[index] = invoice;
        if (data.action === 'INVOICE_ROLLBACK' && this.invoicesFilter.status !== '' && index > -1) {
          this.invoicesFilter.onInitLeftOffset(true);
          this.invoicesFilter.updateLeftOffset();
        }
      }
      if (data.action === 'PAYMENT_RECEIVED') {
        data.data.forEach(element => {
          let index = this.invoices.findIndex(item => item.id === element.id);
          let invoice = new Invoice(element);
          invoice.sum = invoice.totalSum;
          if (index > -1) this.invoices[index] = invoice;
          if (this.invoicesFilter.status !== '' && index > -1) {
            this.invoicesFilter.onInitLeftOffset(true);
            this.invoicesFilter.updateLeftOffset();
          }
        });
      }
      if (data.action === 'INVOICE_DELETED') {
        let index = this.invoices.findIndex(item => item.id === data.data.id);
        if (index > -1) {
          this.invoices.splice(index, 1);
          this.invoicesFilter.onInitLeftOffset(true);
          this.invoicesFilter.updateLeftOffset();
        }
      }
      this.invoiceStateService.setInvoices(this.invoices);
      this.cd.detectChanges();
    })
    this.sub.add(changeInvoice);
    let getClosedAside = this.invoiceStateService.getClosedAside().subscribe(data => {
      this.selectedCompanyIds = [];
      this.invoices.forEach(item => {
        item.selected = false;
      })
    })
    this.sub.add(getClosedAside);
  }
  getTotal() {
    let total = 0;
    this.invoices.forEach(item => {
      if (item.status != 'DELETED') total += item.totalSum;
    })
    return total;
  }
  getTotalBalanceDue() {
    let total = 0;
    this.invoices.forEach(item => {
      if (item.status != 'DELETED') total += ((item.totalSum || item.sum) - item.paidSum);
    })
    return total;
  }
  onCreatePayment() {
    this.selectedInvoices = [];
    if (this.selectedCompanyIds.length > 0) {
      this.invoices.forEach(item => {
        if (item.selected) this.selectedInvoices.push(item);
      })
    }

    this.invoiceStateService.onOpenAsige(this.selectedInvoices);
  }

  onPreviewInvoice(data) {
    this.invoiceStateService.togglePreview(data.id);
  }
  onRollbackInvoice(invoice) {
    this.toastrProgressStateService.onInit(invoice.id);
    this.invoicesService.rollback(invoice.id).subscribe(data => {
      this.toastrProgressStateService.clear(invoice.id);
    }, err => {
      this.toastrProgressStateService.clear(invoice.id);
    })
  }
  public sortBy(sort) {
    this.showPreloader = true;
    this.selectedInvoices = [];
    this.selectedCompanyIds = [];
    this.direction = this.invoicesListService.getDirection(this.direction, this.sort, sort);
    this.sort = sort;
    this.invoicesFilter.setSortBy(`${this.sort}_${this.direction}`);
    this.setDefaultScoll();
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.onScroll();
  }
  onSelectInvoice() {
    this.invoices.forEach(item => {
      if (item.selected) this.selectedCompanyIds.push(item.companyId);
    })
    this.selectedCompanyIds = this.selectedCompanyIds.filter((item, pos, self) => {
      return self.indexOf(item) == pos;
    })
    this.cd.detectChanges();
  }
  getInvoices() {
    if (this.invoicesListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.invoicesFilter.setOffset(this.page_number * this.offset);
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.invoicesService.getInvoices(this.invoicesFilter.getFIlter()).subscribe((data: any) => {
      this.invoices = [...this.invoices, ...data.map(item => new Invoice(item))];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.invoicesListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.invoiceStateService.setInvoices(this.invoices);
      this.cd.detectChanges();
    })
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.invoicesListService.setBlockList(false);
    this.invoices = [];
  }
  ngOnDestroy(): void {
    if (this.customerPortalStateService.isCustomerPortal && this.invoiceRealTimeService.subsribeToInvoiceCustomerUsers) this.invoiceRealTimeService.subsribeToInvoiceCustomerUsers.unsubscribe();
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
