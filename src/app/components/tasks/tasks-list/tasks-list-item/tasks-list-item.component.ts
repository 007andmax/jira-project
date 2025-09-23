import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { Task } from '../../class/task';
import * as moment from "moment";
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
import { DatePickerComponent } from 'src/app/components/shared/date-picker/date-picker.component';
import { TechUsersComponent } from 'src/app/components/shared/tech-users/tech-users.component';

@Component({
  selector: 'app-tasks-list-item',
  templateUrl: './tasks-list-item.component.html',
  styleUrls: ['./tasks-list-item.component.scss']
})
export class TasksListItemComponent {
  @Input() item: Task = new Task()
  assignedUsers = [];
  listTechUsers = [];
  @ViewChild('techUsers', { static: true }) techUsers: TechUsersComponent;
  @ViewChild('dateDp', { static: true }) dateDp: DatePickerComponent;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private tasksStateService: TasksStateService,
    private companiesStateService: CompaniesStateService,
    public tasksService: TasksService,
    public tasksRealTimeService: TasksRealTimeService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    if (this.onGetTechUsers().length > 0) this.onSetAssignedUsers();
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onSetAssignedUsers();
      // this.onGetUsers();
    })
    this.sub.add(getOnUsers);
    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {

      if (data.data.id == this.item.id && data.action === 'TASK_EDITED') {
        console.log("data.data", data.data);
        this.assignedUsers = this.onGetTechUsers().filter(user => data.data.assignedUsersIds.some(assignedUser => assignedUser == user.id));
        console.log("this.assignedUsers", this.assignedUsers);
        this.techUsers.setEditUsers(this.assignedUsers);
        this.dateDp.setEditDate(data.data.startDate);
      }

      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
  }
  onSetAssignedUsers() {
    this.listTechUsers = this.onGetTechUsers();
    this.assignedUsers = this.onGetTechUsers().filter(user => this.item.assignedUsersIds.some(assignedUser => assignedUser == user.id));
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
  parseStartDate(date) {
    return moment(new Date(date)).format('DD MMM, hh:mm A');
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
  save(data) {
    this.tasksService.editTask(this.item.id, data).subscribe(res => {

    })
  }
  editTask() {
    console.log("editTask");
    this.tasksStateService.openEditAside(this.item);
  }
  toggleStatus(event) {
    event.preventDefault();
    event.stopPropagation();
    this.item.taskStatus = this.item.taskStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    this.tasksService.changeStatusTask(this.item.id, this.item.taskStatus).subscribe(res => {

    });
  }
}
