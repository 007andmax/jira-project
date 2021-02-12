import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { USERS } from 'src/ng2/app/const/emails';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
import { UsersHeaderService } from './services/users-header.service';
import { User } from '../class/user';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ARCHIVE_USER, ARCHIVE_USERS } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { TicketsFilterComponent } from '../../tickets/tickets/tickets-header/tickets-filter/tickets-filter.component';
import { UsersFilterComponent } from './users-filter/users-filter.component';



@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss'],
  providers: [UsersHeaderService]
})
export class UsersHeaderComponent implements OnInit, OnDestroy {
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAllUser = new EventEmitter<any>();
  @Input() set users(value: Array<User>) {
    this._users = value;
  }
  _users: Array<User> = [];
  @Input() count: number = 0;
  @ViewChild('filter') filter: UsersFilterComponent;
  countFilter: number = 0;
  toggleFilter: boolean = true;
  currentUser: CurrentUser = new CurrentUser();
  constructor(private usersStateService: UsersStateService,
    private draftEmailStateService: DraftEmailStateService,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private usersService: UsersService,
    private usersHeaderService: UsersHeaderService) {
  }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.setSelectedUser(this._users.filter(item => item.selected));
    this.draftEmailStateService.toggleAsideForAdd();
  }
  delete() {

    this.confirmStateService.setConfirmAction(ARCHIVE_USERS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });

    if (this._users.filter(item => item.selected).length === 1) {
      let user = this._users.filter(item => item.selected)[0];
      modalRef.componentInstance.message = `Do you want to archive ${user.firstName + ' ' + user.lastName}`;
    } else {
      modalRef.componentInstance.message = `Do you want to archive users?`;
    }
    this.usersStateService.setUsersForArchive(this._users.filter(item => item.selected));
  }

  isExistArchiveUser() {
    return this._users.filter(item => item.selected).find(item => {
      let company = this.companiesStateService.getCompanies().find(companyItem => companyItem.id === item.company.id);
      return item.deletedAt || company.deletedAt
    });
  }
  isExistPrimaryContact() {
    return this._users.filter(item => item.selected).find(item => item.isContact);
  }
  toggleAllUser(data) {
    this.onSelectAllUser.emit(data);
  }
  getSelectedCount() {
    return this._users.filter(item => item.selected).length;
  }
  public onFilter(field) {
    this.onChangeFilterField.emit(field);
  }
  clearAll() {
    this.filter.onClearAll();
  }
  addUser() {
    this.usersStateService.onOpenAsige();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  ngOnDestroy(): void {
    this.usersHeaderService.onUnsubscribe();
  }
}
