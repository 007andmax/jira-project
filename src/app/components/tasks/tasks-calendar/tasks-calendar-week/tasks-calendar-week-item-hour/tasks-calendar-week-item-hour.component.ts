import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CalendarWeek } from '../../../class/calenadar-week';
import { Task } from '../../../class/task';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-tasks-calendar-week-item-hour',
  templateUrl: './tasks-calendar-week-item-hour.component.html',
  styleUrls: ['./tasks-calendar-week-item-hour.component.scss']
})
export class TasksCalendarWeekItemHourComponent {
  @Input() day: CalendarWeek;
  @Input() h: Number;
  @ViewChild('p', { static: false }) p: any;
  @Output() onAddTask = new EventEmitter();
  constructor(private tasksStateService: TasksStateService,
    public usersStateService: UsersStateService,
  ) { }

  isStartOfHour(date, hour): boolean {
    return new Date(date).getHours() === hour;
  }
  getListStartOfHour() {
    return this.day.tasks.filter(item => this.isStartOfHour(item.startDate, this.h));
  }
  editTask(task) {
    this.tasksStateService.openEditAside(task);
  }
  addTask() {
    this.onAddTask.emit({
      startDate: new Date(this.day.date.getFullYear(), this.day.date.getMonth(), this.day.date.getDate(), Number(this.h), 0, 0),
      assignedUsersIds: [this.usersStateService.getCurrentUser().id]
    });
  }
}
