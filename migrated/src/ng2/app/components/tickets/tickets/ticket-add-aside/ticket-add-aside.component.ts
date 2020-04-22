import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketAdd } from '../class/ticket-add';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TicketCreatedUser } from '../class/ticket-created-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';
import { TechUserItem } from '../../../shared/teh-users/class/tech-user-item';
import { TitleListType } from '../tickets-header/class/title-list-type';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { TicketValidate } from '../class/ticket-validate';
import { UploadAreaComponent } from '../../../shared/upload-area/upload-area.component';
import { NotificationStateService } from '../../../shared/notification/services/notification-state.service';



@Component({
  selector: 'app-ticket-add-aside',
  templateUrl: './ticket-add-aside.component.html',
  styleUrls: ['./ticket-add-aside.component.scss']
})
export class TicketAddAsideComponent implements OnInit {
  @ViewChild('userDP') userDP: SelectSearchComponent;
  @ViewChild('techUserDP') techUserDP: SelectSearchComponent;
  @ViewChild('deviceDP') deviceDP: SelectSearchComponent;
  @ViewChild('companyDP') companyDP: SelectSearchComponent;
  @ViewChild('uplaodFile') uplaodFile: UploadAreaComponent;
  actualNumber:string = '';
  opened = false;
  mode = 'edit';
  ticketAdd: TicketAdd = new TicketAdd();
  companies = [];
  devices = [];
  users = [];
  techUsersList = [];
  shareUsersList = [];
  listTechUsersForAssign: Array<TechUserItem> = [];
  ticketPriorities: Array<TitleListType> = [new TitleListType('Low Priority', 'LOW'),
  new TitleListType('Medium Priority', 'MEDIUM'),
  new TitleListType('High Priority', 'HIGH')];
  ticketValidate:TicketValidate= new TicketValidate();
  constructor(private ticketsStateService: TicketsStateService,
    private usersStateService: UsersStateService,
    private ticketsService:TicketsService,
    private devicesSateService: DevicesSateService,
    private notificationStateService: NotificationStateService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    private companiesState: CompaniesStateService, ) { }

