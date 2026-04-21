
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompanyAssociateComponent } from './company-associate/company-associate.component';


@Component({
  standalone: true,
  imports: [CompanyAssociateComponent, CommonModule],
  selector: 'company-dash-associate',
  templateUrl: './company-dash-associate.component.html',
  styleUrls: ['./company-dash-associate.component.scss']
})
export class CompanyDashAssociateComponent implements OnInit {
  @Input() company: any;
  associatedCompaniesIds = [];
  constructor(private companiesService: CompaniesService) { }

  ngOnInit() {
    this.associatedCompaniesIds = this.getAssociatedCompaniesIds();
  }
  getAssociatedCompaniesIds() {
    return this.company.associatedCompanies.map(item => item.id);
  }
  onChangedAssociatedCompanies(data) {
    this.companiesService.setAssociatedCompanies(this.company.id, data).subscribe(res => {

    })
  }

}
