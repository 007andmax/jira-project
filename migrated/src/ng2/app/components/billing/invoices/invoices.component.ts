import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InvoicesService } from 'src/ng2/app/services/invoices/invoices.service';
import { InvoicesFilter } from './class/invoices-filter';
import { InvoicesListService } from './services/invoices-list.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
  providers: [InvoicesListService]
})
export class InvoicesComponent implements OnInit {
  invoicesFilter:InvoicesFilter = new InvoicesFilter();
  invoices = [];
  showPendingPreloader: boolean = false;
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  offset: number = 20;
  constructor(private invoicesService:InvoicesService,
    public cd: ChangeDetectorRef,
    private invoicesListService:InvoicesListService) { }

  ngOnInit() {
    window.scrollTo(0,0);
    this.onScroll();
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
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getInvoices();

  }

}
