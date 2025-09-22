import { Component, Input } from '@angular/core';
import { Task } from '../../class/task';
import * as moment from "moment";
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Subscription } from 'rxjs';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-tasks-list-item',
  templateUrl: './tasks-list-item.component.html',
  styleUrls: ['./tasks-list-item.component.scss']
})
export class TasksListItemComponent {
  @Input() item: Task = new Task()
  assignedUsers = [];
  listTechUsers = [];
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private tasksStateService: TasksStateService,
    private companiesStateService: CompaniesStateService,
    public tasksService: TasksService,
  ) { }

  ngOnInit() {
    if (this.onGetTechUsers().length > 0) this.onSetAssignedUsers();
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.onSetAssignedUsers();
      // this.onGetUsers();
    })
    this.sub.add(getOnUsers);
  }
  onSetAssignedUsers() {
    this.listTechUsers = this.onGetTechUsers();
    this.assignedUsers = this.onGetTechUsers().filter(user => this.item.assignedUsersIds.some(assignedUser => assignedUser == user.id));
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
    this.save();
  }
  public onChangeUser(data) {
    this.item.setAssignedUser(data.map(item => item.id));
    this.assignedUsers = data;
    this.save();
  }
  save() {
    this.tasksService.editTask(this.item.id, this.item.getDataForAdd({ ...this.item, ticketUpdates: this.item.ticketUpdateList })).subscribe(res => {

    })
  }
  editTask() {
    this.tasksStateService.openEditAside(this.item);
  }
  toggleStatus() {
    this.item.taskStatus = this.item.taskStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    this.tasksService.changeStatusTask(this.item.id, this.item.taskStatus).subscribe(res => {

    });
  }
}
