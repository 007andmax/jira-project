import { Component, Input, ViewChild } from '@angular/core';
import { CalendarMonth } from '../../../class/calenadar-month';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';

@Component({
  selector: 'app-tasks-calendar-month-item-week',
  templateUrl: './tasks-calendar-month-item-week.component.html',
  styleUrls: ['./tasks-calendar-month-item-week.component.scss']
})
export class TasksCalendarMonthItemWeekComponent {
  @ViewChild('p', { static: false }) p: any;
  @Input() day: CalendarMonth;
  constructor(private tasksStateService: TasksStateService) { }
  editTask(task) {
    this.tasksStateService.openEditAside(task);
  }
}
