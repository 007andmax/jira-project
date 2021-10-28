import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TicketsFilter } from '../../class/tickets-filter';
import { Company } from 'src/app/interfaces/company/company';
import { TicketsCounts } from '../../class/tickets-counts';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { SelectSearchComponent } from 'src/app/components/shared/select-search/select-search.component';
import { ItemStatus } from 'src/app/components/tickets/class/item-status';
import { Subscribable, Subscription } from 'rxjs';
import { TagsRealTimeService } from 'src/app/states/tags/tags-real-time.service';
import { AppService } from 'src/app/states/app/app.service';
import { TicketsFilterTagsComponent } from './tickets-filter-tags/tickets-filter-tags.component';
import { StatusColor } from '../../../class/status-color';
import { TicketStatus } from 'src/app/components/setting/customizable-lists/class/ticket-status';
import { TicketStatusFilter } from '../class/ticket-status-filter';

@Component({
  selector: 'app-tickets-filter',
  templateUrl: './tickets-filter.component.html',
  styleUrls: ['./tickets-filter.component.scss']
})
export class TicketsFilterComponent implements OnInit, OnDestroy {
  @ViewChild('usersDp') usersDp: SelectSearchComponent;
  @ViewChild('companyDp') companyDp: SelectSearchComponent;
  @ViewChild('techUsersDp') techUsersDp: SelectSearchComponent;
  @ViewChild('statusDp') statusDp: SelectSearchComponent;
  @ViewChild('tagsDp') tagsDp: TicketsFilterTagsComponent;
  public ticketsFilter: TicketsFilter = new TicketsFilter();
  listType: string = "USERS";
  public selectedCompany: Company = null;
  selectedTechUser: string = null;
  selectedStatus: string = null;
  selectedUser: string = null;
  companies = [];
  users = [];
  techUsersList = [];
  listsStatus = [new ItemStatus('Unassigned', 'unassigned', 'UNASSIGNED'),
  new ItemStatus('Completed', 'completed', 'CLOSED'),
  new ItemStatus('In Progress', 'inProgress', 'OPEN'),
  new ItemStatus('On Hold', 'onHold', 'ON_HOLD')];
  ticketsStatus: Array<TicketStatusFilter> = [];
  blockFilterUser: boolean = false;
  ticketsCounts: TicketsCounts;
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter();
  @Output() changeCountFilter = new EventEmitter<any>();
  constructor(private ticketsStateService: TicketsStateService,
    private companiesState: CompaniesStateService,
    private ticketsService: TicketsService,
    private usersStateService: UsersStateService,
    private companiesService: CompaniesService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    public appService: AppService,
    private leftPanelService: LeftPanelService) { }



