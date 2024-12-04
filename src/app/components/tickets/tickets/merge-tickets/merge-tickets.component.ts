import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ticket } from '../../class/ticket';
import * as moment from 'moment';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { MergeTickets } from './class/merge-tickets';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

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
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    let onMegeTickets = this.ticketsStateService.onMegeTickets.subscribe(data => {
      this.opened = true;
      this.tickets = this.ticketsStateService.getTicketsForMerge();
      this.cd.detectChanges();
    })
    this.sub.add(onMegeTickets);
  }
  getNoPrimaryTickets() {
    return this.tickets.filter(item => item.id != this.primaryTicket.id);
  }
  selectPrimaryTicket(item) {
    this.primaryTicket = item;
  }
  closed() {
    if (this.step == 'STEP_1') {
      this.tickets = [];
      this.listMergeTickets = [];
      this.opened = false;
      this.primaryTicket = null;
    }
    if (this.step == 'STEP_2') {
      this.listMergeTickets = [];
      this.step = 'STEP_1';
    }
  }
  changeStep() {
    if (this.step == "STEP_2") {
      this.addBtn.setDisabled(true);
      this.ticketsService.mergeTickets(this.listMergeTickets).subscribe(res => {
        this.step = 'STEP_1';
        this.addBtn.setDisabled(false);
        this.closed();
      }, err => {
        this.addBtn.setDisabled(false);
      })
    }
    if (this.step == "STEP_1" && this.primaryTicket) {
      this.listMergeTickets = [new MergeTickets({ ticketId: this.primaryTicket.id, isPrimary: true })];
      this.listMergeTickets = [...this.listMergeTickets, ...this.tickets.filter(item => item.id !== this.primaryTicket.id).map(item => new MergeTickets({ ticketId: item.id }))];
      this.step = "STEP_2";
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
