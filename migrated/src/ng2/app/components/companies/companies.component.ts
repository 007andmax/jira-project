import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';
import { CompaniesListService } from './services/companies-list.service';
import { UsersService } from '../../services/users/users.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesListService]
})
export class CompaniesComponent implements OnInit {
  CompaniesList: Array<Company> = [];
  reqCompaniesList: Array<Company> = [];
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 1;

  constructor(private companiesService: CompaniesService, private companiesList: CompaniesListService,   private userService: UsersService,) { }

  ngOnInit() {
    this.getCLientsList();
  }
 
  private getCLientsList() {
    this.companiesService.clientsCompany.subscribe((res: Array<Company>) => {
      this.reqCompaniesList = res.filter(item => item.clientType === 'CLIENT');
      this.CompaniesList = this.reqCompaniesList.splice(0, 30);
      this.page_number += 1;
      console.log('clientsCompaniesList', this.CompaniesList);
      this.showPreloader = false;
    });
  }
  private getCompanies() {
    if (this.companiesList.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    if (this.page_number * 30 >= this.reqCompaniesList.length) {
      this.companiesList.setBlockList(true);
      this.infiniteScrollDisabled = false;
      return;
    }
    let CompaniesList = this.reqCompaniesList.splice((this.page_number - 1) * 30, this.page_number * 30)
    this.CompaniesList = [...this.CompaniesList, ...CompaniesList];
    this.page_number += 1;
    this.infiniteScrollDisabled = false;
  }

  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();

  }

  public trackById(index, item) {
    return item.id;
  }
}
