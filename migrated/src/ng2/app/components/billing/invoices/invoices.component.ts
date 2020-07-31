import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { InvoicesFilter } from './class/invoices-filter';
import { InvoicesListService } from './services/invoices-list.service';
import { Invoice } from './class/invoice';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceStateService } from 'src/ng2/app/states/invoice/invoice-state.service';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DELETE_INVOICE, ROLLBACK_INVOICE, REFUND_PAYMENTS } from 'src/ng2/app/const/confirm';
import { InvoiceRealTimeService } from 'src/ng2/app/states/invoice/invoice-real-time.service';
import { InvoicesAsidePreviewComponent } from './invoices-aside-preview/invoices-aside-preview.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  providers: [InvoicesListService]
})
export class InvoicesComponent implements OnInit, OnDestroy {
  invoicesFilter: InvoicesFilter = new InvoicesFilter();
  invoices: Array<Invoice> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  selectedCompanyId: string = null;
  public sort: string = '';
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  showCreateInvoice: boolean = false;
  showPreviewInvoice: boolean = false;
  offset: number = 20;
  public direction: string = 'ASC';
  previewInvoice: Invoice;
  selectedInvoices:Array<Invoice> = [];
  @ViewChild('previewInvoiceAside') previewInvoiceAside:InvoicesAsidePreviewComponent;
  sub: Subscription = new Subscription();
  constructor(private invoicesService: InvoicesService,
    public cd: ChangeDetectorRef,
    private invoiceRealTimeService: InvoiceRealTimeService,
    private companiesStateService: CompaniesStateService,
    private invoiceStateService: InvoiceStateService,
    private confirmStateService: ConfirmStateService,
    private invoicesListService: InvoicesListService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.companiesStateService.getCompanies().length > 0) this.onScroll();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.onScroll();
    })
    this.sub.add(getOnCompanies);

    let getOnInitFilter = this.invoiceStateService.getOnInitFilter().subscribe(data => {
      this.selectedInvoices = [];
      this.selectedCompanyId = null;
      this.invoicesFilter = data;
      this.showPreloader = true;
      window.scrollTo(0, 0);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(getOnInitFilter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_INVOICE) {
          this.onRemoveInvoice(this.invoiceStateService.getInvoiceForRemove());
        }
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
      console.log("data", data);
      if (data.action === 'INVOICE_SAVED') {
        let index = this.invoices.findIndex(item => item.id === data.data.id);
        let invoice = new Invoice(data.data);
        if (index > -1) {
          this.invoices[index] = invoice;
        } else {
          this.invoices.unshift(invoice);
        }

      }
      if (data.action === 'INVOICE_STATUS' || data.action === 'INVOICE_ROLLBACK' || data.action === 'PAYMENT_RECEIVED') {
        let index = this.invoices.findIndex(item => item.id === data.data.id);
        let invoice = new Invoice(data.data);
        if (index > -1) this.invoices[index] = invoice;
      }
      if (data.action === 'INVOICE_DELETED') {
        let index = this.invoices.findIndex(item => item.id === data.data.id);
        if (index > -1) this.invoices.splice(index, 1);
      }
    })
    this.sub.add(changeInvoice);
  }
  getTotal() {
    let total = 0;
    this.invoices.forEach(item => {
      total +=item.sum;
    })
    return total;
  }
  onCreatePayment() {
    this.selectedInvoices = [];
    if (this.selectedCompanyId) {
      this.invoices.forEach(item => {
        if (item.selected) this.selectedInvoices.push(item);
      })
    }
    this.showCreateInvoice = true;

  }
  onPreviewInvoice(data) {
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
  }
  public sortBy(sort) {
    this.showPreloader = true;
    this.selectedInvoices = [];
    this.selectedCompanyId = null;
    this.direction = this.invoicesListService.getDirection(this.direction, this.sort, sort);
    this.sort = sort;
    this.invoicesFilter.setSortBy(`${this.sort}_${this.direction}`);
    this.setDefaultScoll();
    window.scrollTo(0, 0);
    this.onScroll();
  }
  onSelectInvoice() {
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
  }
  onRemoveInvoice(invoice) {
    this.invoicesService.remove(invoice.id).subscribe(data => {
      this.showPreviewInvoice = false;
    })
  }
  getInvoices() {
    if (this.invoicesListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.invoicesFilter.setOffset(this.page_number * this.offset);


    if (this.page_number > 0) this.showPendingPreloader = true;
    this.invoicesService.getInvoices(this.invoicesFilter.getFIlter()).subscribe((data: any) => {
      console.log("data", data);
      this.invoices = [...this.invoices, ...data];
      if (this.selectedCompanyId) this.invoices.forEach(item => {
        if (item.companyId !== this.selectedCompanyId) item.blockSelected = true;
        if (item.companyId === this.selectedCompanyId) item.blockSelected = false;
      })
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.invoicesListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();

    })


  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.invoicesListService.setBlockList(false);
    this.invoices = [];
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
