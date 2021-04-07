import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { TicketsFilter } from '../../tickets/tickets/class/tickets-filter';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { LeftPanelService } from 'src/ng2/app/services/left-panel/left-panel.service';
import { SelectSearchComponent } from '../../shared/select-search/select-search.component';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketsCounts } from '../../tickets/tickets/class/tickets-counts';
import { QuoteStateService } from 'src/ng2/app/states/quote/quote-state.service';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-left-panel-tickets',
  templateUrl: './left-panel-tickets.component.html',
  styleUrls: ['./left-panel-tickets.component.scss']
})
export class LeftPanelTicketsComponent implements OnInit, OnDestroy {
  open: boolean = false;
  @ViewChild('usersDp') usersDp: SelectSearchComponent;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  listType: string = "USERS";
  blockFilterUser: boolean = false;
  ticketsCounts: TicketsCounts;
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
    private leftPanelStateService: LeftPanelStateService,
    private leftPanelService: LeftPanelService) { }


  ngOnInit() {
    this.listType = this.ticketsStateService.getListType();
    this.ticketsStateService.getOnChangeLeftPanelFilter().subscribe(data => {
      this.listType = data;
    })
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    if (!this.ticketsStateService.isMoveToTickets) this.getCounts();
    if (this.ticketsStateService.isMoveToTickets) {
      this.ticketsCounts = this.ticketsStateService.getTicketsCounts();
      if (this.listType !== "DASHBOARD") this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    }
    /* END */
    this.ticketsStateService.getOnUpdateCounts().subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    })
    if (window.innerWidth < 1280) $("app-left-panel-tickets .left-panel-ng2").css({ zIndex: 990 });
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    this.ticketsStateService.setIsMoveToTickets(false);
    /* END */
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isTicketsPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isTicketsPage(data)) this.open = true;
    })
  }
  public close() {
    this.open = false;
  }
  isTicketsPage(state) {
    return (state === 'new-tickets'
      || state === 'new-tickets-dashboard'
      || state === 'recurring-tickets')
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  public goToBashboard() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    this.ticketsStateService.setIsMoveToTickets(true);
    this.ticketsStateService.setListType("DASHBOARD");
    /* END */
    this.goToState('new-tickets-dashboard');
  }
  public goToRecurringTickets(type) {
    if (this.listType === "DASHBOARD") this.ticketsStateService.setIsMoveToTickets(true);
    /* END */
    this.listType = type;
    this.ticketsStateService.onChangeTypeFilter(type);
    this.goToState('recurring-tickets');
  }
  public goToState(state) {
    //this.quoteStateService.goToState(state);
    this.onChangeState.emit(state);
  }

  getCountByField(field) {
    return (this.ticketsCounts) ? this.ticketsCounts[field] : 0;
  }
  public setTypeFilter(type) {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    if (this.listType === "DASHBOARD") this.ticketsStateService.setIsMoveToTickets(true);
    /* END */
    this.listType = type;
    this.ticketsStateService.onChangeTypeFilter(type);
    this.goToState('new-tickets');

  }
  private getCounts() {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START - return last version to get counts */
    this.ticketsStateService.getCounts(this.ticketsFilter.getDataForCounts());
    /* END */
    this.cd.detectChanges();
  }
  onChangeTags(tags) {
    this.ticketsStateService.onChangeTagsFilter(tags);

  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    if (!this.ticketsStateService.isMoveToTickets) this.ticketsStateService.onChangeTypeFilter("USERS");
    /* END */
  }
}
