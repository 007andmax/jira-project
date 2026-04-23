import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from 'src/app/components/tickets/class/ticket';
import { TicketsFilter } from 'src/app/components/tickets/tickets/class/tickets-filter';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { TicketStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  standalone: true,
  imports: [CommonModule],
    selector: 'app-tasks-add-associate-tickets',
    templateUrl: './tasks-add-associate-tickets.component.html',
    styleUrls: ['./tasks-add-associate-tickets.component.scss'],
    providers: [TicketsListService],
    standalone: true
})
export class TasksAddAssociateTicketsComponent {
  page_number: number = 0;
  offset: number = 30;
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  @Input() selectedItem: Ticket = null;
  @Input() isDisabled: boolean = false;
  @Input() ticketsFilter: TicketsFilter = new TicketsFilter();
  @ViewChild('globalSearch', { static: true }) globalSearch: NgbDropdown;
  @Output() onSelectedItem = new EventEmitter();
  list: Array<Ticket> = [];
  constructor(private ticketsService: TicketsService,
    public companiesStateService: CompaniesStateService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
    public elRef: ElementRef,
    private ticketStateService: TicketStateService) { }

  ngOnInit() {
  }
  /**
* @description Set id seleted ticket and routing to ticket details page
* @param {Ticket} item - Object of Ticket
*/
  selectTicket(item) {
    this.selectedItem = item;
    this.onSelectedItem.emit(this.selectedItem);
    this.globalSearch.close();
  }
  getSelectedItemText() {
    return this.selectedItem ? `Tkt #${this.selectedItem.number}` : '';
  }

  /**
* @description Init request to get filter list tickets
*/
  private getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.ticketsFilter.setSize(30);
    if (this.page_number > 0) this.showPreloader = true;
    this.ticketsService.getTickets(this.ticketsFilter.getListTupe(), this.ticketsFilter.getDataForRequest()).subscribe((data: Array<Ticket>) => {
      this.list = [...this.list, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.ticketsFilter.setOffset(this.page_number * this.offset);
      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }
  /**
* @description Init logic to scroll list ticket
*/
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getTickets();
  }
  /**
* @description Init request to get filter list tickets
*/
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];

  }
  /**
* @description Show dropdown
*/
  onShowDropDown() {
    this.globalSearch.open();
    this.setDefaultScoll();
    this.onScroll();
  }
  openNewTab() {
    this.ticketStateService.setTicketRoutingId(this.selectedItem.id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${this.selectedItem.id}`;
    window.open(url, '_blank');
  }
  clearClient() {

    this.selectedItem = null;
    this.elRef.nativeElement.querySelector("#dropdownTickets").value = "";
    this.onSelectedItem.emit(null);
    this.cd.detectChanges();
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
}