  ngOnInit() {
    this.ticketsStateService.getOnActualNumber().subscribe(data => {
      this.actualNumber = data;
    })
    if (this.usersStateService.getAllUsers().length > 0) this.onGetTechUsers(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onGetTechUsers(data);
    })
    this.ticketsStateService.getToggleAddTicket().subscribe(data => {
      this.opened = !this.opened;
      console.log("this.opened", this.opened);
    })
    if (this.companiesState.getCompanies().length > 0) this.getClientsList(this.companiesState.getCompanies());
    let getOnCompanies = this.companiesState.getOnCompanies().subscribe((data) => {

      this.getClientsList(data);
    })
  }
  add() {
    if (this.ticketValidate.isValidate(this.ticketAdd)) {
      this.ticketAdd.onAddSharedUsers(this.shareUsersList);
      this.ticketsService.addTicket(this.ticketAdd).subscribe(data => {
        this.notificationStateService.oninitShowNotification("Ticket has been created");
this.closed();
      })
    }
   
  }
  closed() {
    this.ticketAdd = new TicketAdd();
    this.ticketValidate = new TicketValidate();
    this.shareUsersList = [];
    this.elRef.nativeElement.querySelector('#add-ticket-describe-issue').value = '';
    this.opened = false;
    this.deviceDP.clearClient();
    this.userDP.clearClient();
    this.techUserDP.clearClient();
    this.companyDP.clearClient();
    this.uplaodFile.onClearState();
    this.cd.detectChanges();

  }
  getPriorityLevel() {
    let fid = this.ticketPriorities.find(item => item.type === this.ticketAdd.priorityLevel);
    return `${(fid) ? fid.title : ''}`
  }
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.listTechUsersForAssign = this.getListTechUsersForAssign();
    console.log("this.listTechUsersForAssign", this.listTechUsersForAssign);
    console.log("this.shareUsersList", this.shareUsersList);
  }
  private getListTechUsersForAssign() {

    return [...this.techUsersList.map(item => {
      let user = new TechUserItem(item);
      return user;
    }), ...this.users.map(item => {
      return new TechUserItem(item)
    })];
  }
  onSelectCompany(item) {
    if (item) {
      this.ticketAdd.createdUser.setCompanyId(item.id);
      this.onGetUsers(this.usersStateService.getAllUsers().filter(user => user.company.id === item.id));
      this.onGetDevices(this.devicesSateService.getAllDevices()[item.id]);
      let list = this.users.filter(item => item.subscription && item.subscription.ticketManager);
      list = list.map(item => {
        let user = new TechUserItem(item);
        return user;
      });
      this.shareUsersList = list;
      this.ticketValidate.resetCompany();

      let selectedUser = this.techUsersList.find(user => user.id === this.ticketAdd.assignedUser);
      if (selectedUser) {
        let user = new TechUserItem(selectedUser);
        user.selected = true;
        this.shareUsersList.push(user);
      }
    } else {
      this.ticketAdd.createdUser = new TicketCreatedUser();
      this.ticketAdd.clearDeviceId();
      this.users = [];
      this.devices = [];
      this.shareUsersList = [];
    }
    this.deviceDP.clearClient();
    this.userDP.clearClient();
    this.cd.detectChanges();

    this.listTechUsersForAssign = this.getListTechUsersForAssign();

  }
  onSelectUser(item) {

    if (item) {
      if (this.ticketAdd.createdUser.id) this.removeShareUser(this.ticketAdd.createdUser.id);
      let indexhUser = this.users.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexhUser > -1) this.ticketAdd.createdUser.setUserData(this.users[indexhUser]);
      this.shareUsersList.push(new TechUserItem(this.users[indexhUser]));
      this.ticketValidate.resetClientUser();

    } else {
      this.removeShareUser(this.ticketAdd.createdUser.id);
      this.ticketAdd.createdUser.clearUserData();
    }
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
      }

    } else {
      this.removeShareUser(this.ticketAdd.assignedUser);
      this.ticketAdd.clearAssignedUser();
    }
  }
  onSelectDevice(item) {
    if (item) {
      this.ticketAdd.linkedAgentId = item.id;
    } else {
      this.ticketAdd.clearDeviceId();
    }
  }
  removeShareUser(id) {
    let index = this.shareUsersList.findIndex(shareUser => shareUser.id === id);
    if (index > -1) {
      this.shareUsersList.splice(index, 1);
    }
  }
  getTechUserList() {
    return this.techUsersList.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  getUserList() {
    return this.users.map(item => {
      return `${item.firstName} ${item.lastName}`
    }).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
      1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }
  onGetDevices(data) {
    this.devices = ((data) ? data : []).sort((a, b) => (a.hostName.toLowerCase() > b.hostName.toLowerCase()) ?
      1 : ((b.hostName.toLowerCase() > a.hostName.toLowerCase()) ? -1 : 0));
    console.log("this.devices", this.devices);
  }
  onGetUsers(data) {
    this.users = data.filter(item => {
      if (item.accountType !== 'TECH' && !item.deletedAt) {
        return item;
      }
    });

  }
  onChangeSubject() {
    this.ticketValidate.resetSubject();
  }
  onChangeFiles(ids) {
    this.ticketAdd.setAttachFileIds(ids);
    console.log("ids", ids);
  }
  onChangeShareUsers(data) {
    console.log("data", data);
    this.shareUsersList = JSON.parse(JSON.stringify(data));
  }
  public onPastNote(value) {
    this.ticketAdd.note = value;
  }
  private getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  public onChangeNote(event) {
    this.ticketAdd.note = event.target.value;
  }

   
  public trackByIndex(index, item) {
    return index;
  }
}
