import { Component, OnInit, Input, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { User } from '../../../users/class/user';
import { TicketsListService } from '../services/tickets-list.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ARCHIVE_USER } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { CrmCompanyJobType } from 'src/app/components/setting/crm-settings/crm-company-job-type/class/crm-company-job-type';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { UserDefaultSubscriptionAdd } from 'src/app/components/users/class/user-default-subscription-add';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { UserDefaultSubscription } from 'src/app/components/users/class/user-default-subscription';
import { UserCustomSubscription } from 'src/app/components/users/class/user-custom-subscription';
import { UserCustomerCompaniesDefaultSubscribtionAdd } from 'src/app/components/users/class/user-customer-companies-default-subscribtion-add';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';

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
  lastCompanyId: string = '';
  isOpenDropDown: boolean = false;
  userTypes: Array<CrmCompanyJobType> = [];
  @Input() set setCompanyId(value) {
    this.companyId = value;
    this.onGetUsers();
  };
  constructor(private usersStateService: UsersStateService,
    private usersService: UsersService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private usersRealTimeService: UsersRealTimeService,
    private crmStateService: CrmStateService,
    public ticketsListService: TicketsListService,) { }


  ngOnInit() {

    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_USER) this.onArchiveUser(this.usersStateService.getUserForArchive().id);
      }
    })
    this.sub.add(getConfirm);
    $(this.elRef.nativeElement).scroll(() => {
      if (!this.isOpenDropDown) return;
      let list = this.elRef.nativeElement.querySelectorAll('.dropdown-menu-qt');
      list.forEach(element => {
        $(element).css({ display: 'none' });
      });
      this.isOpenDropDown = false;
    });
    this.getJobTypeList();
    this.onInitSubscribe();
  }
  private onInitSubscribe() {
    setTimeout(() => {

      let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
        if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED') {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === newChange.data.userId);
          if (reqIndex > -1) {
            let index = this.reqUsers[reqIndex].customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
            if (index > -1) this.reqUsers[reqIndex].customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          }
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) {
            let index = this.users[userIndex].customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
            if (index > -1) this.users[userIndex].customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          }
          this.cd.detectChanges();
        }
        if (newChange.action === 'CUSTOM_SUBSCRIPTION_SAVED') {
          const reqIndex = this.reqUsers.findIndex((item) => item.id === newChange.data.userId);
          if (reqIndex > -1) this.reqUsers[reqIndex].changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          const userIndex = this.users.findIndex((item) => item.id === newChange.data.userId);
          if (userIndex > -1) this.users[userIndex].changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          this.cd.detectChanges();
        }
      });
      this.sub.add(stompClient);

    }, 3000);
  }
  getJobTypeList() {
    if (this.crmStateService.getJobTypeList().length === 0) {
      this.crmStateService.onInitGetJobTypeList();
    } else {
      this.userTypes = this.crmStateService.getJobTypeList();
    }
    let onGetJobType = this.crmStateService.onGetJobType.subscribe(data => {
      this.userTypes = data;
    })
    this.sub.add(onGetJobType);
  }
  onOpenDropDown(input, dropDown) {
    let list = this.elRef.nativeElement.querySelectorAll('.dropdown-menu-qt');
    list.forEach(element => {
      $(element).css({ display: 'none' });
    });
    let viewportOffset = input.getBoundingClientRect();
    $(dropDown).css({ top: `${viewportOffset.y}px`, left: `${viewportOffset.x - $(dropDown).height()}px`, display: 'block' });
    this.isOpenDropDown = true;
  }
  hiddenDropDown(data) {
    $(data).css({ display: 'none' });
  }
  public onGetUsers() {
    if (this.companyId && this.lastCompanyId !== this.companyId) {
      this.lastCompanyId = this.companyId;
    } else {
      return;
    }
    let users = this.usersStateService.getAllUsers().filter(item => item.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.companyId) && item.accountType !== 'TECH' && !item.deletedAt);
    if (users) users.sort((a, b) => (this.ticketsListService.getUserName(a).toLowerCase() > this.ticketsListService.getUserName(b).toLowerCase()) ?
      1 : ((this.ticketsListService.getUserName(b).toLowerCase() > this.ticketsListService.getUserName(a).toLowerCase()) ? -1 : 0));
    this.users = (users) ? users : [];
    this.reqUsers = (users) ? users : [];
  }
  private onArchiveUser(id) {
    let archiveUser = this.usersService.onArchiveUsers(id).subscribe(data => {
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
  changeUserRole(user, jobTypeId) {
    this.usersService.changeUserRole(user.id, jobTypeId).subscribe(data => {

    })
  };
  isSeletedSubscription(user, field) {
    return user.defaultSubscriptions[field].enabled;
  }
  onChangeSubscriptions(field, user) {
    let subscriptions = JSON.parse(JSON.stringify(user.defaultSubscriptions));
    subscriptions[field].enabled = !subscriptions[field].enabled;
    this.usersService.setSubscriptions({
      ...new UserCustomerCompaniesDefaultSubscribtionAdd(subscriptions.ticketSubscription.enabled,
        subscriptions.ticketManagerSubscription.enabled,
        subscriptions.invoiceSubscription.enabled,
        user.id,
        this.companyId)
    }).subscribe(data => {

    })
  }

  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '/company/default/logo.jpg';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / contain no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / contain no-repeat`;
    } else {
      return '/company/default/logo.jpg';
    }
  };
  archiveUser(user) {
    this.confirmStateService.setConfirmAction(ARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });

    modalRef.componentInstance.message = `Do you want to archive ${user.firstName + ' ' + user.lastName}`;
    this.usersStateService.setUserForArchive(user);
  }
  onSearch(event) {
    if (event.target.value === "") {
      this.users = JSON.parse(JSON.stringify(this.reqUsers));
      return;
    }
    this.users = this.reqUsers.filter(item => this.ticketsListService.getUserName(item).toLowerCase().includes(event.target.value.toLowerCase()));
  }
  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
