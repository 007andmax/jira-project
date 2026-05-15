import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { TitleListType } from '../../../tickets-header/class/title-list-type';
import { Ticket } from 'src/app/components/tickets/class/ticket';
import { TicketStatus } from 'src/app/components/setting/ticket-settings-page/tickets-status/class/ticket-status';
import { StatusColor } from 'src/app/components/tickets/class/status-color';
import { ToastrService } from 'ngx-toastr';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { Subscription } from 'rxjs';
import { TicketsPermissionsService } from '../../../ticket-edit-aside/services/tickets-permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'app-tickets-table-item-status',
  templateUrl: './tickets-table-item-status.component.html',
  styleUrls: ['./tickets-table-item-status.component.scss'],
  providers: [TicketsPermissionsService]
})
export class TicketsTableItemStatusComponent {
  @Output() onChangedStatus = new EventEmitter<any>();
  @Input() type: string = 'TICKET';
  @Input() ticket: Ticket;
  @Input() ticketsStatus: Array<TicketStatus> = [];
  @Input() listColors: Array<StatusColor> = [];
  selectedTicketStatus: TitleListType;
  list: Array<TitleListType> = [new TitleListType('In Progress', 'IN_PROGRESS'),
  new TitleListType('On Hold', 'ON_HOLD'),
  new TitleListType('Pending Review', 'PENDING_REVIEW')];
  sub: Subscription = new Subscription();
  constructor(public ticketsService: TicketsService,
    public toastrService: ToastrService,
    public appStateService: AppStateService,
    public ticketsStateService: TicketsStateService,
    public ticketsPermissionsService: TicketsPermissionsService,
    public customerPortalStateService: CustomerPortalStateService,
    public cd: ChangeDetectorRef,
    public usersStateService: UsersStateService,
  ) { }
  ngOnInit() {
    this.ticketsStatus = this.ticketsStateService.getTicketsStatus();
    this.setList();
    let onGetTicketsStatus = this.ticketsStateService.onGetTicketsStatus.subscribe(data => {
      this.ticketsStatus = data
      this.setList();
    })
    this.sub.add(onGetTicketsStatus);
    let getOnUpdateTicket = this.ticketsStateService.getOnUpdateTicket().subscribe(data => {
      this.setList();
      this.cd.detectChanges();
    })
    this.sub.add(getOnUpdateTicket);
  }
  setList() {
    this.list = [];
    this.ticketsStatus.forEach(item => {
      if (item.name !== 'COMPLETED' && item.name !== 'UNASSIGNED') this.list.push(new TitleListType(this.parseStatus(item.name), item.name));
    })
    console.log("this.ticketsStatus", this.ticketsStatus);
    this.selectedTicketStatus = this.list.find(item => item.type == (this.ticket.customStatus ? this.ticket.customStatus : this.ticket.status));
    if (this.ticket.status === null) this.selectedTicketStatus = new TitleListType(this.parseStatus("UNASSIGNED"), "UNASSIGNED");
    if (this.ticket.status === "COMPLETED") this.selectedTicketStatus = new TitleListType(this.parseStatus("COMPLETED"), "COMPLETED");
    this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
      1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
  }
  claimTicket() {
    this.ticketsService.addAssignUsers(this.ticket.id, [this.usersStateService.getCurrentUser().id]).subscribe(data => {

    })
  }
  parseStatus(name) {
    if (name === "IN_PROGRESS") return "In progress";
    if (name === "ON_HOLD") return "On hold";
    if (name === "COMPLETED") return "Completed";
    if (name === "UNASSIGNED") return "Unassigned";
    if (name === "PENDING_REVIEW") return "Pending Review";
    return name;
  }
  getStyleStatus(name) {
    let find = this.ticketsStatus.find(item => item.name == name);
    return {
      'border-color': (this.listColors.length > 0) ? this.listColors[find.color].textColor : null,
      'background-color': (this.listColors.length > 0) ? this.listColors[find.color].borderColor : null, 'color': (this.listColors.length > 0) ? this.listColors[find.color].textColor : null
    }
  }
  public isSelected(item) {
    return this.selectedTicketStatus && this.selectedTicketStatus.type == item.type;
  }
  changeTicketStatus(item) {
    this.selectedTicketStatus = item;
    this.ticketsService.changeStatus(this.ticket.id, item.type).subscribe((data: any) => {
      if (item.type == 'ON_HOLD' || item.type == 'IN_PROGRESS') {
        this.ticket.status = item.type;
        this.ticket.customStatus = null;
      } else {
        this.ticket.status = 'IN_PROGRESS';
        this.ticket.customStatus = item.type
      }
      this.toastrService.success(`The tickets “${this.ticket.number}” status has been changed`);
      this.appStateService.changeDetectorRef();
      this.onChangedStatus.emit(null);
    })

  }
}
