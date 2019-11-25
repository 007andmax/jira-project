import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { LeftPanelCompaniesFilter } from './class/left-panel-companies-filter';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { CompanyCalculateCount } from '../../companies/class/company-calculate-count';
import { ItemFilterPerson } from './class/item-filter-person';

@Component({
  selector: 'app-left-panel-companies',
  templateUrl: './left-panel-companies.component.html',
  styleUrls: ['./left-panel-companies.component.scss']
})
export class LeftPanelCompaniesComponent implements OnInit {
  listPersons:Array<ItemFilterPerson> = [];
  clientIndustry: string = '';
  industryHistory = [];
  salesHistory = [];
  industries = [];
  showArchivedCompanies: boolean = false;
  //showClearSalesPerson: boolean = false;
  //showClearIndustry: boolean = false;
  calculateCount: CompanyCalculateCount = new CompanyCalculateCount();
  selectedTechLead:ItemFilterPerson = null;
  selectedClientIndustry:string = null;
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
    this.companiesState.getOnCalculateCount().subscribe((data) => {
      this.calculateCount = data;

    })
  }
  private getIndustries() {
    this.companiesService.getIndustries().subscribe((data: Array<string>) => {
      this.industries = data.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
      console.log('industries', this.industries);
    })
  }
 /* getSelectedTechLead() {
    let index = this.listPersons.findIndex(item => item.selected === true);
    if (index > -1) return this.listPersons[index].firstName + ' ' + this.listPersons[index].lastName;
    return "";
  }*/
  private getTehusers(list) {
    list.forEach((item) => {
      if (item.accountType === "TECH" && !item.deletedAt) {
       // item.selected = false;
        this.listPersons.push(new ItemFilterPerson(item.id,`${item.firstName} ${item.lastName}`));
      }
    })
   /* this.listPersons.sort((a, b) => ((a.firstName + ' ' + a.lastName).toLowerCase() > (b.firstName + ' ' + b.lastName).toLowerCase()) ?
    1 : (((b.firstName + ' ' + b.lastName).toLowerCase() > (a.firstName + ' ' + a.lastName).toLowerCase()) ? -1 : 0));*/

    this.listPersons.sort((a, b) => ((a.name).toLowerCase() > (b.name).toLowerCase()) ?
    1 : (((b.name).toLowerCase() > (a.name).toLowerCase()) ? -1 : 0));
    console.log('this.listPersons',this.listPersons);
  }
  public selectTechLead(name) {
   
  //  this.showClearSalesPerson = true;
   // this.listPersons.forEach(item => item.selected = false);
    let index = this.listPersons.findIndex(item => item.name === name);
    if (index > -1) {
      this.selectedTechLead = this.listPersons[index];
    //  this.listPersons[index].selected = true;
      this.filter.setTehUser(this.listPersons[index].id);
      this.leftPanelStateService.onInitFilter(this.filter);
    }
  }
  public selectClientIndustry(item) {
    this.selectedClientIndustry = item;
  //  this.showClearIndustry = true;
    this.clientIndustry = item;
    this.filter.setClientIndustry(this.clientIndustry);
    this.leftPanelStateService.onInitFilter(this.filter);
  }
  toggleFilter(event) {
    event.target.parentNode.classList.toggle('show-filter');
  }
  clearSalesPerson() {
//    this.showClearSalesPerson = false;
  //  this.listPersons.forEach(item => item.selected = false);
    this.filter.setTehUser(null);
    this.leftPanelStateService.onInitFilter(this.filter);
  }

  clearClientIndustry() {
  //  this.showClearIndustry = false;
    this.clientIndustry = '';
    this.filter.setClientIndustry(null);
    this.leftPanelStateService.onInitFilter(this.filter);
  }
  public onChangeTags(tags) {
    let outTags = [];
    tags.forEach(item => {
      outTags.push(item.id);
    })
    this.onFilterTags.emit(outTags);
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

  public onSelectTechLead(item) {
    if (!item) {
      this.clearSalesPerson();
      return;
    }
this.selectedTechLead = null;
  //  this.showClearSalesPerson = true;
  //  this.listPersons.forEach(item => item.selected = false);
  //  this.listPersons[index].selected = true;
    this.filter.setTehUser(item.id);
    this.leftPanelStateService.onInitFilter(this.filter);
    this.salesHistory.pop();
    this.salesHistory.unshift(item.name);
    
    this.companiesService.setСustomStorage("companiesPageFilterBySalesHistory", this.salesHistory).subscribe(data => {
      console.log('data', data);
      console.log('this.salesHistory', this.salesHistory);
    })
  }

  public onSelectClientIndustry(item) {
    if (!item) {
      this.clearClientIndustry();
      return;
    }
    this.selectedClientIndustry = null;
    console.log('item',item);
 //   this.showClearIndustry = true;
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

  public trackByIndex(index, item) {
    return index;
  }
}
