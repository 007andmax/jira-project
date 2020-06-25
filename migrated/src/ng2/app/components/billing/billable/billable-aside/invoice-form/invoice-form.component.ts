import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { InvoiceLock } from '../../class/invoice-lock';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyProfile } from 'src/ng2/app/components/companies/class/company-profile';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CompanyUpdate } from 'src/ng2/app/components/companies/class/company-update';
import { Subscription } from 'rxjs';
import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer/invoice-form-edit-customer.component';


@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit, OnDestroy {
  @ViewChild('companyEdit') companyEdit: InvoiceFormEditCustomerComponent;
  @Input() invoice: InvoiceLock;
  @Input() company: CompanyProfile = new CompanyProfile();
  sub: Subscription = new Subscription();
  constructor(private billableStateService: BillableStateService,
    private companiesStateService: CompaniesStateService) { }


  ngOnInit() {
    let getChangeCompanies = this.companiesStateService.getChangeCompanies().subscribe((data: CompanyUpdate) => {

      if (data.action === 'COMPANY_SAVED' && this.company.id === data.data.id) {

        this.company.name = data.data.name;
        this.company.contacts[0].firstName = data.data.companyInfo.contacts[0].firstName;
        this.company.contacts[0].lastName = data.data.companyInfo.contacts[0].lastName;
        this.company.addresses[0].addressWithSuitNumberAndPostalCode = data.data.companyInfo.addresses[0].addressWithSuitNumberAndPostalCode;
        this.company.contacts[0].primaryEmail = data.data.companyInfo.contacts[0].primaryEmail;

        console.log("this.company", this.company);
      }


    })
    this.sub.add(getChangeCompanies);
  }
  onUpdateCompany() {
    let data = this.companyEdit.getCompany();
    this.company.contacts[0].phoneNumbers = data.contacts[0].phoneNumbers;

  }
  onEditCustomer() {
    this.billableStateService.onEditCustomer(this.company);

  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
