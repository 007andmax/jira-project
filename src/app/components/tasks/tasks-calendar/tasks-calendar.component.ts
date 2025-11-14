import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CalendarMonth } from '../class/calenadar-month';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import * as moment from "moment";
import { Task } from '../class/task';
import { CalendarWeek } from '../class/calenadar-week';
import { TasksCalendarMonthComponent } from './tasks-calendar-month/tasks-calendar-month.component';
import { TasksCalendarWeekComponent } from './tasks-calendar-week/tasks-calendar-week.component';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { TasksFilters } from '../class/tasks-filters';
import { Subscription } from 'rxjs';

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
  filter: TasksFilters = new TasksFilters();
  sub: Subscription = new Subscription();

  interval: string = 'MONTH';
  constructor(public tasksService: TasksService,
    public tasksStateService: TasksStateService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    console.log("this.tasksStateService", this.tasksStateService.filter)
    this.filter = this.tasksStateService.filter;
    let geLefttFilter = this.tasksStateService.onFilter.subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.filter.setFilterData(data);
      if (this.monthly) {
        this.monthly.filter = this.filter;
        this.monthly.getTasksCalendar();
      }
      if (this.weekly) {
        this.weekly.filter = this.filter;
        this.weekly.getTasksCalendar();
      }
      this.cd.detectChanges();
    });
    this.sub.add(geLefttFilter);
  }



  parseCurrentDate() {
    return moment(this.currentDate).format('MMMM YYYY');
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
