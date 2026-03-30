import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Ticket } from 'src/app/components/tickets/class/ticket';
import { User } from 'src/app/components/users/class/user';
import { TicketsListService } from '../../../services/tickets-list.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketsPermissionsService } from '../../../ticket-edit-aside/services/tickets-permissions.service';
import { NgbDropdown, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tickets-table-item-assigned-user',
  templateUrl: './tickets-table-item-assigned-user.component.html',
  styleUrls: ['./tickets-table-item-assigned-user.component.scss'],
  providers: [TicketsPermissionsService]

})
export class TicketsTableItemAssignedUserComponent {
  @Input() ticket: Ticket;
  @Input() assignedUser: User;
  users: Array<User> = [];
  @Input() reqUserList: Array<User> = [];
  @Input() listColorNoAvatar = [];
  @Input() indexNoAvatar: number = 0;
  @Input() listAssignedUser: Array<CurrentUser> = [];
  @ViewChildren("pM", { emitDistinctChangesOnly: false }) pM: QueryList<NgbPopover>;
  @ViewChild("assignedUserDp", { static: false }) assignedUserDp: NgbDropdown;
  constructor(public ticketsListService: TicketsListService,
    public usersStateService: UsersStateService,
    private ticketsService: TicketsService,
    public ticketsPermissionsService: TicketsPermissionsService,
    private appStateService: AppStateService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit() {
    this.users = JSON.parse(JSON.stringify(this.reqUserList));
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}`;
    return '';
  }
  onCloseDropDown(data, input) {
    input.value = "";
    this.users = JSON.parse(JSON.stringify(this.reqUserList));
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  onSearchUser(event) {
    if (event.target.value.length > 0) {
      this.users = this.reqUserList.filter(item => (`${item.firstName} ${item.lastName}`).toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.users = JSON.parse(JSON.stringify(this.reqUserList));
    }
  }
  selectAssignedUser(data, input) {
    let find = this.listAssignedUser.find(item => item.id === data.id);
    if (!find) {
      this.listAssignedUser.push(data);
    } else if (this.listAssignedUser.length > 1) {
      let index = this.listAssignedUser.findIndex(item => item.id === data.id);
      this.listAssignedUser.splice(index, 1);
    }
    if (this.listAssignedUser.length > 0 && !this.checkAssignedUser()) {
      let ids = this.listAssignedUser.map(item => {
        return item.id;
      })
      this.ticketsService.addAssignUsers(this.ticket.id, ids).subscribe(data => {
        this.toastrService.success("The assignee list has been changed");
        this.appStateService.changeDetectorRef();
      })
    }

  }
  private checkAssignedUser() {
    let listAssignedUser = [];
    if (this.ticket.assignedUserId) listAssignedUser.push(this.usersStateService.getAllUsers().find(item => item.id === this.ticket.assignedUserId));
    if (this.ticket.multiAssignedUsers) listAssignedUser = [...listAssignedUser, ...this.usersStateService.getAllUsers().filter(item => this.ticket.multiAssignedUsers.some(user => user.id == item.id)).map(item => new CurrentUser(item))];
    if (listAssignedUser.length != this.listAssignedUser.length) return false;
    for (let i = 0; i < listAssignedUser.length; i++) {
      let find = this.listAssignedUser.find(item => item.id === listAssignedUser[i].id);
      if (!find) return false;
    }
    return true;
  }
  isSelected(data) {
    return this.listAssignedUser.find(item => item.id === data.id);
  }
  public trackById(index, item) {
    return item.id;
  }
  getUserById(id) {
    return this.usersStateService.getAllUsers().find(item => item.id == id);
  }
  showDropDown() {
    if (this.ticketsPermissionsService.isActionVisible('update', this.ticket, null, null)) this.assignedUserDp.open();
  }

  ngOnDestroy(): void {

  }
  getStyleNetAvatar(i) {
    return `${18 * i}px`;
  }
}
