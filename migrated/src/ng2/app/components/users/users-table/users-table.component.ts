import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { User } from '../class/user';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ARCHIVE_USER, DEARCHIVE_USER } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from '../../shared/alert/alert.component';
import { UsersTableService } from './services/users-table.service';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  providers: [UsersTableService]
})
export class UsersTableComponent implements OnInit {
  @Input() user: User;
  @Input() showArchivedUsers: boolean;
  companies: Array<Company> = [];
  currentUser: CurrentUser = new CurrentUser();
  constructor(private companiesStateService: CompaniesStateService, private usersService: UsersService,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private draftEmailStateService: DraftEmailStateService,
    private usersTableService: UsersTableService,
    private elRef: ElementRef) { }

  onChangeSubscriptions(data) {
    this.usersService.setSubscriptions(data).subscribe(res => {

      this.user.subscription = data;
    })
  }
  getNameForAvatar() {
    if (!this.user.avatar) return `${(this.user.firstName) ? this.user.firstName[0].toUpperCase() : ''}${(this.user.lastName) ? this.user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getUserName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  getContact() {
    let str = '';
    if (this.user.phoneNumbers && this.user.phoneNumbers.length && this.user.phoneNumbers[0] && this.user.phoneNumbers[0].number) str += this.user.phoneNumbers[0].number;
    if (this.user.phoneNumbers && this.user.phoneNumbers.length && this.user.phoneNumbers[1] && this.user.phoneNumbers[1].number) str += '<br/>' + this.user.phoneNumbers[1].number;
    return str;
  }
  getUserCompanyName() {
    if (this.user.company.isDefault) return '';
    let index = this.companies.findIndex(item => item.id === this.user.company.id);
    return (index > -1) ? this.companies[index].name : '';
  }
  getUserAvatarUrl() {
    if (!(this.user && this.user.avatar)) return '';

    if (this.user.id) {
      return `url(${'/users/' + (this.user.id || 'default') + '/image' + (this.user.avatar ? '.jpg?t=' + this.user.avatar.updatedAt :
        '')}) 0% 0% / cover no-repeat`
    } else if (this.user.avatar && this.user.avatar.origin && this.user.avatar.origin.id) {
      return `url(/file/${(this.user.avatar.origin.id)}.jpg) 0% 0% / cover no-repeat`;
    } else {
      return 'url(/users/default/image.jpg) 0% 0% / cover no-repeat';
    }
  };
  edit() {

    this.usersStateService.setUserForEdit(this.user);
    this.usersStateService.onOpenEditAsige();
  }
  ngOnInit() {

    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;

    })
    this.currentUser = this.usersStateService.getCurrentUser();

    //this.sub.add(getOnCompanies);
  }
  delete() {
    if (this.user.isContact) {
      const modalRef = this.modalService.open(AlertComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `You cannot archive primary contact user`;
      return;
    }
    if (this.usersTableService.getUsersCount(this.usersStateService.getAllUsers(), this.user.company.id, this.showArchivedUsers) === 1) {
      const modalRef = this.modalService.open(AlertComponent, { windowClass: 'xs-modal user-modal' });
      modalRef.componentInstance.message = `You cannot archive all users. At least one must remain.`;
      return;
    }
    this.confirmStateService.setConfirmAction(ARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });

    modalRef.componentInstance.message = `Do you want to archive ${this.user.firstName + ' ' + this.user.lastName}`;
    this.usersStateService.setUserForArchive(this.user);
  }
  showUserDetails() {

    this.elRef.nativeElement.querySelector('.new-users-content__list--item').classList.toggle('show-details');
  }
  restore() {
    this.confirmStateService.setConfirmAction(DEARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });

    modalRef.componentInstance.message = `Do you want to restore ${this.user.firstName + ' ' + this.user.lastName}`;
    this.usersStateService.setUserForDeArchive(this.user);
  }
  onSelectUser(event) {

    if (event.target.checked) {
      this.draftEmailStateService.addSelectedUser(this.user);
    } else {
      let list = this.draftEmailStateService.getSelectedUsers();
      let index = list.findIndex(item => item.id === this.user.id);
      if (index > -1) this.draftEmailStateService.removeSelectedUser(index);
    }

  }
  public trackById(index, item) {
    return item.id;
  }
}
