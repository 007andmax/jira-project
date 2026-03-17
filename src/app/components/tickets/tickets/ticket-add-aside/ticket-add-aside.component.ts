import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { TicketAdd } from '../class/ticket-add';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketCreatedUser } from '../class/ticket-created-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TechUserItem } from '../../../shared/tech-users/class/tech-user-item';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketValidate } from '../class/ticket-validate';
import { UploadAreaComponent } from '../../../shared/upload-area/upload-area.component';
import { DevicesStateService } from 'src/app/states/devices/devices-state.service';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { AppService } from 'src/app/states/app/app.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddUsersNotifyComponent } from 'src/app/services/modal/modal-add-users-notify/modal-add-users-notify.component';
import { forkJoin, Subscription } from 'rxjs';
import { AddUsersNotifyStateService } from 'src/app/services/modal/modal-add-users-notify/state/add-users-notify-state.service';
import { USERS_TO_ADD_TICKET } from 'src/app/const/add-users-notify';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { TicketsPriority } from 'src/app/components/setting/ticket-settings-page/tickets-priority/class/tickets-priority';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { StatusColor } from '../../class/status-color';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { Device } from 'src/app/components/company-devices/class/device';
import { CompanyUsersDropDownComponent } from './company-users-drop-down/company-users-drop-down.component';
import { AssignedTicketUserComponent } from './assigned-ticket-user/assigned-ticket-user.component';
import { Company } from 'src/app/interfaces/company/company';
import { UsersDropDownComponent } from 'src/app/components/shared/users-drop-down/users-drop-down.component';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { User } from 'src/app/components/users/class/user';
import { CurrentUser } from 'src/class/current-user/current-user';



@Component({
  selector: 'app-ticket-add-aside',
  templateUrl: './ticket-add-aside.component.html',
  styleUrls: ['./ticket-add-aside.component.scss']
})
export class TicketAddAsideComponent implements OnInit, OnDestroy {
  @ViewChild('userDP', { static: false }) userDP: CompanyUsersDropDownComponent;
  @ViewChild('techUserDP', { static: false }) techUserDP: DropDownComponent;
  @ViewChild('deviceDP', { static: false }) deviceDP: DropDownComponent;
  @ViewChild('uplaodFile', { static: true }) uplaodFile: UploadAreaComponent;
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  @ViewChild('techUsersDp', { static: true }) techUsersDp: AssignedTicketUserComponent;
  @ViewChild('clientUserDP', { static: true }) clientUserDP: UsersDropDownComponent;
  actualNumber: string = '';
  opened = false;
  isAdd = false;
  toggleAddCompany: boolean = false;
  mode = 'edit';
  ticketAdd: TicketAdd = new TicketAdd();
  devices = [];
  users = [];
  techUsersList = [];
  namesTechUsersList = [];
  shareUsersList = [];
  selectedTechUser: CurrentUser;
  selectedUser: User;
  selectedCompany: Company;
  selectedCustomerCompany: UserCustomerCompaniesInfo;
  statusColors: Array<StatusColor> = [];
  listTechUsersForAssign: Array<TechUserItem> = [];
  ticketPriorities: Array<TicketsPriority> = [];
  ticketValidate: TicketValidate = new TicketValidate();
  sub: Subscription = new Subscription();
  constructor(private ticketsStateService: TicketsStateService,
    private usersStateService: UsersStateService,
    private ticketsService: TicketsService,
    public devicesStateService: DevicesStateService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    public appService: AppService,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    public customerPortalStateService: CustomerPortalStateService,
    private addUsersNotifyStateService: AddUsersNotifyStateService,
    private leftPanelService: LeftPanelService,
    private devicesService: DevicesService,
    private companiesState: CompaniesStateService,) { }


