import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemFilterPerson } from 'src/app/components/left-panel/left-panel-companies/class/item-filter-person';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { CompanyIndustry } from 'src/app/interfaces/company/company-industry';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompanyFilter } from '../../class/company-filter';
import { CompanySetting } from '../../class/company-setting';
import { CompanyTagsComponent } from '../../company-tags/company-tags.component';

@Component({
  selector: 'companies-filter',
  templateUrl: './companies-filter.component.html',
  styleUrls: ['./companies-filter.component.scss']
})
export class CompaniesFilterComponent implements OnInit {
  companyTypes = [new CompanySetting('Client', 'CLIENT'),
  new CompanySetting('Lead', 'LEAD'),
  new CompanySetting('Vendor', 'VENDOR'),
  new CompanySetting('Supplier', 'SUPPLIER'),
  new CompanySetting('Archive', 'ARCHIVE')];
  industries: Array<CompanyIndustry> = [];
  listPersons: Array<ItemFilterPerson> = [];
  companyFilter: CompanyFilter = new CompanyFilter();
  @ViewChild('typesDp') typesDp: DropDownComponent;
  @ViewChild('personsDp') personsDp: DropDownComponent;
  @ViewChild('industriesDp') industriesDp: DropDownComponent;
  @ViewChild('tagsDp') tagsDp: CompanyTagsComponent;
  @Output() changeCountFilter = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
    private usersStateService: UsersStateService) { }

  ngOnInit() {
    this.industries = this.companiesStateService.getIndustries();
    this.companiesStateService.onGetIndustries.subscribe(data => {
      this.industries = data;
    })
    if (this.usersStateService.getAllUsers().length > 0) {
      this.getTehusers(this.usersStateService.getAllUsers());

    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getTehusers(data);

    })
    this.sub.add(getOnUsers);
    let onChangeFilter = this.leftPanelStateService.onChangeFilter.subscribe(data => {
      this.typesDp.onSelect(this.companyTypes.find(item => item.value === data));
    })
    this.sub.add(onChangeFilter);
  }
  private getTehusers(list) {
    list.forEach((item) => {
      if (item.accountType === "TECH" && !item.deletedAt) {
        this.listPersons.push(new ItemFilterPerson(item.id, `${item.firstName} ${item.lastName}`));
        this.listPersons.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      }
    })
  }
  public onClearAll() {
    this.typesDp.clearWithOutChanges();
    this.personsDp.clearWithOutChanges();
    this.industriesDp.clearWithOutChanges();
    this.tagsDp.clearWithOutChanges();

    this.companyFilter.setClientType(null);
    this.companyFilter.setClientIndustry(null);
    this.companyFilter.setTehUser(null);
    this.companyFilter.setTags([]);
    this.companiesStateService.onInitFilter(this.companyFilter);
    this.onChangeCounterFilter();
  }
  public onSelectTechLead(data) {
    this.companyFilter.setTehUser((data) ? data.id : null);
    this.companiesStateService.onInitFilter(this.companyFilter);
    this.onChangeCounterFilter();
  }
  public onSelectType(data) {
    this.companyFilter.setClientType((data) ? data.value : null);
    this.companiesStateService.onInitFilter(this.companyFilter);
    this.onChangeCounterFilter();
  }
  public onSelectClientIndustry(data) {
    this.companyFilter.setClientIndustry((data) ? data : null);
    this.companiesStateService.onInitFilter(this.companyFilter);
    this.onChangeCounterFilter();
  }
  public onChangeTags(data) {

    this.companyFilter.setTags(data.map(item => item.id));
    this.companiesStateService.onInitFilter(this.companyFilter);
    this.onChangeCounterFilter();
  }
  public onChangeCounterFilter() {
    let count = 0;
    if (this.companyFilter.clientType) count++;
    if (this.companyFilter.clientIndustry) count++;
    if (this.companyFilter.tags.length > 0) count++;
    if (this.companyFilter.tehUser) count++;

    this.changeCountFilter.emit(count);
  }
}
