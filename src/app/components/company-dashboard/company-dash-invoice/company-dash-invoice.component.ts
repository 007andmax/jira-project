import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import * as moment from "moment";
import { Subscription } from 'rxjs';
import { InvoiceStateService } from 'src/app/states/invoice/invoice-state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-dash-invoice',
  templateUrl: './company-dash-invoice.component.html',
  styleUrls: ['./company-dash-invoice.component.scss']
})
export class CompanyDashInvoiceComponent implements OnInit, OnDestroy {

  _id: string = '';
  recentInvoiceList = [];
  sub: Subscription = new Subscription();
  @Input() public set companyId(val: string) {
    if (val !== '' && val !== null && val !== undefined) {
      this.getRecentInvoiceList(val);
    }
  }
  public constructor(private companiesService: CompaniesService,
    private invoiceStateService: InvoiceStateService,
    public activateRoute: ActivatedRoute,
    public cd: ChangeDetectorRef) { }


  public ngOnInit() {
    this._id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this._id = params['id'];
    });
    this.sub.add(subscription);
  }

  getRecentInvoiceList(companyId: string) {
    this.recentInvoiceList = [];
    let getInvoice = this.companiesService.getRecentInvoice(companyId).subscribe((data: any) => {
      data.forEach(element => {
        let obj = element;
        obj.dateName = moment(obj.date).format('DD MMM YYYY');
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
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
