import { Component, OnInit, Input } from '@angular/core';
import { InvoiceLock } from '../../class/invoice-lock';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyProfile } from 'src/ng2/app/components/companies/class/company-profile';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
 

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
 @Input() invoice:InvoiceLock;
 @Input() company: CompanyProfile = new CompanyProfile();
  constructor(   private billableStateService: BillableStateService,) { }

  ngOnInit() {
  }
  onEditCustomer() {
    this.billableStateService.onEditCustomer(this.company);
  }
}
