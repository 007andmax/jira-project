import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { TitleListType } from './class/title-list-type';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { TicketsFilterComponent } from './tickets-filter/tickets-filter.component';
import { AppService } from 'src/app/states/app/app.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { TicketsFilter } from '../class/tickets-filter';

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
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    this.selectedListType = this.titleListTypes.find(item => item.type === this.ticketsStateService.getListType());
    /* END */
    this.title = `${(this.selectedListType) ? this.selectedListType.title : ''} (${this.count})`;
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.ticketsFilter.setFilter(data);
      console.log("this.ticketsFilter", this.ticketsFilter);
      this.selectedListType = this.titleListTypes.find(item => item.type === data.listType);
      if (this.selectedListType) this.title = `${this.selectedListType.title} (${this.count})`
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
  }

  toggleMobileLeftPanel() {
    this.leftPanelStateService.toggleMobileLeftPanel(true);
    this.appService.toggleMobileAside(true);
  }
  onSetCount() {
    this.title = `${(this.selectedListType) ? this.selectedListType.title : ''} (${this.count})`;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  isExistFilters() {
    return this.ticketsFilter.selectedCompany ||
      this.ticketsFilter.selectedTechUser ||
      this.ticketsFilter.selectedUser ||
      this.ticketsFilter.selectedStatus ||
      this.ticketsFilter.tags.length > 0
  }
  getStatus(selectedStatus) {
    return selectedStatus.toLowerCase();
  }
  refreshFilters() {
    this.filter.applyFilters();
  }
  clearAll() {
    this.filter.onClearAll();
  }
  getTextCountFilters() {
    return `Filters${(this.countFilter > 0) ? ' (' + this.countFilter + ')' : ''}`;
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  public setTitle(title) {
    this.title = `${title} (${this.count})`;
  }
  getUserName(user) {
    return `${user.firstName} ${user.lastName}`;
  }
  onToggleFilter(data) {
    if (this.appService.checkMobile()) this.appService.toggleMobileAside(data);
    this.toggleFilter = data;
  }
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