  ngOnInit() {
    if (this.selectedCompany) this.onGetDevices();
    this.ticketsService.getActualNumber().subscribe((data: any) => {
      this.actualNumber = data.number;
      this.ticketsStateService.onInitActualNumber(data.number);
    })
    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
    this.sub.add(getOnUsers);
    let onChangeUsers = this.usersStateService.onChangeUsers.subscribe((data) => {
      this.onGetTechUsers(this.usersStateService.getAllUsers());
    })
    this.sub.add(onChangeUsers);
    let getToggleAddTicket = this.ticketsStateService.getToggleAddTicket().subscribe(data => {
      this.opened = !this.opened;
      if (this.opened) {
        this.getTicketPriority();
        this.getColors();
      }
    })
    this.sub.add(getToggleAddTicket);
    let addTicketWithSelectedUser = this.ticketsStateService.addTicketWithSelectedUser.subscribe(data => {
      this.selectedCompany = data.company;
      this.selectedCustomerCompany = data.customerCompaniesInfo;
      this.selectedUser = data.user;
      this.selectedTechUser = data.techUser;
      this.opened = true;
      this.getTicketPriority();
      this.getColors();
      this.onSelectTechUser(this.getNameSelectedTechUser());
      if (this.selectedUser && this.selectedCustomerCompany) this.onSelectUser(this.selectedUser, this.selectedCustomerCompany);
    })
    this.sub.add(addTicketWithSelectedUser);
    let onChangeAssignedUser = this.addUsersNotifyStateService.onChangeAssignedUser.subscribe(data => {
      if (this.addUsersNotifyStateService.getAction() === USERS_TO_ADD_TICKET) this.onChangeShareUsers(data);
    })
    this.sub.add(onChangeAssignedUser);
    let onDeviceUninstalled = this.devicesStateService.onChangeDevice.subscribe(newChange => {
      if (this.selectedCompany && this.selectedCompany.id == newChange.data.clientCompanyId) this.devicesStateService.changeDevice(this.devices, newChange);
    })
    this.sub.add(onDeviceUninstalled);
  }
  getColors() {
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        this.statusColors = data.map(item => new StatusColor(item.borderColor, item.textColor))
        this.ticketsStateService.onColorStatus(this.statusColors);
      })
    } else {
      this.statusColors = this.ticketsStateService.getListStatusColor();
    }
  }
  getTicketPriority() {
    if (this.ticketsStateService.getTicketsPriorities().length === 0) {
      this.ticketsService.getTicketsPriorities().subscribe((data: any) => {
        this.ticketPriorities = data.priorityLevels.map(item => new TicketsPriority(item)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        this.ticketsStateService.onSetTicketsPriorities(this.ticketPriorities);
        this.ticketAdd.priorityLevel = this.ticketPriorities.find(item => item.isDefault);
      })
    } else {
      this.ticketPriorities = this.ticketsStateService.getTicketsPriorities();
      this.ticketAdd.priorityLevel = this.ticketPriorities.find(item => item.isDefault);
    }
  }
  onAddAssignedUser() {
    const modalRef = this.modalService.open(ModalAddUsersNotifyComponent, { windowClass: 'quote-send-modal-users-to-notify', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.userList = this.listTechUsersForAssign;
    modalRef.componentInstance.selectedUsers = this.shareUsersList;
    this.addUsersNotifyStateService.setAction(USERS_TO_ADD_TICKET);
  }
  add() {
    if (this.ticketValidate.isValidate(this.ticketAdd)) {
      this.ticketAdd.onAddSharedUsers(this.shareUsersList);
      this.addBtn.setDisabled(true);
      this.ticketsService.addTicket(this.ticketAdd.getDataForRequest()).subscribe(data => {
        this.addBtn.setDisabled(false);
        this.ticketAdd.setAttachFileIds(null);
        this.closed();
      }, error => {
        this.addBtn.setDisabled(false);
      })
    }

  }
  closed() {
    if (this.ticketAdd.attachFileIds && this.ticketAdd.attachFileIds.length > 0) {
      forkJoin(
        this.ticketAdd.attachFileIds.map(item => this.companiesService.removeAttachment(item))
      ).subscribe(result => {

      });
    }
    this.selectedTechUser = null;
    this.selectedUser = null;
    this.selectedCustomerCompany = null;
    this.selectedCompany = null;
    this.ticketAdd = new TicketAdd();
    this.ticketValidate = new TicketValidate();
    this.shareUsersList = [];
    this.elRef.nativeElement.querySelector('#add-ticket-describe-issue').innerHTML = '';
    if (this.deviceDP) this.deviceDP.clearWithOutChanges();
    if (this.userDP) this.userDP.clearClient();
    if (this.clientUserDP) this.clientUserDP.clearWithOutChanges();
    if (this.techUserDP) this.techUserDP.clearClient();
    this.toggleAddCompany = false;
    this.opened = false;

    this.uplaodFile.onClearState();
    this.cd.detectChanges();

  }
  getPriorityLevel() {
    let fid = this.ticketPriorities.find(item => item.id === this.ticketAdd.priorityLevel.id);
    return `${(fid) ? fid.name : ''}`
  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.namesTechUsersList = this.getTechUserList();
    this.listTechUsersForAssign = this.getListTechUsersForAssign();
    this.techUsersDp.reset(this.listTechUsersForAssign);
  }
  private getListTechUsersForAssign() {

    return [...this.techUsersList.map(item => {
      let user = new TechUserItem(item);
      return user;
    }), ...this.users.map(item => {
      return new TechUserItem(item)
    })].map(item => {
      let find = this.shareUsersList.find(user => user.id === item.id);
      if (find) item.selected = true;
      return item;
    });
  }
  onSelectCompany(item) {
    if (item) {
      this.selectedCompany = item;
      this.selectedCustomerCompany = new UserCustomerCompaniesInfo();
      this.selectedCustomerCompany.clientCompanyName = item.name;
      this.selectedCustomerCompany.companyId = item.id;
      this.ticketAdd.createdUser.setCompanyId(item.id);
      this.onGetUsers(this.usersStateService.getAllUsers().filter(user => user.customerCompaniesInfo.some(clientCompany => clientCompany.companyId === item.id)));
      this.onGetDevices();
      let list = this.users.filter(user => user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === item.id).defaultSubscriptions.ticketManagerSubscription.enabled);
      list = list.map(item => {
        let user = new TechUserItem(item);
        return user;
      });
      this.shareUsersList = list;
      this.shareUsersList.forEach(item => item.selected = true)
      this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
      this.ticketValidate.resetCompany();
    } else {
      this.selectedCompany = null;
      this.selectedCustomerCompany = null;
      this.ticketAdd.createdUser = new TicketCreatedUser();
      this.ticketAdd.clearDeviceId();
      this.users = [];
      this.devices = [];
      this.shareUsersList = [];
      this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
    }
    let selectedUser = this.techUsersList.find(user => user.id === this.ticketAdd.assignedUser);
    if (selectedUser) {
      let user = new TechUserItem(selectedUser);
      user.selected = true;
      this.shareUsersList.push(user);
      this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
    }
    if (this.deviceDP) this.deviceDP.clearClient();
    this.cd.detectChanges();
    this.listTechUsersForAssign = this.getListTechUsersForAssign();
    this.techUsersDp.reset(this.listTechUsersForAssign);
  }
  onSelectUser(selectedUser, customerCompany) {
    let shareUser = this.shareUsersList.find(item => item.id === this.ticketAdd.createdUser.id);
    if (selectedUser) {
      this.selectedUser = selectedUser;
      this.selectedCustomerCompany = customerCompany;
      this.onSelectCompany(this.companiesState.getCompanies().find(company => company.id === customerCompany.companyId));
      if (!(shareUser && shareUser.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === customerCompany.companyId) && shareUser.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === customerCompany.companyId).defaultSubscriptions.ticketManagerSubscription.enabled) && this.ticketAdd.createdUser.id) this.removeShareUser(this.ticketAdd.createdUser.id);
      let indexhUser = this.users.findIndex(user => user.id === selectedUser.id);
      if (indexhUser > -1) this.ticketAdd.createdUser.setUserData(this.users[indexhUser]);
      let findSharedUser = this.shareUsersList.find(item => item.id === this.users[indexhUser].id);
      if (!findSharedUser && this.users[indexhUser]) {
        let user = new TechUserItem(JSON.parse(JSON.stringify(this.users[indexhUser])));
        user.selected = true;
        this.shareUsersList.push(user);
      }
      this.ticketValidate.resetClientUser();
      this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
    } else {
      this.selectedUser = null;
      this.selectedCustomerCompany = null;
      this.ticketAdd.createdUser.clearUserData();
      this.onSelectCompany(null);
    }
    this.listTechUsersForAssign = this.getListTechUsersForAssign();
    this.techUsersDp.reset(this.listTechUsersForAssign);
  }
  onSelectClientUser(selectedUser) {
    let shareUser = this.shareUsersList.find(item => item.id === this.ticketAdd.createdUser.id);
    if (selectedUser) {
      if (!(shareUser && shareUser.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.selectedCompany.id) && shareUser.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === this.selectedCompany.id).defaultSubscriptions.ticketManagerSubscription.enabled) && this.ticketAdd.createdUser.id) this.removeShareUser(this.ticketAdd.createdUser.id);
      let indexhUser = this.users.findIndex(user => user.id === selectedUser.id);
      if (indexhUser > -1) this.ticketAdd.createdUser.setUserData(this.users[indexhUser]);
      let findSharedUser = this.shareUsersList.find(item => item.id === this.users[indexhUser].id);
      if (!findSharedUser && this.users[indexhUser]) {
        let user = new TechUserItem(JSON.parse(JSON.stringify(this.users[indexhUser])));
        user.selected = true;
        this.shareUsersList.push(user);
      }
      this.ticketValidate.resetClientUser();
      this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
    } else {
      this.ticketAdd.createdUser.clearUserData();
    }
    this.listTechUsersForAssign = this.getListTechUsersForAssign();
    this.techUsersDp.reset(this.listTechUsersForAssign);
  }
  onSelectTechUser(item) {
    if (item) {
      if (this.ticketAdd.assignedUser) this.removeShareUser(this.ticketAdd.assignedUser);
      let indexTechUser = this.techUsersList.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexTechUser > -1) {
        this.ticketAdd.assignedUser = this.techUsersList[indexTechUser].id;
        let user = new TechUserItem(this.techUsersList[indexTechUser]);
        user.selected = true;
        this.shareUsersList.push(user);
        this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
        this.selectedTechUser = this.techUsersList[indexTechUser];
      }

    } else {
      this.selectedTechUser = null;
      this.removeShareUser(this.ticketAdd.assignedUser);
      this.ticketAdd.clearAssignedUser();
    }
    this.listTechUsersForAssign = this.getListTechUsersForAssign();
    this.techUsersDp.reset(this.listTechUsersForAssign);
  }
  onSelectDevice(item) {
    if (item) {
      this.ticketAdd.linkedAgentId = item.deviceId;
    } else {
      this.ticketAdd.clearDeviceId();
    }
  }
  setPriorityLevel(item) {
    this.ticketAdd.priorityLevel = item;
  }
  removeShareUser(id) {
    let index = this.shareUsersList.findIndex(shareUser => shareUser.id === id);
    if (index > -1) {
      this.shareUsersList.splice(index, 1);
      this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
    }
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  getNameSelectedTechUser() {
    return this.selectedTechUser ? `${this.selectedTechUser.firstName} ${this.selectedTechUser.lastName}` : '';
  }

  onGetDevices() {
    this.ticketAdd.setPreloaderDevices(true);
    this.devicesService.getCompanyDevices(this.selectedCompany.id).subscribe((data: any) => {
      this.devices = (data && data[this.selectedCompany.id]) ? JSON.parse(JSON.stringify(data[this.selectedCompany.id])).filter(item => !item.isCustom).map(item => new Device(item)) : [];
      this.devices.sort((a, b) => (a.hostName.toLowerCase() > b.hostName.toLowerCase()) ?
        1 : ((b.hostName.toLowerCase() > a.hostName.toLowerCase()) ? -1 : 0));
      this.ticketAdd.setPreloaderDevices(false);
      if (this.deviceDP) this.deviceDP.reset(this.devices);
    });
  }
  onGetUsers(data) {
    this.users = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.clientUserDP.reset(this.users);
  }
  changeToggleAddCompany(data) {
    this.selectedCustomerCompany = null;
    this.selectedUser = null;
    this.selectedTechUser = null;
    this.toggleAddCompany = data;
    this.selectedCompany = null;
    this.ticketAdd.createdUser = new TicketCreatedUser();
    this.ticketAdd.clearDeviceId();
    this.users = [];
    this.devices = [];
    this.shareUsersList = [];
    this.techUsersDp.selectItemsWithOutChanges(this.shareUsersList);
    this.clientUserDP.clearWithOutChanges();
  }
  onChangeSubject() {
    this.ticketValidate.resetSubject();
  }
  onChangeFiles(ids) {
    /* if (this.ticketAdd.attachFileIds && this.ticketAdd.attachFileIds.length > ids.length) {
       this.ticketAdd.attachFileIds.forEach(item => {
         let find = ids.find(id => id.id === item);
         if (!find) {
           this.companiesService.removeAttachment(item).subscribe(data => {
 
           })
         }
       })
     }*/
    this.ticketAdd.setAttachFileIds(JSON.parse(JSON.stringify(ids.map(item => item.id))));
  }
  onChangeShareUsers(data) {
    let shareUsersList = JSON.parse(JSON.stringify(this.shareUsersList));
    this.shareUsersList = [];
    data.forEach(item => {
      let shareUser = shareUsersList.find(share => share.id === item.id);
      let user = new TechUserItem(JSON.parse(JSON.stringify(item)));
      user.setIndexNoAvatar(item.indexNoAvatar);
      if (shareUser && shareUser.selected) user.selected = true;
      if (user.accountType === "TECH") user.selected = true;
      this.shareUsersList.push(user);
    });
    this.cd.detectChanges();
  }
  public onPastNote(value) {
    this.ticketAdd.note = value;
  }

  public onChangeNote(event) {
    this.ticketAdd.note = event.target.innerHTML;
  }

  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
