import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyProfile } from 'src/app/components/companies/class/company-profile';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'quote-aside-add-change-address',
  templateUrl: './quote-aside-add-change-address.component.html',
  styleUrls: ['./quote-aside-add-change-address.component.scss']
})
export class QuoteAsideAddChangeAddressComponent implements OnInit {

  @Input() quoteCompany: CompanyProfile = new CompanyProfile();
  company: CompanyProfile = new CompanyProfile();
  @Output() onSelectAddress = new EventEmitter();
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
  }
  ngDoCheck() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id == this.quoteCompany.id);
  }
  selectAddress(data) {
    this.onSelectAddress.emit(data)
  }

}
