import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { InvoicesFilter } from './class/invoices-filter';
import { InvoicesListService } from './services/invoices-list.service';
import { Invoice } from './class/invoice';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceStateService } from 'src/ng2/app/states/invoice/invoice-state.service';
import { Subscription } from 'rxjs';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DELETE_INVOICE, ROLLBACK_INVOICE, REFUND_PAYMENTS } from 'src/ng2/app/const/confirm';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  providers: [InvoicesListService]
})
export class InvoicesComponent implements OnInit,OnDestroy {
  invoicesFilter:InvoicesFilter = new InvoicesFilter();
  invoices:Array<Invoice> = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  showCreateInvoice:boolean = false;
  showPreviewInvoice:boolean = false;
  offset: number = 20;
  previewInvoice:Invoice;
  sub:Subscription = new Subscription();
  constructor(private invoicesService:InvoicesService,
    public cd: ChangeDetectorRef,
    private companiesStateService:CompaniesStateService,
    private invoiceStateService:InvoiceStateService,
    private confirmStateService: ConfirmStateService,
    private invoicesListService:InvoicesListService) { }

  ngOnInit() {
    window.scrollTo(0,0);
    this.onScroll();
    let getOnInitFilter = this.invoiceStateService.getOnInitFilter().subscribe(data => {
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
  }
  onPreviewInvoice(data) {
this.previewInvoice = data;
this.showPreviewInvoice = true;
  }
  onRollbackInvoice(invoice) {
    this.invoicesService.rollback(invoice.id).subscribe(data => {

    })
  }
  onRemoveInvoice(invoice) {
    this.invoicesService.remove(invoice.id).subscribe(data => {

    })
  }
  getInvoices () {
    if (this.invoicesListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.invoicesFilter.setOffset(this.page_number * this.offset);


    if (this.page_number > 0) this.showPendingPreloader = true;
    this.invoicesService.getInvoices(this.invoicesFilter.getFIlter()).subscribe((data:any) => {  
      console.log("data",data);
       this.invoices = [...this.invoices, ...data];
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
