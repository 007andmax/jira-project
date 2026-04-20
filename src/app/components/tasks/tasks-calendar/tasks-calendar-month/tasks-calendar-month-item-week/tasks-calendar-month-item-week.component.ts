import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CalendarMonth } from '../../../class/calenadar-month';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
    selector: 'app-tasks-calendar-month-item-week',
    templateUrl: './tasks-calendar-month-item-week.component.html',
    styleUrls: ['./tasks-calendar-month-item-week.component.scss'],
    standalone: true
})
export class TasksCalendarMonthItemWeekComponent {
  @ViewChild('p', { static: false }) p: any;
  @Input() day: CalendarMonth;
  @Input() weekStart: Date;
  @Input() weekEnd: Date;
  daysOfWeek: Date[] = [];
  constructor(private tasksStateService: TasksStateService,
    public usersStateService: UsersStateService,
  ) { }

  ngOnInit() {
    this.generateWeek();

  }
  editTask(event, task) {
    this.stopPropagation(event);
    this.tasksStateService.openEditAside(task);
  }
  stopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  generateWeek() {
    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.weekStart);
      d.setDate(this.weekStart.getDate() + i);
      this.daysOfWeek.push(d);
    }
  }
  isCurrentDay(): boolean {
    const today = new Date();
    return today.getFullYear() === this.day.date.getFullYear() &&
      today.getMonth() === this.day.date.getMonth() &&
      today.getDate() === this.day.date.getDate();
  }
  getAllDayPositionedTasks(): any[] {
    const positions: any[] = [];
    for (const task of this.day.tasks) {
      // Clamp inside the week range
      const start = new Date(Math.max(new Date(task.startDate).getTime(), this.weekStart.getTime()));
      let end = new Date(Math.min(new Date(task.endDate).getTime(), this.addDays(this.weekStart, 7).getTime()));

      if (this.weekEnd.getTime() < end.getTime()) {
        end = this.weekEnd;
      }
      const startIndex = this.daysOfWeek.findIndex(
        d => d.toDateString() === start.toDateString()
      );

      const endIndex = this.daysOfWeek.findIndex(
        d => d.toDateString() === end.toDateString()
      );

      const colStart = startIndex >= 0 ? startIndex : 0;
      const colEnd = endIndex >= 0 ? endIndex : 7;
      const pxToPercent = (8 / document.body.querySelector(".calendar-body__day").clientWidth) * (100 / 7);
      positions.push({
        task: task,
        left: colStart * (100 / 7) + pxToPercent,
        width: (colEnd - colStart + 1) * (100 / 7) - pxToPercent * 2
      });
    }

    return positions;
  }
  addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  public trackById(index, item) {
    return item.id;
  }
}
