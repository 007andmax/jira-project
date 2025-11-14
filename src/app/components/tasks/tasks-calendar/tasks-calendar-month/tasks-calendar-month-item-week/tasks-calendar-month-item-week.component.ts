import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CalendarMonth } from '../../../class/calenadar-month';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-tasks-calendar-month-item-week',
  templateUrl: './tasks-calendar-month-item-week.component.html',
  styleUrls: ['./tasks-calendar-month-item-week.component.scss']
})
export class TasksCalendarMonthItemWeekComponent {
  @ViewChild('p', { static: false }) p: any;
  @Input() day: CalendarMonth;
  @Output() onAddTask = new EventEmitter();
  constructor(private tasksStateService: TasksStateService,
    public usersStateService: UsersStateService,
  ) { }
  editTask(task) {
    this.tasksStateService.openEditAside(task);
  }
  addTask() {
    this.onAddTask.emit({
      startDate: new Date(this.day.date.getFullYear(), this.day.date.getMonth(), this.day.date.getDate(), 0, 0, 0),
      assignedUsersIds: [this.usersStateService.getCurrentUser().id]
    });
  }
  isCurrentDay(): boolean {
    const today = new Date();
    return today.getFullYear() === this.day.date.getFullYear() &&
      today.getMonth() === this.day.date.getMonth() &&
      today.getDate() === this.day.date.getDate();
  }

}
