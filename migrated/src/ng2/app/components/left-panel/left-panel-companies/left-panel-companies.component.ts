import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelCompaniesFilter } from './class/left-panel-companies-filter';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { CompanyCalculateCount } from '../../companies/class/company-calculate-count';

@Component({
  selector: 'app-left-panel-companies',
  templateUrl: './left-panel-companies.component.html',
  styleUrls: ['./left-panel-companies.component.scss']
})
export class LeftPanelCompaniesComponent implements OnInit {
  listPersons = [];
  clientIndustry: string = '';
  industryHistory = [];
  salesHistory = [];
  industries = [];
  showArchivedCompanies: boolean = false;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  @Output() onFilterTags = new EventEmitter();
  filter: LeftPanelCompaniesFilter = new LeftPanelCompaniesFilter();
  constructor(private usersStateService: UsersStateService, private leftPanelService: LeftPanelService, private companiesService: CompaniesService,
    private companiesState: CompaniesStateService, private leftPanelStateService: LeftPanelStateService) { }

  ngOnInit() {
    this.calculateCount = this.companiesState.getCalculateCount();
    if (this.usersStateService.getAllUsers().length > 0) {
      this.getTehusers(this.usersStateService.getAllUsers());
    } else {
      this.usersStateService.getOnUsers().subscribe((data) => {
        this.getTehusers(data);
      })
    }
    this.leftPanelService.getIndustryHistory().subscribe((data: Array<string>) => {
      this.industryHistory = data;
    })
    this.leftPanelService.getSalesHistory().subscribe((data: Array<string>) => {
      this.salesHistory = data;
    })
    this.getIndustries();
  }
  public onChangeTags(tags) {
    let outTags = [];
    tags.forEach(item => {
      outTags.push(item.id);
    })

    this.onFilterTags.emit(outTags);

    this.companiesState.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;
      console.log('data',data);
    })

  }
  clearSalesPerson() {
    this.filter.setTehUser(null);
    this.leftPanelStateService.onInitFilter(this.filter);
  }
  clearClientIndustry() {
    this.filter.setClientIndustry(null);
    this.leftPanelStateService.onInitFilter(this.filter);
  }
  onShowAll() {
    this.filter.setClientType(null);
    this.companiesState.setOnShowArchived(false);
    this.showArchivedCompanies = false;
  }
  onShowArchived() {
    this.companiesState.setOnShowArchived(true);
    this.showArchivedCompanies = true;
  }
  onSetFilterClientType(data) {
    this.calculateCount.onCulculateCurrent(data);
    this.companiesState.setCalculateCount(this.calculateCount);
    this.filter.setClientType(data);
    this.leftPanelStateService.onInitFilter(this.filter);
  }
  private getIndustries() {
    this.companiesService.getIndustries().subscribe((data: Array<string>) => {
      this.industries = data;
      console.log('industries', this.industries);
    })
  }
  getSelectedTechLead() {
    let index = this.listPersons.findIndex(item => item.selected === true);
    if (index > -1) return this.listPersons[index].firstName + ' ' + this.listPersons[index].lastName;
    return "";
  }
  public selectTechLead (name) {
    this.listPersons.forEach(item => item.selected = false);
    let index = this.listPersons.findIndex(item => `${item.firstName} ${item.lastName}` === name);
    if (index > -1) {
      this.listPersons[index].selected = true;
      this.filter.setTehUser(this.listPersons[index].id);
      this.leftPanelStateService.onInitFilter(this.filter);
    }
  }
  public onSelectTechLead(index) {

    this.listPersons.forEach(item => item.selected = false);
    this.listPersons[index].selected = true;
    this.filter.setTehUser(this.listPersons[index].id);
    this.leftPanelStateService.onInitFilter(this.filter);
    this.salesHistory.pop();
    this.salesHistory.unshift(`${this.listPersons[index].firstName} ${this.listPersons[index].lastName}`);
    //this.company.techLeadId = this.listPersons[index].id;
    this.companiesService.setСustomStorage("companiesPageFilterBySalesHistory", this.salesHistory).subscribe(data => {
      console.log('data', data);
      console.log('this.salesHistory', this.salesHistory);
    })
  }

  public onSelectClientIndustry(item) {
    this.clientIndustry = item;
    this.filter.setClientIndustry(this.clientIndustry);
    this.leftPanelStateService.onInitFilter(this.filter);
    this.industryHistory.pop();
    this.industryHistory.unshift(item);
    //this.company.techLeadId = this.listPersons[index].id;
    this.companiesService.setСustomStorage("companiesPageFilterByIndustryHistory", this.industryHistory).subscribe(data => {
      console.log('data', data);
      console.log('this.salesHistory', this.industryHistory);
    })
  }
  private getTehusers(list) {

    list.forEach((item) => {
      if (item.accountType === "TECH") {
        item.selected = false;
        this.listPersons.push(item);
      }

    })
    console.log('this.listPersons', this.listPersons);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
