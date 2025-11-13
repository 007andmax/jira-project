import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CalendarMonth } from '../class/calenadar-month';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import * as moment from "moment";
import { Task } from '../class/task';
import { CalendarWeek } from '../class/calenadar-week';
import { TasksCalendarMonthComponent } from './tasks-calendar-month/tasks-calendar-month.component';
import { TasksCalendarWeekComponent } from './tasks-calendar-week/tasks-calendar-week.component';

@Component({
  selector: 'app-tasks-calendar',
  templateUrl: './tasks-calendar.component.html',
  styleUrls: ['./tasks-calendar.component.scss']
})
export class TasksCalendarComponent {
  toggleFilter: boolean = false;
  @ViewChild('monthly', { static: false }) monthly: TasksCalendarMonthComponent;
  @ViewChild('weekly', { static: false }) weekly: TasksCalendarWeekComponent;
  currentDate = new Date();



  interval: string = 'MONTH';
  constructor(public tasksService: TasksService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTasksCalendar();
  }
  getTasksCalendar() {

  }


  parseCurrentDate() {
    return moment(this.currentDate).format('MMMM YYYY');
  }
  onChangeInterval() {
    this.getTasksCalendar();
  }
  prev() {
    if (this.interval === 'MONTH') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    }
    if (this.monthly) this.monthly.prev()
    if (this.weekly) this.weekly.prev()
  }

  next() {
    if (this.interval === 'MONTH') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    }
    if (this.monthly) this.monthly.next()
    if (this.weekly) this.weekly.next()
  }


  /* getEventsForDate(date: Date): CalendarEvent[] {
     return this.events.filter(
       e =>
         e.date.getFullYear() === date.getFullYear() &&
         e.date.getMonth() === date.getMonth() &&
         e.date.getDate() === date.getDate()
     );
   }*/
  onToggleFilter(data) {
    this.toggleFilter = data;
  }
}
