import { Component, OnInit } from '@angular/core';
import { CompaniesStateService } from '../services/companies-state.service';
import { CompanyProfile } from '../class/company-profile';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';

@Component({
  selector: 'app-company-add-aside',
  templateUrl: './company-add-aside.component.html',
  styleUrls: ['./company-add-aside.component.scss']
})
export class CompanyAddAsideComponent implements OnInit {

  public opened = false;
  public company: CompanyProfile = new CompanyProfile();
  public industries: Array<string> = [];
  public version:string = 'short';
  companyTypes = ['Client', 'Lead', 'Vendor'];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  paymentTerms = ['COD', '7 days', '15 days', '30 days'];
  constructor(private companiesStateService: CompaniesStateService, private companiesService: CompaniesService) { }

  ngOnInit() {
    console.log('company', this.company);
    this.onShowAside();
    this.getIndustries();
  }
  private getIndustries() {
    this.companiesService.getIndustries().subscribe((data:Array<string>) => {
      this.industries = data;
      console.log('industries', this.industries);
    })
  }
  onAddShort() {
    console.log('company', this.company);
  }
  public onShowAside() {
    this.companiesStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
    })
  }
  public oninitFullVersion () {
    this.version = 'full';
    this.company.fullVersion();
  }
  public addFullVersion() {

  }
}
