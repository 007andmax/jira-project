import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { TicketsFilter } from '../../tickets/tickets/class/tickets-filter';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsCounts } from '../../tickets/tickets/class/tickets-counts';
import { QuoteStateService } from 'src/app/states/quote/quote-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketGlobalFilter } from '../../tickets/tickets/class/ticket-global-filter';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { DELETE_GLOBAL_FILTER } from 'src/app/const/confirm';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { TicketsFilterSaveComponent } from '../../tickets/tickets/tickets-header/tickets-filter-save/tickets-filter-save.component';

@Component({
  selector: 'app-left-panel-tickets',
  templateUrl: './left-panel-tickets.component.html',
  styleUrls: ['./left-panel-tickets.component.scss']
})
export class LeftPanelTicketsComponent implements OnInit, OnDestroy {
  open: boolean = false;
  @ViewChild('usersDp') usersDp: DropDownComponent;
  ticketsFilter: TicketsFilter = new TicketsFilter();
  listType: string;
  blockFilterUser: boolean = false;
  ticketsCounts: TicketsCounts;
  selectedGlobalFilter: TicketGlobalFilter = new TicketGlobalFilter();
  globalFilters: Array<TicketGlobalFilter> = [];
  sub: Subscription = new Subscription();
  isGetGlobalFilters: boolean = false;
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
    private leftPanelStateService: LeftPanelStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private usersStateService: UsersStateService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private leftPanelService: LeftPanelService) { }


  ngOnInit() {
    this.listType = this.ticketsStateService.getListType();
    this.ticketsStateService.getOnChangeLeftPanelFilter().subscribe(data => {
      this.listType = data;
    })
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    let onGetCurrentUser = this.usersStateService.onGetCurrentUser.subscribe(data => {
      if (!this.ticketsStateService.isMoveToTickets && this.activePage !== 'help-center' && !this.customerPortalStateService.isCustomerPortal) this.getCounts();
    })
    if (this.ticketsStateService.isMoveToTickets) {
      this.ticketsCounts = this.ticketsStateService.getTicketsCounts();
      if (this.listType !== "DASHBOARD") this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      this.cd.detectChanges();
    }
    /* END */
    this.ticketsStateService.getOnUpdateCounts().subscribe(data => {
      this.ticketsCounts = new TicketsCounts(data);
      this.ticketsStateService.onInitCount(this.ticketsCounts[(this.listType === 'USERS') ? 'USER' : this.listType]);
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
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
      if (!this.leftPanelService.isTicketsPage(state)) this.open = false
      if (this.leftPanelService.isTicketsPage(state) && !this.isGetGlobalFilters) this.getGLobalFilters();
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isTicketsPage(data)) {
        this.open = true;
        if (!this.isGetGlobalFilters) this.getGLobalFilters();
      }
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_GLOBAL_FILTER) this.onDeleteGlobalFilter(this.ticketsStateService.getGlobalFilterForRemove());
      }
    })
    this.sub.add(getConfirm);
    let onGetGlobalFilters = this.ticketsStateService.onGetGlobalFilters.subscribe(data => {
      this.globalFilters = data;
    })
    this.sub.add(onGetGlobalFilters);
  }
  private getGLobalFilters() {
    this.isGetGlobalFilters = true;
    this.ticketsService.getFilters().subscribe((data: any) => {
      this.globalFilters = data.ticketFilteringDtos.map(item => new TicketGlobalFilter(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
        1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      this.ticketsStateService.setGlobalFilters(this.globalFilters);
    })
  }
  public onDeleteGlobalFilter(filter) {
    this.ticketsService.deleteGlobalFilter(filter.id).subscribe(data => {

    })
  }
  public close() {
    this.open = false;
  }
  setGlobalFilter(filter) {
    console.log("setGlobalFilter", filter);
    this.selectedGlobalFilter = filter;
    this.ticketsStateService.onChangeLeftPanelFilter("ALL");
    this.ticketsStateService.onChangeGlobalFilter(filter);
    this.ticketsStateService.changeToggleFilter(true);
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
  blockClick(event) {
    event.preventDefault();
    event.stopPropagation();
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
  removeFilter(filter) {
    this.confirmStateService.setConfirmAction(DELETE_GLOBAL_FILTER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    this.ticketsStateService.setGlobalFilterForRemove(filter);
  }
  ngOnDestroy(): void {
    /* CAUSTOM LOGIC FOR COUNTS TICKETS - We will need to remove this logic once we will completely remove the angularJS framework. */
    /* START */
    if (!this.ticketsStateService.isMoveToTickets) this.ticketsStateService.onChangeTypeFilter("USERS");
    /* END */
    this.sub.unsubscribe();
  }
}
