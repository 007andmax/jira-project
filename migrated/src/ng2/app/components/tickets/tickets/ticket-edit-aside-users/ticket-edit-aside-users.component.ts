import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { User } from '../../../users/class/user';
import { TicketsListService } from '../services/tickets-list.service';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ARCHIVE_USER } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-edit-aside-users',
  templateUrl: './ticket-edit-aside-users.component.html',
  styleUrls: ['./ticket-edit-aside-users.component.scss'],
  providers: [TicketsListService]
})
export class TicketEditAsideUsersComponent implements OnInit, OnDestroy {
  companyId: string;
  users: Array<User> = [];
  reqUsers: Array<User> = [];
  showPrivilege: boolean = false;
  showSubscription: boolean = false;
  sub: Subscription = new Subscription();
  lastCompanyId:string = '';
  @Input() set setCompanyId(value) {
    this.companyId = value;
    this.onGetUsers();
  };
  constructor(private usersStateService: UsersStateService,
    private usersService: UsersService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public ticketsListService: TicketsListService, ) { }


  ngOnInit() {
  
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_USER) this.onArchiveUser(this.usersStateService.getUserForArchive().id);
      }
    })
    this.sub.add(getConfirm);
  }
  public onGetUsers() {
    if (this.companyId && this.lastCompanyId !== this.companyId ) {
      this.lastCompanyId = this.companyId;
    } else {
      return;
    }
    let users = this.usersStateService.getAllUsers().filter(item => item.company.id === this.companyId && item.accountType !== 'TECH' && !item.deletedAt);
    this.users = (users) ? users : [];
    this.reqUsers = (users) ? users : [];
    console.log("users", users);
  }
  private onArchiveUser(id) {
    let ids = [];
    ids.push(id);
    let archiveUser = this.usersService.onArchiveUsers(ids).subscribe(data => {
      let index = this.users.findIndex(item => item.id === id);
      if (index > -1) this.users.splice(index, 1);
      let indexReq = this.reqUsers.findIndex(item => item.id === id);
      if (indexReq > -1) this.reqUsers.splice(indexReq, 1);
    })
    this.sub.add(archiveUser);
  }
  sendEmail(user) {
    window.open("mailto:" + user.primaryEmail, '_parent');
  }
  changeUserRole(user, userRole) {
    this.usersService.changeUserRole(user.id, userRole).subscribe(data => {

    })
  };
  onChangeSubscriptions(field, user) {
    let subscription = JSON.parse(JSON.stringify(user.subscription));
    subscription[field] = !subscription[field];
    this.usersService.setSubscriptions(subscription).subscribe(res => {

      user.subscription = subscription;
    })
  }
  archiveUser(user) {
    this.confirmStateService.setConfirmAction(ARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });

    modalRef.componentInstance.message = `Do you want to archive ${user.firstName + ' ' + user.lastName}`;
    this.usersStateService.setUserForArchive(user);
  }
  onSearch(event) {
    if (event.target.value === "") {
      this.users = JSON.parse(JSON.stringify(this.reqUsers));
      return;
    }
    this.users = this.reqUsers.filter(item => this.ticketsListService.getUserName(item).toLowerCase().includes(event.target.value));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
