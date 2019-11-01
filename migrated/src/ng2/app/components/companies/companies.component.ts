import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompaniesService } from '../../services/company/companies.service';
import { Company } from '../../interfaces/company/company';
import { CompaniesListService } from './services/companies-list.service';
import { UsersService } from '../../services/users/users.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  providers: [CompaniesListService]
})
export class CompaniesComponent implements OnInit,OnDestroy {
  
  CompaniesList: Array<Company> = [];
  reqCompaniesList: Array<Company> = [];
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 1;
  sub:Subscription = new Subscription();
  constructor(private companiesService: CompaniesService, private companiesList: CompaniesListService,
    private companiesStateService: CompaniesStateService, private userService: UsersService, 
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) {
      this.getClientsList(this.companiesStateService.getCompanies());
    } else {
      this.companiesStateService.getOnCompanies().subscribe((data) => {

        this.getClientsList(data);
      })
    }
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data)  this.onArchiveCompany(this.companiesStateService.getCompanytForArchive().id);
    })
    this.sub.add(getConfirm);
  }

  private getClientsList(data) {

console.log('data',data);
    this.reqCompaniesList = data.filter(item => item.clientType === 'CLIENT');
    this.CompaniesList = this.reqCompaniesList.splice(0, 30);
    this.page_number += 1;
    console.log('clientsCompaniesList', this.CompaniesList);
    this.showPreloader = false;

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
  public onArchiveCompany(id) {
    console.log('onArchiveCompany',id);
    this.companiesService.archiveCompany(id).subscribe(data => {
      console.log('data', data);
      let index = this.CompaniesList.findIndex(item => item.id === id);
      if (index > -1) this.CompaniesList.splice(index, 1);
    })
   
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();

  }

  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
