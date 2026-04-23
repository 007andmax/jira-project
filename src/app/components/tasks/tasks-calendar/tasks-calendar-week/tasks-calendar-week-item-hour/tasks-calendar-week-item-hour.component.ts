import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CalendarWeek } from '../../../class/calenadar-week';
import { Task } from '../../../class/task';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-tasks-calendar-week-item-hour',
  templateUrl: './tasks-calendar-week-item-hour.component.html',
  styleUrls: ['./tasks-calendar-week-item-hour.component.scss'],

})
export class TasksCalendarWeekItemHourComponent {
  @Input() day: CalendarWeek;
  @Input() h: Number;
  @ViewChild('p', { static: false }) p: any;
  constructor(private tasksStateService: TasksStateService,
    public usersStateService: UsersStateService,
  ) { }

  isShoWTask(task) {
    return new Date(task.endDate).getTime() - new Date(task.startDate).getTime() < 24 * 60 * 60 * 1000;

  }
  isStartOfHour(date, hour): boolean {
    return new Date(date).getHours() === hour;
  }
  getListStartOfHour() {
    return this.day ? this.day.tasks.filter(item => this.isStartOfHour(item.startDate, this.h) && this.isShoWTask(item)) : [];
  }
  editTask(task) {
    this.tasksStateService.openEditAside(task);
  }

  parseStyle(item: Task, colIndex: number) {
    const startHour = new Date(item.startDate).getHours() + new Date(item.startDate).getMinutes() / 60;
    const endHour = new Date(item.endDate).getHours() + new Date(item.endDate).getMinutes() / 60;
    return {
      top: startHour * 48,
      height: (endHour - startHour) * 48 < 20 ? 20 : (endHour - startHour) * 48,
      left: (colIndex / this.getListStartOfHour().length) * 100,
      width: (1 / this.getListStartOfHour().length) * 100
    }
  }
}
