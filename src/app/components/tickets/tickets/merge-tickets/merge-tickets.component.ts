import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Ticket } from '../../class/ticket';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { MergeTickets } from './class/merge-tickets';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { StatusColor } from '../../class/status-color';

@Component({
  selector: 'app-merge-tickets',
  templateUrl: './merge-tickets.component.html',
  styleUrls: ['./merge-tickets.component.scss']
})
export class MergeTicketsComponent implements OnInit, OnDestroy {
  tickets: Array<Ticket> = [];
  listMergeTickets: Array<MergeTickets> = [];
  primaryTicket: Ticket;
  opened: boolean = false;
  step: string = "STEP_1";
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  listColors: Array<StatusColor> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    let onMegeTickets = this.ticketsStateService.onMegeTickets.subscribe(data => {
      this.opened = true;
      this.tickets = JSON.parse(JSON.stringify(this.ticketsStateService.getTicketsForMerge())).map(item => new Ticket(item));
      this.cd.detectChanges();
    })
    this.sub.add(onMegeTickets);
    if (this.ticketsStateService.getListStatusColor().length > 0) {
      this.listColors = this.ticketsStateService.getListStatusColor();
    }
    let getOnInitColor = this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.sub.add(getOnInitColor);
  }
  getNoPrimaryTickets() {
    return this.tickets.filter(item => item.id != this.primaryTicket.id);
  }
  selectPrimaryTicket(item) {
    this.primaryTicket = item;
  }
  back() {
    this.step = 'STEP_1';
    this.listMergeTickets = [];
  }
  closed() {
    this.tickets = [];
    this.listMergeTickets = [];
    this.opened = false;
    this.primaryTicket = null;
    this.ticketsStateService.resetSelectedTicketsForMerge();
    this.step = 'STEP_1';
  }
  removeTicket(item) {
    if (this.tickets.length == 2) return;
    let index = this.tickets.findIndex(ticket => ticket.id == item.id);
    if (index > -1) this.tickets.splice(index, 1);
  }
  changeStep() {
    if (this.step == "STEP_2") {
      this.addBtn.setDisabled(true);
      this.ticketsService.mergeTickets(this.listMergeTickets).subscribe(res => {

        this.addBtn.setDisabled(false);
        this.closed();
      }, err => {
        this.addBtn.setDisabled(false);
      })
    }
    if (this.step == "STEP_1" && this.primaryTicket) {
      let numbersTickets = this.tickets.filter(item => item.id != this.primaryTicket.id).map(item => item.number);
      this.listMergeTickets = [new MergeTickets({ ticketId: this.primaryTicket.id, isPrimary: true, note: `Tickets with IDs ${numbersTickets.map((item, index) => index == 0 ? `#${item}` : ` and #${item}`)} are merged into this ticket.` })];
      this.listMergeTickets = [...this.listMergeTickets, ...this.tickets.filter(item => item.id !== this.primaryTicket.id).map(item => new MergeTickets({ ticketId: item.id, note: `Current ticket has been merged into the ticket with ID ${this.primaryTicket.number}`, subject: `Current ticket has been merged into the ticket with ID ${this.primaryTicket.number}` }))];
      this.step = "STEP_2";
    }
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
