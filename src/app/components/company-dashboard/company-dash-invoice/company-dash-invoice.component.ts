import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import * as moment from "moment";
import { Subscription } from 'rxjs';
import { InvoicesAsidePreviewComponent } from '../../billing/invoices/invoices-aside-preview/invoices-aside-preview.component';
import { Invoice } from '../../billing/invoices/class/invoice';
import { InvoicesService } from '../../../services/invoices/invoices.service';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';

@Component({
  selector: 'app-company-dash-invoice',
  templateUrl: './company-dash-invoice.component.html',
  styleUrls: ['./company-dash-invoice.component.scss']
})
export class CompanyDashInvoiceComponent implements OnInit {

  _id: string = '';
  recentInvoiceList = [];
  sub: Subscription = new Subscription();
  //showPreviewInvoice: boolean = false;
  //previewInvoice: Invoice;
  @Input() public set companyName(val: string) {
    if (val !== '' && val !== null && val !== undefined) {
      this.getRecentInvoiceList(val);
    }
  }
  // @ViewChild('previewInvoiceAside') previewInvoiceAside: InvoicesAsidePreviewComponent;

  public constructor(private companiesService: CompaniesService,
    private invoiceStateService: InvoiceStateService,
    private invoicesService: InvoicesService,
    public cd: ChangeDetectorRef) { }

  public ngOnInit() {
    this._id = /[^/]*$/.exec(window.location.href)[0];
    // this.getRecentInvoiceList();

  }

  getRecentInvoiceList(companyName: string) {
    let getInvoice = this.companiesService.getRecentInvoice(companyName).subscribe((data: any) => {
      data.forEach(element => {
        let obj = element;
        obj.dateName = moment(new Date(obj.date)).format('DD MMM YYYY');
        this.recentInvoiceList.push(obj);
      });
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    });
    this.sub.add(getInvoice);
  }

  onPreviewInvoice(data) {
    this.invoiceStateService.togglePreview(data.id);
    /*  this.previewInvoice = data;
      if (this.showPreviewInvoice) {
        this.cd.detectChanges();
        this.previewInvoiceAside.onGetInvoice();
      }
      this.showPreviewInvoice = true;*/
  }

  onRemoveInvoice(invoice) {
    this.invoicesService.remove(invoice.id).subscribe(data => {
      //  this.showPreviewInvoice = false;
    })
  }



}
