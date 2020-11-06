import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { TitleListType } from './class/title-list-type';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { TicketsFilterComponent } from './tickets-filter/tickets-filter.component';

@Component({
  selector: 'app-tickets-header',
  templateUrl: './tickets-header.component.html',
  styleUrls: ['./tickets-header.component.scss']
})
export class TicketsHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('filter') filter: TicketsFilterComponent;
  titleListTypes: Array<TitleListType> = [new TitleListType('All Tickets', 'ALL'),
  new TitleListType('Unassigned', 'UNASSIGNED'),
  new TitleListType('Open', 'OPEN'),
  new TitleListType('Close', 'CLOSED'),
  new TitleListType('On Hold', 'ON_HOLD'),
  new TitleListType('Trash', 'TRASH'),
  new TitleListType('Spam', 'SPAM'),
  new TitleListType('My Tickets', 'USERS'),
  new TitleListType('Recurring tickets Open', 'RECURRING_TICKETS_OPEN'),
  new TitleListType('Recurring tickets Closed', 'RECURRING_TICKETS_CLOSED')];
  title: string = 'My Tickets';
  sub: Subscription = new Subscription();
  count = 0;
  toggleFilter: boolean = true;
  countFilter: number = 0;
  selectedListType: TitleListType = new TitleListType('My Tickets', 'USERS');
  constructor(private ticketsStateService: TicketsStateService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.selectedListType = this.titleListTypes.find(item => item.type === this.ticketsStateService.getListType());
    this.title = `${(this.selectedListType) ? this.selectedListType.title : ''} (${this.count})`;
    let getOnInitFilter = this.ticketsStateService.getOnInitFilter().subscribe(data => {
      this.selectedListType = this.titleListTypes.find(item => item.type === data.listType);
      if (this.selectedListType) this.title = `${this.selectedListType.title} (${this.count})`
    })
    this.sub.add(getOnInitFilter);
    this.ticketsStateService.getOnInitCount().subscribe(data => {
      this.count = data;
      this.onSetCount();
    })
    if (this.ticketsStateService.getListType()) {
      let listType = this.ticketsStateService.getListType();
      this.selectedListType = this.titleListTypes.find(item => item.type === listType);
      this.count = this.ticketsStateService.getTicketsCounts()[( listType === 'USERS') ? 'USER' :  listType];
      this.onSetCount();
    }
  }
  onSetCount() {
    this.title = `${(this.selectedListType) ? this.selectedListType.title : ''} (${this.count})`;
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
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
  onAddTicket() {
    this.ticketsStateService.onToggleAddTicket();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
