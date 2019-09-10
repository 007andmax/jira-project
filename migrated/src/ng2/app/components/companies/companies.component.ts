import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  CompaniesList:Array<Company> = [];
  showPreloader: boolean = true;
  constructor(private companiesService: CompaniesService) { }

  ngOnInit() {
    this.getCLientsList();
  }
  private getCLientsList() {
    this.companiesService.clientsCompany.subscribe((res: Array<Company>) => {
      this.CompaniesList = res.filter(item => item.clientType === 'CLIENT');
      console.log('clientsCompaniesList', this.CompaniesList);
      this.showPreloader = false;
    });
  }
  public trackById(index, item) {
    return item.id;
  }
}
