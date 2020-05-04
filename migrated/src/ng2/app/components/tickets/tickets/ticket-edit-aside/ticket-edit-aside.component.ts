import { Component, OnInit, ElementRef } from '@angular/core';
import { TicketsStateService } from 'src/ng2/app/states/tickets/tickets-state.service';
import { TicketProfile } from '../class/ticket-profile';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import * as moment from "moment";
import { StatusColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/status-color';
import { TicketsColor } from '../../../left-panel/left-panel-tickets/tickets-status/class/tickets-color';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { TicketsService } from 'src/ng2/app/services/tickets/tickets.service';
import { DevicesSateService } from 'src/ng2/app/states/devices/devices-sate.service';
import { TicketsPermissionsService } from './services/tickets-permissions.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { TicketsListService } from '../services/tickets-list.service';
import { TicketStateService } from './services/ticket-state.service';
@Component({
  selector: 'app-ticket-edit-aside',
  templateUrl: './ticket-edit-aside.component.html',
  styleUrls: ['./ticket-edit-aside.component.scss'],
  providers: [TicketsListService]

})
export class TicketEditAsideComponent implements OnInit {
  ticketProfile: TicketProfile = new TicketProfile();
  opened = false;
  modeSubject = 'view';
  modeDescription = 'view';
  showAddAssignedUser = false;
 
  showPreloader: boolean = true;
  listColors: Array<StatusColor> = [];
  statusColor: TicketsColor;
  listAssignedUser: Array<CurrentUser> = [];
  lisUpdateUser: Array<CurrentUser> = [];

  constructor(private ticketsStateService: TicketsStateService,
    private ticketsService: TicketsService,
    private elRef: ElementRef,
    public ticketsListService:TicketsListService,
    private usersStateService: UsersStateService,
    private  ticketStateService:TicketStateService,
    private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.ticketsStateService.getOnOpenTicket().subscribe(data => {
      this.showPreloader = true;
    })
    this.ticketsStateService.getOnEditTicket().subscribe(data => {
      this.listAssignedUser = [];
      this.lisUpdateUser = [];
      this.ticketProfile = data;
      this.elRef.nativeElement.querySelector("#ticket-note").value = this.ticketProfile.note;
      // if (this.ticketProfile.note.length === 0) this.modeDescription = 'edit';
      if (this.ticketProfile.assignedUser) this.listAssignedUser.push(this.ticketProfile.assignedUser);
      if (this.ticketProfile.multiAssignedUsers) this.listAssignedUser = [...this.listAssignedUser, ...this.ticketProfile.multiAssignedUsers];
      this.lisUpdateUser = this.ticketProfile.updates.map(item => item.user);
      this.lisUpdateUser = [...this.listAssignedUser,...this.lisUpdateUser]
      this.lisUpdateUser = this.lisUpdateUser.filter((item,index) => this.lisUpdateUser.findIndex(user => user.id === item.id) === index);
      console.log("this.lisUpdateUser",this.lisUpdateUser);
      this.opened = true;
      this.showPreloader = false;
      this.ticketStateService.getServicesList(this.ticketProfile);
    })
    this.ticketsStateService.getOnInitColor().subscribe(data => {
      this.listColors = data;
    })
    this.ticketsStateService.getOnInitStatus().subscribe(data => {
      this.statusColor = data;
    })
  }
   

  onChangeTags(data) {
    this.ticketProfile.tags = data;

    let tags = this.ticketProfile.tags.map(item => {
      return {
        id: item.id,
        word: item.word,
        colorCode: 0,
        usedCounter: item.usedCounter,
      }
    })
    this.ticketsService.addTags(this.ticketProfile.id, tags).subscribe(res => {

    })


  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);

  }
  getUsersForUpdate() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
      let techusers = userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
      let clientUsers = userList.filter((item) => item.accountType === "CLIENT" && !item.deletedAt && item.company.id === this.ticketProfile.companyId);
    return [...techusers,...clientUsers];

  }
  toggleSubject() {
    this.modeSubject = (this.modeSubject === 'view') ? 'edit' : 'view';
    console.log("toggleSubject", this.modeSubject)
    if (this.modeSubject === 'view') this.onChangeSubjectNote();
  }
  toggleNote() {
    // this.modeDescription = (this.modeDescription === 'view') ? 'edit' : 'view';

    //if (this.modeDescription === 'edit') {
    if (this.elRef.nativeElement.querySelector("#ticket-note").value != this.ticketProfile.note) {
      this.onChangeSubjectNote();
      this.ticketProfile.note = this.elRef.nativeElement.querySelector("#ticket-note").value;
    }
    //  } 
  }
  onChangeSubjectNote() {
    this.ticketsService.changeSubjectNoteTicket(this.ticketProfile.id, this.ticketProfile.subject, this.ticketProfile.note).subscribe(data => {

    })
  }
 
  onSelectAssignedUser(data) {
    this.listAssignedUser = data;
  }
  onToggleAddAssignedUser() {
    this.showAddAssignedUser = !this.showAddAssignedUser;
    console.log("this.showAddAssignedUser", this.showAddAssignedUser);
    if (!this.showAddAssignedUser && this.listAssignedUser.length > 0) {
      let ids = this.listAssignedUser.map(item => {
        return item.id;
      })
      this.ticketsService.addAssignUsers(this.ticketProfile.id, ids).subscribe(data => {

      })
    }
  }
  claimTicket() {
    let currentUser = this.usersStateService.getCurrentUser();
    var indexUser = this.ticketProfile.multiAssignedUsers.findIndex(user => user.id === currentUser.id);
    var value = [];
    this.ticketProfile.multiAssignedUsers.forEach(user => {
      value.push(user.id);
    })

    if (this.ticketProfile.assignedUser && this.ticketProfile.assignedUser.id !== currentUser.id && indexUser === -1) {
      value.push(this.ticketProfile.assignedUser.id);
      value.push(currentUser.id);
    } else if (this.ticketProfile.assignedUser && this.ticketProfile.assignedUser.id !== currentUser.id && indexUser > -1) {
      value.push(this.ticketProfile.assignedUser.id);
    } else if (this.ticketProfile.assignedUser && this.ticketProfile.assignedUser.id === currentUser.id && indexUser === -1) {
      value.push(this.ticketProfile.assignedUser.id);
    } else if (!this.ticketProfile.assignedUser && indexUser === -1) {
      value.push(currentUser.id);
    }
    this.ticketsService.assignUserToTicket(this.ticketProfile.id, value.join(",")).subscribe(res => {

    })

  };
  getCompantName() {
    let find = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.companyId);
    return (find) ? find.name : '';
  }
  getNameCreateUser() {
    if (!this.ticketProfile.createdUser) return '';
    return `${this.ticketProfile.createdUser.firstName} ${this.ticketProfile.createdUser.lastName}`
  }

  
  getCreatAt() {
    let date = new Date(this.ticketProfile.createdAt);
    let hours = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
    let type = (date.getHours() >= 12) ? 'pm' : 'am';
    return `${moment(date).format('DD MMM YYYY')}, ${(hours < 10 ? '0' + hours : hours)}:${(date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()} ${type}`
  }
  getStyleStatus(field) {
    return { 'border-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null, 'background-color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].backgroundColor : null, 'color': (this.statusColor && this.listColors) ? this.listColors[this.statusColor[field]].borderColor : null }
  }
  parseTicketSource() {
    if (!this.ticketProfile.ticketSource) {
      return '';
    }
    var words = this.ticketProfile.ticketSource.split('_'),
      result = '';
    for (var i = 0, len = words.length; i < len; i++) {
      var word = words[i];
      result += word[0].toUpperCase() + word.slice(1).toLowerCase();
      if (i !== len - 1) {
        result += ' ';
      }
    }
    return result;
  };
  close() {
    this.ticketProfile = new TicketProfile();
    this.opened = false;
    this.modeSubject = 'view';
    this.modeDescription = 'view';
    this.showAddAssignedUser = false;
    this.showPreloader = true;
    this.listAssignedUser = [];
  }
  getClassType() {
    return `priority-icon ticket-edit-aside__ticket-subject-flag ${(this.ticketProfile.priorityLevel && this.ticketProfile.priorityLevel !== "MEDIUM") ? '--' + this.ticketProfile.priorityLevel.toLowerCase() : ''}`;
  }
  public trackByIndex(index, item) {
    return index;
  }
}
