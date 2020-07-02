import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { Subscription } from 'rxjs';
import * as moment from "moment";
import { InvoiceLock } from '../../class/invoice-lock';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CompanyProfile } from 'src/ng2/app/components/companies/class/company-profile';
@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {
  opened:boolean = false;
  sub: Subscription = new Subscription();
  @Input() invoiceNumber: string;
  @Input() invoice: InvoiceLock;
  @Input() company: CompanyProfile = new CompanyProfile();
  currentCompany: any;
  constructor(private billableStateService:BillableStateService,
    private companiesStateService:CompaniesStateService) { }

  ngOnInit() {
    
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
}
