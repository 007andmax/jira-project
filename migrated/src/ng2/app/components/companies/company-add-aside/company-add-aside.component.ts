import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from '../services/companies-state.service';
import { CompanyProfile } from '../class/company-profile';

@Component({
  selector: 'app-company-add-aside',
  templateUrl: './company-add-aside.component.html',
  styleUrls: ['./company-add-aside.component.scss']
})
export class CompanyAddAsideComponent implements OnInit {

  public opened = false;
  public company:CompanyProfile = new CompanyProfile();
  companyTypes = ['Client', 'Lead', 'Vendor']
  constructor(private companiesStateService: CompaniesStateService) { }

  ngOnInit() {

    this.onShowAside();
  }
  
  public onShowAside() {
    this.companiesStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
    })
  }
}
