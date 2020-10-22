import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { QuoteAdd } from '../../class/quote-add';

@Component({
  selector: 'app-quote-aside-add-body',
  templateUrl: './quote-aside-add-body.component.html',
  styleUrls: ['./quote-aside-add-body.component.scss']
})
export class QuoteAsideAddBodyComponent implements OnInit {
  quoteCompany:any;
  quote:QuoteAdd = new QuoteAdd();
  companies = [];
  constructor(private companiesState: CompaniesStateService) { }

  ngOnInit() {
    if (this.companiesState.getCompanies().length > 0) this.getCLientsList(this.companiesState.getCompanies());
      this.companiesState.getOnCompanies().subscribe((data) => {
      this.getCLientsList(data);
    })
  }
  private getCLientsList(data) {
    this.companies = data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((item) => !item.deletedAt)
  }

}
