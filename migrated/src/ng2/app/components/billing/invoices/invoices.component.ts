import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { InvoicesFilter } from './class/invoices-filter';
import { InvoicesListService } from './services/invoices-list.service';
import { Invoice } from './class/invoice';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { InvoiceStateService } from 'src/ng2/app/states/invoice/invoice-state.service';
import { Subscription } from 'rxjs';

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
  offset: number = 20;
  sub:Subscription = new Subscription();
  constructor(private invoicesService:InvoicesService,
    public cd: ChangeDetectorRef,
    private companiesStateService:CompaniesStateService,
    private invoiceStateService:InvoiceStateService,
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