  ngOnInit() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    this.listType = this.ticketsStateService.getListType();
    this.ticketsFilter.setListType(this.listType);
    /* END */
    let getOnChangeTypeFilter = this.ticketsStateService.getOnChangeTypeFilter().subscribe(type => {
      this.listType = type;
      this.ticketsFilter.setListType(type);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      if (type !== 'RECURRING_TICKETS') this.getCount();
    })
    this.sub.add(getOnChangeTypeFilter);
    let getOnChangeTagsFilter = this.ticketsStateService.getOnChangeTagsFilter().subscribe(tags => {
      this.ticketsFilter.setTags(tags);
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
    });
    this.sub.add(getOnChangeTagsFilter);
    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
    this.sub.add(getOnUsers);

    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {

      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
    this.leftPanelService.getColors().subscribe((data: any) => {
      let listColors = data.map(item => {
        return new StatusColor(item.borderColor);
      })
      this.ticketsStateService.onColorStatus(listColors);
    })

    //    this.getCounts();

    let getOnUpdateCounts = this.ticketsStateService.getOnUpdateCounts().subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateCounts);
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus().map(item => new TicketStatusFilter(item));
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data.map(item => new TicketStatusFilter(item));
    })
    this.sub.add(onGetTicketsStatus);
  }
  public onClearAll() {

    if (!this.companyDp.isDisabled) this.ticketsFilter.setCompany(null);
    this.ticketsFilter.setTechUser(null);
    this.ticketsFilter.setUser(null);
    if (this.ticketsFilter.selectedStatus) {
      this.listType = "ALL";
      this.ticketsFilter.setListType("ALL");
    }
    this.ticketsFilter.setStatus(null);
    this.ticketsFilter.setTags([]);
    this.usersDp.clearWithOutChanges();
    if (!this.companyDp.isDisabled) this.companyDp.clearWithOutChanges();
    this.techUsersDp.clearWithOutChanges();
    this.statusDp.clearWithOutChanges();
    this.tagsDp.clearWithOutChanges();
    this.ticketsFilter.setCustomStatus(false);
    //  this.listType = "ALL";
    // this.ticketsFilter.setListType("ALL");
    this.ticketsStateService.onInitFilter(this.ticketsFilter);
    this.onChangeCounterFilter();
    if (this.listType !== 'RECURRING_TICKETS') this.getCount();
    this.ticketsStateService.onChangeLeftPanelFilter(this.listType);
    if (this.appService.checkMobile()) this.close();
  }

  public onChangeCounterFilter() {
    let count = 0;
    if (this.ticketsFilter.selectedCompany) count++;
    if (this.ticketsFilter.selectedTechUser) count++;
    if (this.ticketsFilter.selectedUser) count++;
    if (this.ticketsFilter.selectedStatus) count++;
    this.changeCountFilter.emit(count);
  }
  private getCount() {
    this.ticketsService.getCount(this.ticketsFilter.getDataForRequest()).subscribe(data => {
      this.ticketsStateService.onInitCount(data);
    })
  }
  getCountByField(field) {
    return (this.ticketsCounts) ? this.ticketsCounts[field] : 0;
  }
  close() {
    this.onClose.emit(null);
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public setTypeFilterWithoutChange(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
  }
  public setTypeFilter(type) {
    this.listType = type;
    this.ticketsFilter.setListType(type);
    if (!this.appService.checkMobile()) {
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      if (type !== 'RECURRING_TICKETS') this.getCount();
    }

  }

  public onGetUsers(data) {
    this.users = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) {
        return item;
      }
    });

  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    });
  }
  public onSelectCompany(item) {

    this.blockFilterUser = true;
    this.usersDp.clearClient();
    if (!item) {
      this.ticketsFilter.setCompany(null);
      this.users = [];
    } else {
      this.ticketsFilter.setCompany(item);
      this.selectedCompany = null;
      this.onGetUsers(this.usersStateService.getAllUsers().filter(user => user.company.id === item.id));
      //  this.filter.setCompany(item.id);
      //  this.usersStateService.onInitFilter(this.filter);

    }

    if (!this.appService.checkMobile()) {
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
      this.onChangeCounterFilter();
    }
  }
  public onSelectTechUser(item) {

    if (!item) {
      this.ticketsFilter.setTechUser(null);
    } else {
      this.selectedTechUser = null;

      //  this.filter.setCompany(item.id);
      //  this.usersStateService.onInitFilter(this.filter);
      let indexTechUser = this.techUsersList.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexTechUser > -1) this.ticketsFilter.setTechUser(this.techUsersList[indexTechUser]);

    }
    if (!this.appService.checkMobile()) {
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
      this.onChangeCounterFilter();
    }

  }

  public onSelectStatus(item) {
    if (!item) {
      this.setTypeFilter("ALL");
      this.ticketsFilter.setStatus(null);
      this.ticketsFilter.setCustomStatus(false);
    } else {
      this.ticketsFilter.setStatus(item.name);
      let findStatus = this.listsStatus.find(status => status.title === item.title);
      if (findStatus) {
        this.ticketsFilter.setCustomStatus(false);
        this.setTypeFilter(findStatus.status);
      } else {
        this.ticketsFilter.setCustomStatus(true);
        this.setTypeFilter("OPEN");
      }

    }
    this.onChangeCounterFilter();
    this.ticketsStateService.onChangeLeftPanelFilter(this.listType);
  }
  public onSelectUser(item) {

    if (!item) {
      this.ticketsFilter.setUser(null);
    } else {
      this.selectedUser = null;

      //  this.filter.setCompany(item.id);
      //  this.usersStateService.onInitFilter(this.filter);
      let indexhUser = this.users.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexhUser > -1) this.ticketsFilter.setUser(this.users[indexhUser]);

    }

    if (!this.blockFilterUser && !this.appService.checkMobile()) {
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
    }
    this.blockFilterUser = false;
    if (!this.appService.checkMobile()) this.onChangeCounterFilter();
  }

  onChangeTags(tags) {
    //   this.ticketsStateService.onChangeTagsFilter(tags);
    this.ticketsFilter.setTags(tags);
    if (!this.appService.checkMobile()) {
      this.ticketsStateService.onInitFilter(this.ticketsFilter);
      this.getCount();
      this.onChangeCounterFilter();
    }

  }

  applyFilters() {

    this.ticketsStateService.onInitFilter(this.ticketsFilter);
    if (this.listType !== 'RECURRING_TICKETS') this.getCount();
    this.onChangeCounterFilter();
    this.close();
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  getUserList() {
    return this.users.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackByIndex(index, item) {
    return index;
  }
}
