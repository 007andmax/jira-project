import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketAdd } from '../class/ticket-add';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { TicketCreatedUser } from '../class/ticket-created-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { SelectSearchComponent } from '../../../shared/select-search/select-search.component';
import { TechUserItem } from '../../../shared/teh-users/class/tech-user-item';



@Component({
  selector: 'app-ticket-add-aside',
  templateUrl: './ticket-add-aside.component.html',
  styleUrls: ['./ticket-add-aside.component.scss']
})
export class TicketAddAsideComponent implements OnInit {
  @ViewChild('userDP') userDP: SelectSearchComponent;
  @ViewChild('deviceDP') deviceDP: SelectSearchComponent;
  opened = false;
  mode = 'edit';
  ticketAdd: TicketAdd = new TicketAdd();
  companies = [];
  devices = [];
  users = [];
  techUsersList = [];
  shareUsersList = [];
  listTechUsersForAssign: Array<TechUserItem> = [];
  constructor(private ticketsStateService: TicketsStateService,
    private usersStateService: UsersStateService,
    private devicesSateService: DevicesSateService,
    public cd: ChangeDetectorRef,
    private companiesState: CompaniesStateService, ) { }

  ngOnInit() {
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
  onGetTechUsers(data) {
    this.techUsersList = data.filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    });
    this.listTechUsersForAssign = this.getListTechUsersForAssign();
    console.log("this.listTechUsersForAssign",this.listTechUsersForAssign);
    console.log("this.shareUsersList",this.shareUsersList);
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
        user.selected = true;
        return user;
      });
      this.shareUsersList = list;

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
      let indexhUser = this.users.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexhUser > -1) this.ticketAdd.createdUser.setUserData(this.users[indexhUser]);
      this.shareUsersList.push(new TechUserItem(this.users[indexhUser]));

    } else {
      this.ticketAdd.createdUser.clearUserData();
    }
  }
  onSelectTechUser(item) {
    if (item) {
      let indexTechUser = this.techUsersList.findIndex(user => `${user.firstName} ${user.lastName}` === item);
      if (indexTechUser > -1) this.ticketAdd.assignedUser = this.techUsersList[indexTechUser].id;
    } else {
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
