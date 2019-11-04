import { Component, OnInit } from '@angular/core';
 
import { CompanyProfile } from '../class/company-profile';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CompanySubscription } from '../class/company-subscription';

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
  subscriptions:Array<CompanySubscription> = [new CompanySubscription('Ticket Updates','ticket'),
  new CompanySubscription('Ticket Manager','ticketManager'),
  new CompanySubscription('Invoice Updates','invoice')];
  //['Ticket Updates', 'Ticket Manager', 'Invoice Updates'];
  public showSelect = false;
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
    this.companiesService.createCompany(this.company).subscribe(data => {
      console.log(' data', data); 
    })
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
   /**
   * show selecct wrapper
   */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }

   /**
   * stop event
   */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
}
