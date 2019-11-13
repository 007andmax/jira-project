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
export class CompaniesComponent implements OnInit, OnDestroy {

  CompaniesList: Array<Company> = [];
  reqCompaniesList: Array<Company> = [];
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;

  sub: Subscription = new Subscription();
  constructor(private companiesService: CompaniesService, private companiesList: CompaniesListService,
    private companiesStateService: CompaniesStateService, private userService: UsersService,
    private confirmStateService: ConfirmStateService, ) { }

  ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) {
      this.getClientsList(this.companiesStateService.getCompanies());
    } else {
      this.companiesStateService.getOnCompanies().subscribe((data) => {

        this.getClientsList(data);
      })
    }
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) this.onArchiveCompany(this.companiesStateService.getCompanytForArchive().id);
    })
    this.sub.add(getConfirm);
  }

  private getClientsList(data) {

    console.log('data', data);
    this.reqCompaniesList = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt);
    this.reqCompaniesList.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

  //  this.CompaniesList = this.reqCompaniesList.splice(0, 30);
  //  if (this.CompaniesList.length < 30) this.companiesList.setBlockList(true);
    console.log('clientsCompaniesList', this.CompaniesList);
    this.onScroll();
    this.showPreloader = false;

  }
  private getCompanies() {
    if (this.companiesList.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    console.log('this.page_number',this.page_number);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > this.reqCompaniesList.length) ? this.reqCompaniesList.length : this.page_number * 30;
    let CompaniesList = [];
    console.log('start',start);
    console.log('end',end);
    for (let i =start;i< end;i++)
    {
      CompaniesList.push(this.reqCompaniesList[i]);
    }
     this.CompaniesList = [...this.CompaniesList, ...CompaniesList];
   
    this.infiniteScrollDisabled = false;
    console.log('this.CompaniesList',this.CompaniesList.length);
    if ((this.page_number * 30) > this.reqCompaniesList.length) this.companiesList.setBlockList(true);

  }
  public onArchiveCompany(id) {
    console.log('onArchiveCompany', id);
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
