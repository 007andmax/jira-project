import { Component, OnInit, Input } from '@angular/core';
import { User } from '../class/user';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
 
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ARCHIVE_USER } from 'src/ng2/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from '../../shared/alert/alert.component';
import { UsersTableService } from './services/users-table.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  providers: [UsersTableService]
})
export class UsersTableComponent implements OnInit {
  @Input() user: User;
  @Input() showArchivedUsers:boolean;
  companies: Array<Company> = [];
  currentUser: CurrentUser = new CurrentUser();
  constructor(private companiesStateService: CompaniesStateService, private usersService: UsersService,
    private usersStateService: UsersStateService,  
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal, 
    private usersTableService:UsersTableService) { }

  onChangeSubscriptions(data) {
    this.usersService.setSubscriptions(data).subscribe(res => {
      console.log('res', res);
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
    if (this.user.avatar && this.user.avatar.origin && this.user.avatar.origin.id) {
      return '/file/' + (this.user.avatar.origin.id) + '.jpg';
    }
    return '';
  };
  edit() {
    console.log('egegegege');
    this.usersStateService.setUserForArchive(this.user);
    this.usersStateService.onOpenEditAsige();
  }
  ngOnInit() {
    if (!this.user.firstName) console.log('user', this.user);
    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;

    })
    this.currentUser = this.usersStateService.getCurrentUser();
    
    //this.sub.add(getOnCompanies);
  }
  delete() {
    if (this.user.isContact) {
      const modalRef = this.modalService.open(AlertComponent, { windowClass: 'xs-modal' });
      modalRef.componentInstance.message = `You cannot archive primary contact user`;
      return;
    }
     if (this.usersTableService.getUsersCount(this.usersStateService.getAllUsers(),this.user.company.id,this.showArchivedUsers) === 1)
    {
      const modalRef = this.modalService.open(AlertComponent, { windowClass: 'xs-modal' });
      modalRef.componentInstance.message = ` U can't archive all users. At least one must remain.`;
      return;
    }
    this.confirmStateService.setConfirmAction(ARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });

    modalRef.componentInstance.message = `Do you want to archive ${this.user.firstName + ' ' + this.user.lastName}`;
    this.usersStateService.setUserForArchive(this.user);
  }

}
