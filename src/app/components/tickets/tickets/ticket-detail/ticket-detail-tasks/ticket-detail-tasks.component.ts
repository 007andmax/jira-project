import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClickOutsideDirective } from 'src/app/directives/click-otside/click-otside.directive';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketProfileTask } from '../../class/ticket-profile-task';
import * as moment from "moment";
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_TASK_TICKET } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketsRealTimeService } from 'src/app/states/tickets/tickets-real-time.service';
import { OnDestroy } from '@angular/core';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';
import { Task } from 'src/app/components/tasks/class/task';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';

@Component({
  selector: 'ticket-detail-tasks',
  templateUrl: './ticket-detail-tasks.component.html',
  styleUrls: ['./ticket-detail-tasks.component.scss']
})
export class TicketDetailTasksComponent implements OnInit, OnDestroy {
  showAdd: boolean = false;
  list: Array<TicketProfileTask> = [];
  addTask: TicketProfileTask = new TicketProfileTask();
  listTechUsers = [];
  sub: Subscription = new Subscription();
  @ViewChild('addTaskBtn', { static: false }) addTaskBtn: ClickOutsideDirective;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor(private ticketsService: TicketsService,
    private ticketStateService: TicketStateService,
    private confirmStateService: ConfirmStateService,
    private tasksService: TasksService,
    private ticketsRealTimeService: TicketsRealTimeService,
    public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    public ticketsPermissionsService: TicketsPermissionsService,
    public tasksRealTimeService: TasksRealTimeService,
    private usersStateService: UsersStateService,) { }

  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_TASK_TICKET) {
          this.onDelete();
        }
      }
    })
    this.sub.add(getConfirm);
    if (this.usersStateService.getAllUsers().length > 0) this.listTechUsers = this.getUsersForAssign();
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.listTechUsers = this.getUsersForAssign();
    })
    this.sub.add(getOnUsers);
    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {
      if (data.action === 'TASK_SAVED' && data.data.associatedTicketId == this.ticketProfile.id && !this.list.some(item => item.id == data.data.id)) {
        this.list.unshift(new TicketProfileTask(data.data));
      }
      if (data.action === 'TASK_EDITED') {
        let index = this.list.findIndex(item => item.id == data.data.id);
        if (index > -1) {
          this.list[index] = new TicketProfileTask(data.data);
        }
      }
      if (data.action === 'TASK_DELETED') {
        let index = this.list.findIndex(item => item.id == data.data);
        if (index > -1) {
          this.list.splice(index, 1);
        }
      }
      this.ticketStateService.setListTasks(this.list);
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
    this.setDefaultValueForAddTask();
  }
  public getTicketTasks(id) {
    this.ticketsService.getTicketTasks(id).subscribe((data: any) => {
      this.list = data.map(item => new TicketProfileTask(item))
      this.ticketStateService.setListTasks(this.list);
      this.cd.detectChanges();
    })
  }
  public filterByDate(value) {
    if (value.start !== '' && value.end !== '') {
      let startDate = new Date(value.start);
      let endDate = new Date(value.end);
      this.addTask.startDate = value.start;
      this.addTask.endDate = value.end;
    } else {
      this.addTask.resetStartDate();
      this.addTask.resetEndDate();
    }
  }
  setStatus(item, status) {
    item.setTaskStatus(status);
    item.onInitEdit(true);
  }
  getUsersForAssign() {
    let userList = this.usersStateService.getAllUsers().sort((a, b) => (`${a.firstName} ${a.lastName}`.toLowerCase() > `${b.firstName} ${b.lastName}`.toLowerCase()) ?
      1 : ((`${b.firstName} ${b.lastName}`.toLowerCase() > `${a.firstName} ${a.lastName}`.toLowerCase()) ? -1 : 0));
    return userList.filter((item) => item.accountType === "TECH" && !item.deletedAt);
  }
  public onChangeDatePicker(data, item) {
    let date = new Date(data.year, data.month - 1, data.day);
    item.setDate(moment(date).format('YYYY/MM/DD'));
    item.onInitEdit(true);
  }
  public onChangeUser(data, item) {
    if (data.length === 0) item.setAssignedUser(null);
    if (data.length === 1) item.setAssignedUser(data[0]);
    item.onInitEdit(true);
  }
  onSelectTechUser(items) {
    this.addTask.setAssignedUser(items.map(item => item.id));
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.onAddTicketTask();
  }
  onSelectType(data) {
    this.addTask.setType(data.value);
  }
  onDelete() {
    let id = JSON.parse(JSON.stringify(this.ticketStateService.getTaskForRemove().id));
    this.tasksService.deleteTask(id).subscribe(data => {
      let index = this.list.findIndex(item => item.id == id);
      if (index > -1) this.list.splice(index, 1);
    })
  }
  onAddTicketTask() {
    if (this.addTask.title.length === 0 || !this.addTaskBtn.getInit()) return;
    this.addTaskBtn.setInit(false);
    this.addTask.associatedTicketId = this.ticketProfile.id;
    if (!this.addTask.startDate) {
      let startDate = new Date();
      this.addTask.startDate = startDate.getTime();
    }
    if (this.addTask.assignedUsersIds.length == 0) this.addTask.setAssignedUser([this.usersStateService.getCurrentUser().id]);
    this.tasksService.addTask(this.addTask.getDataForAdd(this.addTask)).pipe(map((res) => res),
      catchError(error => of(undefined))).subscribe(data => {
        this.showAdd = false;
        this.addTask = new TicketProfileTask();
        this.setDefaultValueForAddTask();
        if (!this.list.some(item => item.id == data.id)) this.list.push(new TicketProfileTask(data));
      }, err => {
        setTimeout(() => this.addTaskBtn.setInit(true), 2000);
      })
  }
  setDefaultValueForAddTask() {
    this.addTask.setType("To do");
    this.addTask.setTaskStatus("OPEN");
  }
  parseStartDate(date) {
    return moment(new Date(date)).format('DD MMM, hh:mm A');
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
