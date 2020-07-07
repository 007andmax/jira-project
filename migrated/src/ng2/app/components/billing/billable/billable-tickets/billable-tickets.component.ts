import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BillableStateService } from 'src/ng2/app/states/billable/billable-state.service';
import { BillableProfile } from '../class/billable-profile';
import * as moment from "moment";
import { CompanyFilterTop } from '../../../companies/class/copany-filter-top';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { REMOVE_TICKET_BILLABLE } from 'src/ng2/app/const/confirm';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { BillableProfileTicket } from '../class/billable-profile-ticket';
import { NotificationStateService } from '../../../shared/notification/services/notification-state.service';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { BillableRealTimeService } from 'src/ng2/app/states/billable/billable-real-time.service';

@Component({
  selector: 'billable-tickets',
  templateUrl: './billable-tickets.component.html',
  styleUrls: ['./billable-tickets.component.scss']
})
export class BillableTicketsComponent implements OnInit, OnDestroy {
  billableProfile: BillableProfile;
  filter: Array<CompanyFilterTop> = [new CompanyFilterTop('closedAt', ''),
  new CompanyFilterTop('ticketNumber', 'DESC'),
  new CompanyFilterTop('subject', ''),
  new CompanyFilterTop('sum', '')];
  currentUser;
  ticketForRemove: BillableProfileTicket = null;
  isCurrentCompanyAddressEmpty: boolean = true;
  sub: Subscription = new Subscription();
  constructor(private billableStateService: BillableStateService,
    private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private usersStateService:UsersStateService,
    private companiesStateService: CompaniesStateService,
    private notificationStateService: NotificationStateService,
    private billableRealTimeService: BillableRealTimeService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    if (this.companiesStateService.getCurrentCompany().addresses.length === 0) this.isCurrentCompanyAddressEmpty = false;
    this.billableProfile = this.billableStateService.getBillableProfile();
    if (!this.billableProfile) {
      window.location.href = '#/ng2/billable';
      return;
    }
    console.log("this.billableProfile", this.billableProfile);
    this.onFilterTicketNumber();
    this.billableProfile.tickets.reverse();

    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_TICKET_BILLABLE) {
          this.ticketsService.deleteTicket([this.ticketForRemove.id]).subscribe(data => {
            this.notificationStateService.oninitShowNotification(`The ticket “${this.ticketForRemove.ticketNumber}” has been deleted`);
            let index = this.billableProfile.tickets.findIndex(item => item.id === this.ticketForRemove.id);
            this.billableProfile.tickets.splice(index, 1);
          })
        }
      }
    })
    this.sub.add(getConfirm);

    let changeBillable = this.billableRealTimeService.changeBillable.subscribe(data => {
      if (data.action == 'BILLABLE_EXPENSE_REMOVED') {
       if (data.data.companyId === this.billableProfile.id) {
        let ticketIndex = this.billableProfile.tickets.findIndex(item => item.id === data.data.ticketId);
        if (ticketIndex > -1) {
          this.billableProfile.tickets.splice(ticketIndex, 1);
          this.billableProfile.updateCountTickets();
          this.billableProfile.updateTotal();
        }
       }
       
      }
    });
    this.sub.add(changeBillable);
  }
 
  goToSettings() {
    let body = document.querySelector('.left-panel__category-wrap');
    var link = document.createElement('a');
    body.appendChild(link);
    link.href = `#/ng2/setting/companyprofile`;
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
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
    console.log("this.billableProfile.tickets", this.billableProfile.tickets);
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
  deleteTicket(ticket) {
    this.confirmStateService.setConfirmAction(REMOVE_TICKET_BILLABLE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to remove the billable item?`;
    this.ticketForRemove = ticket;
  }
  onToggleAll(event) {
    this.billableProfile.tickets.forEach(item => {
      if (!item.lockedBy) item.selected = event.target.checked;
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
