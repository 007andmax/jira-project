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
  @Input() weekStart: Date;
  @Input() weekEnd: Date;
  @Output() onAddTask = new EventEmitter();
  daysOfWeek: Date[] = [];
  constructor(private tasksStateService: TasksStateService,
    public usersStateService: UsersStateService,
  ) { }

  ngOnInit() {
    this.generateWeek();

  }
  editTask(task) {
    this.tasksStateService.openEditAside(task);
  }
  addTask() {
    this.onAddTask.emit({
      startDate: new Date(this.day.date.getFullYear(), this.day.date.getMonth(), this.day.date.getDate(), 0, 0, 0),
      assignedUsersIds: [this.usersStateService.getCurrentUser().id]
    });
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

    //  console.log("allDay", allDay);
    const positions: any[] = [];
    //  console.log("this.day.tasks", this.day.tasks);
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
      positions.push({
        task: task,
        left: colStart * (100 / 7),
        width: (colEnd - colStart + 1) * (100 / 7)
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
