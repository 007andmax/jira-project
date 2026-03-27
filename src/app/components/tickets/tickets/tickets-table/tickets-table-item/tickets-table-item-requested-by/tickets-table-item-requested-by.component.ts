import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../../services/tickets-list.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { USERS } from 'src/app/const/emails';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { Ticket } from 'src/app/components/tickets/class/ticket';

@Component({
  selector: 'app-tickets-table-item-requested-by',
  templateUrl: './tickets-table-item-requested-by.component.html',
  styleUrls: ['./tickets-table-item-requested-by.component.scss'],
  providers: [TicketsListService]
})
export class TicketsTableItemRequestedByComponent {
  @Input() ticket: any;
  @Input() requestedUser: User;
  @Input() indexNoAvatar: number = 0;
  @Input() listColorNoAvatar = [];
  typeDropDown: string;
  taskType: string;
  @ViewChild('dp', { static: true }) dp: NgbDropdown;
  constructor(public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    private ticketsStateService: TicketsStateService,
    private companiesState: CompaniesStateService,
    private draftEmailStateService: DraftEmailStateService,
    public tasksStateService: TasksStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    public cd: ChangeDetectorRef,
  ) { }

  onToggleDroPDown(data) {
    this.usersStateService.isOpenDropDownRequestedBy = data;
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getPrimaryPhoneNumber() {
    return this.requestedUser.phoneNumbers ? this.requestedUser.phoneNumbers.find(item => item.priority == 0).number : null;
  }
  onSelectCompanyInfo(companyInfo) {
    this.dp.close();
    this.ticketsStateService.addTicketWithSelectedUser.next({
      company: this.companiesState.getCompanies().find(item => item.id == companyInfo.companyId),
      customerCompaniesInfo: companyInfo,
      user: this.requestedUser.accountType == "TECH" ? null : this.requestedUser,
      techUser: this.requestedUser.accountType == "TECH" ? this.requestedUser : this.usersStateService.getCurrentUser()
    })
  }
  copy(value) {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = value
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  sendEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.addSelectedUser(this.requestedUser);
    this.draftEmailStateService.toggleAsideForAdd();
    this.cd.markForCheck();
  }
  createTask(taskType) {
    this.typeDropDown = "TASK";
    this.taskType = taskType;
    console.log("this.requestedUser", this.requestedUser);
    if (this.requestedUser.accountType == "CLIENT" && this.requestedUser.customerCompaniesInfo.length > 1) this.dp.open();
    if (this.requestedUser.accountType == "CLIENT" && this.requestedUser.customerCompaniesInfo.length == 1) this.onSelectCompanyInfoForCreateTask(this.requestedUser.customerCompaniesInfo[0]);
    if (this.requestedUser.accountType == "TECH") this.onSelectCompanyInfoForCreateTask({ companyId: this.ticket ? this.ticket.companyId : null });
  }
  onSelectCompanyInfoForCreateTask(item) {
    console.log("item", item);
    this.dp.close();
    let step = 1;
    let serviceExpenseDurationPickerInterval = this.companiesState.getCurrentCompany() ? this.companiesState.getCurrentCompany().serviceExpenseDurationPickerInterval : '';
    if (serviceExpenseDurationPickerInterval === 'ONE_MINUTE') step = 1;
    if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') step = 5;
    if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') step = 10;
    if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') step = 15;
    let startDate = new Date();
    //startDate.setMinutes(Math.ceil(startDate.getMinutes() / step) * step);
    let endDate = new Date(startDate.getTime() + step * 60000);

    this.tasksStateService.openAddAsideFromShortVersion({
      title: this.requestedUser.accountType == "TECH" ? (this.ticket ? `Ticket #${this.ticket.number} - ${this.ticket.subject}` : '') : `${this.taskType == 'To do' ? 'To do - ' : 'Meeting - '}${this.requestedUser.firstName} ${this.requestedUser.lastName}`,
      startDate: startDate.getTime(),
      description: this.requestedUser.accountType == "TECH" ? '' : `${this.requestedUser.firstName} ${this.requestedUser.lastName} <br>
      ${this.requestedUser.primaryEmail} <br>
      ${this.getPrimaryPhoneNumber() ? this.getPrimaryPhoneNumber() : ''}`,
      endDate: endDate.getTime(),
      assignedUsersIds: [this.requestedUser.accountType == "TECH" ? this.requestedUser.id : this.usersStateService.getCurrentUser().id],
      type: this.taskType,
      taskStatus: "OPEN",
      companyId: item.companyId,
      associatedTicketId: undefined,
      dueDate: undefined,
      attachFileIds: [],
      ticket: this.ticket
    });
  }
  createTicket() {
    this.typeDropDown = "TICKET";
    if (this.requestedUser.customerCompaniesInfo.length > 1) this.dp.open();
    if (this.requestedUser.customerCompaniesInfo.length == 1) this.onSelectCompanyInfo(this.requestedUser.customerCompaniesInfo[0]);
    if (this.requestedUser.customerCompaniesInfo.length == 0 && this.requestedUser.accountType == "TECH") this.onSelectCompanyInfo({ companyId: this.ticket ? this.ticket.companyId : null, clientCompanyName: this.ticket ? this.companiesState.getCompanies().find(item => item.id == this.ticket.companyId).name : null });

  }
}
