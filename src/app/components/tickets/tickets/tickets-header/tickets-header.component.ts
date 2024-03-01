import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { TitleListType } from './class/title-list-type';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { TicketsFilterComponent } from './tickets-filter/tickets-filter.component';
import { AppService } from 'src/app/states/app/app.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { TicketsFilter } from '../class/tickets-filter';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketGlobalFilter } from '../class/ticket-global-filter';

@Component({
  selector: 'app-tickets-header',
  templateUrl: './tickets-header.component.html',
  styleUrls: ['./tickets-header.component.scss']
})
export class TicketsHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('filter') filter: TicketsFilterComponent;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  titleListTypes: Array<TitleListType> = [new TitleListType('All Tickets', 'ALL'),
  new TitleListType('Unassigned', 'UNASSIGNED'),
  new TitleListType('Open', 'OPEN'),
  new TitleListType('Closed', 'CLOSED'),
  new TitleListType('On Hold', 'ON_HOLD'),
  new TitleListType('Trash', 'TRASH'),
  new TitleListType('Spam', 'SPAM'),
  new TitleListType('My Tickets', 'USERS'),
  new TitleListType('Recurring tickets Open', 'RECURRING_TICKETS_OPEN'),
  new TitleListType('Recurring tickets Closed', 'RECURRING_TICKETS_CLOSED')];
  title: string = 'My Tickets';
  sub: Subscription = new Subscription();
  count = 0;
  toggleFilter: boolean = false;
  countFilter: number = 0;
  selectedListType: TitleListType = new TitleListType('My Tickets', 'USERS');
  constructor(private ticketsStateService: TicketsStateService,
    public appService: AppService,
    private leftPanelStateService: LeftPanelStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    if (this.customerPortalStateService.isCustomerPortal) this.ticketsFilter.isDisbledCompany = true;
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    this.selectedListType = this.titleListTypes.find(item => item.type === this.ticketsStateService.getListType());
    /* END */
    this.title = `${(this.selectedListType) ? this.selectedListType.title : ''} (${(this.count) ? this.count : 0})`;
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.ticketsFilter.setFilter(data);
      this.selectedListType = this.titleListTypes.find(item => item.type === data.listType);
      if (this.selectedListType) this.title = `${this.selectedListType.title} (${(this.count) ? this.count : 0})`;
      this.onChangeCounterFilter();
    })
    this.sub.add(getOnInitFilter);
    this.ticketsStateService.getOnInitCount().subscribe(data => {
      this.count = data;
      this.onSetCount();
    })
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    if (this.ticketsStateService.getListType() && this.ticketsStateService.getTicketsCounts()) {
      let listType = this.ticketsStateService.getListType();
      this.selectedListType = this.titleListTypes.find(item => item.type === listType);
      this.count = this.ticketsStateService.getTicketsCounts()[(listType === 'USERS') ? 'USER' : listType];
      this.onSetCount();
    }
    /* END */
    let onToggleFilter = this.ticketsStateService.onToggleFilter.subscribe(data => {
      this.toggleFilter = data;
    })
    this.sub.add(onToggleFilter);
  }
  /**
* @description Update value "countFilter" by which filters is use
*/
  public onChangeCounterFilter() {
    this.countFilter = 0;
    if (this.ticketsFilter.selectedCompanies.length > 0 && !this.ticketsFilter.isDisbledCompany) this.countFilter++;
    if (this.ticketsFilter.selectedTechUsers.length > 0) this.countFilter++;
    if (this.ticketsFilter.selectedUsers.length > 0) this.countFilter++;
    if (this.ticketsFilter.selectedStatus.length > 0) this.countFilter++;
    if (this.ticketsFilter.selectedPriorityLevels.length > 0) this.countFilter++;
    if (this.ticketsFilter.tags.length > 0) this.countFilter++;
    if (this.ticketsFilter.customDateRange || this.ticketsFilter.startDate && this.ticketsFilter.endDate) this.countFilter++;
  }
  /**
* @description Set new value "title" by which List Tupe is use
*/
  onSetCount() {
    this.title = `${(this.selectedListType) ? this.selectedListType.title : ''} (${(this.count) ? this.count : 0})`;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  /**
* @description Return true if user any filter
* @returns {Boolean} This is the result
*/
  isExistFilters() {
    return this.ticketsFilter.selectedCompanies.length > 0 ||
      this.ticketsFilter.selectedTechUsers.length > 0 ||
      this.ticketsFilter.selectedUsers.length > 0 ||
      this.ticketsFilter.selectedStatus.length > 0 ||
      this.ticketsFilter.tags.length > 0 ||
      this.ticketsFilter.selectedPriorityLevels.length > 0 ||
      this.ticketsFilter.customDateRange ||
      this.ticketsFilter.startDate && this.ticketsFilter.endDate
  }
  /**
* @description Return selected Status by toLowerCase
* @param {String} selectedStatus - selected status
* @returns {String} This is the result
*/
  getStatus(selectedStatus) {
    return selectedStatus.toLowerCase();
  }
  /**
* @description Apply ticket filters
*/
  refreshFilters() {
    this.filter.applyFilters();
  }
  /**
* @description Return text 'Filter' + countFilter
* @returns {String} This is the result
*/
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  /**
* @description Set new value countFilter
* @param {String} data - new value countFilter
*/
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  /**
* @description Set new value title
* @param {String} title - new value Title
*/
  public setTitle(title) {
    this.title = `${title} (${(this.count) ? this.count : 0})`;
  }
  /**
* @description Return user firstName + lastName
* @returns {String} This is the result
*/
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  /**
* @description Toogle displat filters
* @param {Boolean} data - new value toggleFilter
*/
  onToggleFilter(data) {
    this.toggleFilter = data;
    this.ticketsStateService.changeToggleFilter(this.toggleFilter);
  }
  /**
* @description Show aside to add ticket
*/
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  /**
* @description Track list by "id" field, retrun field "id"
* @param {Number} index - selected 
* @param {Object} item - Object for use tracking
* @returns {String} This is the result
*/
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
