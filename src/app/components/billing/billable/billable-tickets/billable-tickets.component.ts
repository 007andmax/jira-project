import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BillableStateService } from 'src/app/states/billable/billable-state.service';
import { BillableProfile } from '../class/billable-profile';
import * as moment from "moment";
import { CompanyFilterTop } from '../../../companies/class/company-filter-top';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { REMOVE_TICKETS_BILLABLE, REMOVE_TICKET_BILLABLE } from 'src/app/const/confirm';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { BillableProfileTicket } from '../class/billable-profile-ticket';
import { Subscription } from 'rxjs';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { BillableRealTimeService } from 'src/app/states/billable/billable-real-time.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TicketStateService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { ToastrProgressStateService } from 'src/app/states/toastr-progress/toastr-progress-state.service';
import { fadeInAnimation } from 'src/app/animations';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { TicketSortBy } from 'src/app/components/tickets/tickets/class/ticket-sort-by';

@Component({
  selector: 'billable-tickets',
  templateUrl: './billable-tickets.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./billable-tickets.component.scss']
})
export class BillableTicketsComponent implements OnInit, OnDestroy {
  billableProfile: BillableProfile = null;
  filter: Array<CompanyFilterTop> = [new CompanyFilterTop('closedAt', ''),
  new CompanyFilterTop('ticketNumber', 'DESC'),
  new CompanyFilterTop('subject', ''),
  new CompanyFilterTop('sum', '')];
  currentUser;
  isInitMultyRemove: boolean = false;
  ticketForRemove: BillableProfileTicket = null;
  ticketsForRemove: Array<BillableProfileTicket> = [];
  isCurrentCompanyAddressEmpty: boolean = true;
  sub: Subscription = new Subscription();
  sortBy: TicketSortBy = new TicketSortBy('ticketNumber', 'DESC');
  constructor(private billableStateService: BillableStateService,
    private ticketsService: TicketsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private usersStateService: UsersStateService,
    private companiesStateService: CompaniesStateService,
    private billableRealTimeService: BillableRealTimeService,
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    private ticketStateService: TicketStateService,
    private toastrProgressStateService: ToastrProgressStateService,
    private tasksStateService: TasksStateService,
    public cd: ChangeDetectorRef,) { }


  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.leftPanelStateService.setBillingPage('new-billable-tickets');
    this.currentUser = this.usersStateService.getCurrentUser();
    if (this.companiesStateService.getCurrentCompany().addresses.length === 0) this.isCurrentCompanyAddressEmpty = false;
    this.billableProfile = this.billableStateService.getBillableProfile();
    if (!this.billableProfile) {
      this.moToBillable();
      return;
    }
    this.onFilterTicketNumber();
    this.billableProfile.tickets.reverse();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_TICKET_BILLABLE) {
          this.ticketsService.deleteTicket([this.ticketForRemove.id]).subscribe(data => {
            this.confirmStateService.initRequest(false);
            let index = this.billableProfile.tickets.findIndex(item => item.id === this.ticketForRemove.id);
            this.billableProfile.tickets.splice(index, 1);
          }, err => {
            this.confirmStateService.initRequest(false);
          })
        }
        if (this.confirmStateService.getConfirmAction() === REMOVE_TICKETS_BILLABLE) {
          this.isInitMultyRemove = true;
          this.toastrProgressStateService.onInit(this.ticketsForRemove[0].id);
          this.ticketsService.deleteTicket(this.ticketsForRemove.map(item => item.id)).subscribe(data => {
            this.confirmStateService.initRequest(false);
            this.toastrProgressStateService.clear(this.ticketsForRemove[0].id);
            this.ticketsForRemove.forEach(ticket => {
              let index = this.billableProfile.tickets.findIndex(item => item.id === ticket.id);
              this.billableProfile.tickets.splice(index, 1);
              this.isInitMultyRemove = false;
            })
          }, err => {
            this.confirmStateService.initRequest(false);
            this.toastrProgressStateService.clear(this.ticketsForRemove[0].id);
            this.isInitMultyRemove = false;
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
      if (data.action == 'BILLABLE_EXPENSE_ADDED') {
        if (data.data.companyId === this.billableProfile.id) {
          let ticket = new BillableProfileTicket(data.data);
          this.billableProfile.tickets.push(ticket);
          this.billableProfile.updateCountTickets();
          this.billableProfile.updateTotal();
          this.onFilterAfterAddTicket();
          this.cd.detectChanges();
        }
      }
    });
    this.sub.add(changeBillable);
  }
  moToBillable() {
    this.leftPanelStateService.goToState('new-billable');

  }
  editTask(taskId) {
    this.tasksStateService.openEditAside({ id: taskId });
  }
  goToSettings() {
    this.leftPanelStateService.goToState('company-profile-component');

  }
  getSelectedCount() {
    if (this.billableProfile.tickets.filter(item => item.selected).find(item => !item.isOrder)) return 0
    return this.billableProfile.tickets.filter(item => item.selected).length;
  }
  editTicket(id) {
    this.ticketStateService.setTicketRoutingId(id);
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/ticket/${id}`;
    window.open(url, '_blank');
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
  }
  deleteSelectedTickets() {
    this.confirmStateService.setConfirmAction(REMOVE_TICKETS_BILLABLE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Delete ticket';
    modalRef.componentInstance.message = `Are you sure you want to delete selected tickets?`;
    this.ticketsForRemove = this.billableProfile.tickets.filter(item => item.selected);
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
  }
  deleteTicket(ticket) {
    this.confirmStateService.setConfirmAction(REMOVE_TICKET_BILLABLE);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = 'Delete Billable Item';
    modalRef.componentInstance.message = `Are you sure you want to remove the billable item?`;
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
  onFilterAfterAddTicket() {
    let index = this.filter.findIndex(item => item.filter !== '');
    let sort = this.filter[index].filter;
    let field = this.filter[index].field;
    this.sortBy.sortBy = field;
    if (field === 'closedAt') {
      if (sort === 'ASC') {
        this.onFilterСlosedAt();
      } else {
        this.onFilterСlosedAt();
        this.billableProfile.tickets.reverse();
      }
    }
    if (field === 'ticketNumber') {
      if (sort === 'ASC') {
        this.onFilterTicketNumber();
      } else {
        this.onFilterTicketNumber();
        this.billableProfile.tickets.reverse();
      }
    }
    if (field === 'subject') {
      if (sort === 'ASC') {
        this.onFilterSubject();
      } else {
        this.onFilterSubject();
        this.billableProfile.tickets.reverse();
      }
    }
    if (field === 'sum') {
      if (sort === 'ASC') {
        this.onFilterSum();
      } else {
        this.onFilterSum();
        this.billableProfile.tickets.reverse();
      }
    }
    this.sortBy.sortDirection = sort;
  }
  onFilter(field) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    let index = this.filter.findIndex(item => item.field === field);
    if (index > -1) {
      let sort = this.filter[index].filter;
      this.sortBy.sortBy = field;
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
      this.sortBy.sortDirection = this.filter[index].filter;
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
    this.leftPanelStateService.goToState('new-billable');
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
