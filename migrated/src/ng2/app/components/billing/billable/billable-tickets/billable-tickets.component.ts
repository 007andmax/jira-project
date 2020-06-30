import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { BillableProfile } from '../class/billable-profile';
import * as moment from "moment";
import { CompanyFilterTop } from '../../../companies/class/copany-filter-top';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';

@Component({
  selector: 'billable-tickets',
  templateUrl: './billable-tickets.component.html',
  styleUrls: ['./billable-tickets.component.scss']
})
export class BillableTicketsComponent implements OnInit {
  billableProfile: BillableProfile;
  filter: Array<CompanyFilterTop> = [new CompanyFilterTop('closedAt', ''),
  new CompanyFilterTop('ticketNumber', 'DESC'),
  new CompanyFilterTop('subject', ''),
  new CompanyFilterTop('sum', '')];
  constructor(private billableStateService: BillableStateService,
    private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.billableProfile = this.billableStateService.getBillableProfile();
    if (!this.billableProfile) {
      window.location.href = '#/ng2/billable';
      return;
    }
    console.log("this.billableProfile", this.billableProfile);
    this.onFilterTicketNumber();
    this.billableProfile.tickets.reverse();
  }
  editTicket(id) {

    this.ticketsStateService.onOpenTicket();
    this.ticketsService.getTicket(id).subscribe(data => {
      this.ticketsStateService.onEditTicket(data);
    })
  }
  setSelectedTickets(listIds) {
    this.billableProfile.tickets.forEach(item => {
      let find = listIds.find(ticketIds => ticketIds === item.id);
      if (find) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    })
    console.log("this.billableProfile.tickets",this.billableProfile.tickets);
  }
  onCreateInvoice() {
    let listIds = [];
    this.billableProfile.tickets.forEach(item => {
      if (item.selected) listIds.push(item.id);
    })
    if (listIds.length > 0) this.billableStateService.onCreate(listIds);
  }
  onToggleTicket(ticket) {
    ticket.selected = !ticket.selected;
    console.log("ticket.selected", ticket.selected);
  }
  onToggleAll(event) {
    this.billableProfile.tickets.forEach(item => {
      item.selected = event.target.checked;
    })
  }
  public getDate(date) {
    return moment(new Date(date)).format('DD MMM YYYY');
  }
  onFilter(field) {

    let index = this.filter.findIndex(item => item.field === field);
    if (index > -1) {
      let sort = this.filter[index].filter;
      if (field === 'closedAt') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterСlosedAt();
        } else {
          this.filter[index].filter = 'DESC';
          this.billableProfile.tickets.reverse();
        }

      }
      if (field === 'ticketNumber') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {

          this.filter[index].filter = 'ASC';
          this.onFilterTicketNumber();

        } else {

          this.filter[index].filter = 'DESC';
          this.billableProfile.tickets.reverse();
        }


      }
      if (field === 'subject') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterSubject();
        } else {
          this.filter[index].filter = 'DESC';
          this.billableProfile.tickets.reverse();
        }


      }

      if (field === 'sum') {
        if (sort === '') this.clearFilter();
        if (sort === '' || sort === 'DESC') {
          this.filter[index].filter = 'ASC';
          this.onFilterSum();
        } else {
          this.filter[index].filter = 'DESC';
          this.billableProfile.tickets.reverse();
        }


      }

    }
    this.cd.detectChanges();
  }
  private onFilterSum() {
    this.billableProfile.tickets.sort((a, b) => (a.sum > b.sum) ?
      1 : ((b.sum > a.sum) ? -1 : 0));
  }
  private onFilterSubject() {
    this.billableProfile.tickets.sort((a, b) => (a.subject.toLowerCase() > b.subject.toLowerCase()) ?
      1 : ((b.subject.toLowerCase() > a.subject.toLowerCase()) ? -1 : 0));
  }
  private onFilterTicketNumber() {
    this.billableProfile.tickets.sort((a, b) => (Number(a.ticketNumber) > Number(b.ticketNumber)) ?
      1 : ((Number(b.ticketNumber) > Number(a.ticketNumber)) ? -1 : 0));
  }
  private onFilterСlosedAt() {
    this.billableProfile.tickets.sort((a, b) => (a.closedAt > b.closedAt) ?
      1 : ((b.closedAt > a.closedAt) ? -1 : 0));
  }
  private clearFilter() {
    this.filter.forEach(item => item.filter = '');
  }
  back() {

    let body = document.querySelector('.left-panel__category-wrap');
    var link = document.createElement('a');
    body.appendChild(link);
    link.href = `#/ng2/billable`;
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }
}
