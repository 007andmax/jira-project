import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'invoice-change-address',
  templateUrl: './invoice-change-address.component.html',
  styleUrls: ['./invoice-change-address.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ]
})
export class InvoiceChangeAddressComponent implements OnInit {
  @Input() quoteCompany: CompanyProfile = new CompanyProfile();
  company: Company;
  @Output() onSelectAddress = new EventEmitter();
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id == this.quoteCompany.id);
  }
  getShippingAddress() {
    return this.company.companyInfo.addresses.find(item => item.isPrimary);
  }
  getBillingAddress() {
    return this.company.companyInfo.addresses.find(item => !item.isPrimary);
  }
  selectAddress(data) {
    this.onSelectAddress.emit(data)
  }
}
