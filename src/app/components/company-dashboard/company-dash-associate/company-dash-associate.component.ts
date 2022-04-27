import { Component, Input, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';


@Component({
  selector: 'company-dash-associate',
  templateUrl: './company-dash-associate.component.html',
  styleUrls: ['./company-dash-associate.component.scss']
})
export class CompanyDashAssociateComponent implements OnInit {
  @Input() company: any;
  constructor(private companiesService: CompaniesService) { }

  ngOnInit() {
  }
  getAssociatedCompaniesIds() {
    return this.company.associatedCompanies.map(item => item.id);
  }
  onChangedAssociatedCompanies(data) {
    this.companiesService.setAssociatedCompanies(this.company.id, data).subscribe(res => {

    })
  }

}
