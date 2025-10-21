import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketsPermissionsService } from '../../../ticket-edit-aside/services/tickets-permissions.service';
import { map } from 'jquery';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from 'src/app/components/tasks/class/task';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { TechUsersComponent } from 'src/app/components/shared/tech-users/tech-users.component';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_TASK_TICKET } from 'src/app/const/confirm';
import { TicketProfileTask } from '../../../class/ticket-profile-task';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { TicketProfileFormService } from '../../../ticket-edit-aside/class/ticket-profile-form-service';
import { TasksDatePickerComponent } from 'src/app/components/tasks/tasks-date-picker/tasks-date-picker.component';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';

@Component({
  selector: 'app-ticket-detail-tasks-item',
  templateUrl: './ticket-detail-tasks-item.component.html',
  styleUrls: ['./ticket-detail-tasks-item.component.scss']
})
export class TicketDetailTasksItemComponent {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Input() item: TicketProfileTask;
  listTypes = [new CompanySetting('Meeting', 'Meeting'),
  new CompanySetting('To do', 'To do'),
  new CompanySetting('Phone call', 'Phone call')];
  assignedUsers = [];
  listTechUsers = [];
  selectedType: CompanySetting;
  @Input() parseStartDate: Function;
  @ViewChild('techUsers', { static: true }) techUsers: TechUsersComponent;
  @ViewChild('dateDp', { static: true }) dateDp: TasksDatePickerComponent;
  sub: Subscription = new Subscription();
  constructor(public ticketsPermissionsService: TicketsPermissionsService,
    private usersStateService: UsersStateService,
    private tasksStateService: TasksStateService,
    private companiesStateService: CompaniesStateService,
    public tasksService: TasksService,
    public tasksRealTimeService: TasksRealTimeService,
    private ticketsService: TicketsService,
    private ticketStateService: TicketStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    public permissionsService: PermissionsService,
  ) { }

  ngOnInit() {
    this.selectedType = this.listTypes.find(item => item.value == this.item.type);
    this.dateDp.setEditDates(this.item.startDate, this.item.endDate);
    if (this.onGetTechUsers().length > 0) this.onSetAssignedUsers();
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onSetAssignedUsers();
    })
    this.sub.add(getOnUsers);
    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {
      if (data.data.id == this.item.id && data.action === 'TASK_EDITED') {
        this.assignedUsers = this.listTechUsers.filter(user => data.data.assignedUsersIds.some(assignedUser => assignedUser == user.id));
        this.techUsers.setEditUsers(this.assignedUsers);
        this.dateDp.setEditDates(data.data.startDate, data.data.endDate);
        this.selectedType = this.listTypes.find(item => item.value == data.data.type);
      }
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
  }
  onSetAssignedUsers() {
    this.listTechUsers = this.onGetTechUsers();
    this.assignedUsers = this.listTechUsers.filter(user => this.item.assignedUsersIds.some(assignedUser => assignedUser == user.id));
    this.techUsers.setUsersList(this.listTechUsers);
    this.techUsers.setEditUsers(this.assignedUsers);
  }
  onGetTechUsers() {
    return this.usersStateService.getAllUsers().filter(item => {
      if (item.accountType === 'TECH' && !item.deletedAt) {
        return item;
      }
    }).sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
  }
  onSelectType(data) {
    this.item.setType(data.value);
    this.save({ type: data.value });
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      let start = new Date(value.start);
      let end = new Date(value.end);
      this.item.startDate = value.start;
      this.item.endDate = value.end;
    } else {
      this.item.startDate = null;
      this.item.endDate = null;
    }
  }
  onCloseDatePicker(event) {
    if (event) this.save({
      startDate: this.item.startDate,
      endDate: this.item.endDate
    });
  }
  public onChangeDatePicker(data) {
    this.item.setStartDate(data.day, data.month, data.year, this.companiesStateService.getCurrentCompany().addresses[0].timeZone.timeOffset);
    this.save({ startDate: this.item.startDate });
  }
  public onChangeUser(data) {
    this.item.setAssignedUser(data.map(item => item.id));
    this.assignedUsers = data;
    this.save({ assignedUsersIds: this.item.assignedUsersIds });
  }
  onKeyEnter(event?) {
    console.log("event", event);
    event.blur();
  }
  editTitle() {
    this.save({ title: this.item.title });
  }
  openAside() {
    this.item.onInitEdit(false);
    this.tasksStateService.openEditAside(this.item);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  remove(item) {
    if (this.item.taskStatus == 'CLOSED') return;
    this.ticketStateService.setTaskForRemove(item);
    this.confirmStateService.setConfirmAction(REMOVE_TASK_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to delete this task?`;
  }
  setStatus(taskStatus) {
    if (this.item.hasInvoice || this.item.archivedAt) return;
    this.tasksService.changeStatusTask(this.item.id, taskStatus).subscribe(res => {
      this.item.taskStatus = taskStatus;
    });
  }
  save(data) {
    this.tasksService.editTask(this.item.id, data).subscribe(res => {

    })
  }
}
