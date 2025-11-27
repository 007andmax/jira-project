import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as moment from "moment";
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { CalendarWeek } from '../../class/calenadar-week';
import { Task } from '../../class/task';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { TaskAddCalendar } from '../../class/task-add-calendar';
import { TasksFilters } from '../../class/tasks-filters';
import { Subscription } from 'rxjs';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
@Component({
  selector: 'app-tasks-calendar-week',
  templateUrl: './tasks-calendar-week.component.html',
  styleUrls: ['./tasks-calendar-week.component.scss']
})
export class TasksCalendarWeekComponent implements OnInit, OnDestroy {
  @Input() filter: TasksFilters = new TasksFilters();
  days: CalendarWeek[] = [];
  weekStart!: Date;
  weekEnd!: Date;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  timeLinePosition = 0;
  private timer!: any;
  currentTime = new Date();
  showMore: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public tasksService: TasksService,
    public usersStateService: UsersStateService,
    public tasksStateService: TasksStateService,
    private zone: NgZone,
    public cd: ChangeDetectorRef,
    public tasksRealTimeService: TasksRealTimeService,
  ) { }
  ngOnInit() {
    console.log("hours", this.hours);
    let currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // 0 = Sun
    this.weekStart = new Date(currentDate);
    this.weekStart.setDate(currentDate.getDate() - dayOfWeek);
    this.getTasksCalendar();
    this.startTimelineUpdater();
    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {
      this.days.forEach(day => {
        const taskDate = new Date(data.data.startDate);
        if (day.date.getFullYear() === taskDate.getFullYear() &&
          day.date.getMonth() === taskDate.getMonth() &&
          day.date.getDate() === taskDate.getDate()) {
          if (data.action === 'TASK_SAVED' && this.filter.checkFilterUse(new Task(data.data))) day.tasks.push(new Task(data.data));
        }
        if (data.action === 'TASK_EDITED') {
          let index = day.tasks.findIndex(item => item.id == data.data.id);
          if (index > -1) {
            day.tasks[index] = new Task(data.data);
          }
        }
        if (data.action === 'TASK_DELETED') {
          let index = day.tasks.findIndex(item => item.id == data.data);
          if (index > -1) {
            day.tasks.splice(index, 1);
          }
        }
        if (data.action === 'TASK_ARCHIVED') {
          let index = day.tasks.findIndex(item => item.id == data.data);
          if (index > -1 && !this.filter.archived) {
            day.tasks.splice(index, 1);
          }
        }

      });
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
  }
  prev() {
    const d = new Date(this.weekStart);
    d.setDate(this.weekStart.getDate() - 7);
    this.weekStart = d;
    this.getTasksCalendar();
  }
  next() {
    const d = new Date(this.weekStart);
    d.setDate(this.weekStart.getDate() + 7);
    this.weekStart = d;
    this.getTasksCalendar();
  }
  generateWeek() {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(this.weekStart);
      d.setDate(this.weekStart.getDate() + i);
      this.days.push(new CalendarWeek(d));
    }
  }
  onAddTask(data) {
    this.tasksStateService.setTaskAddCalendar(new TaskAddCalendar({
      startDate: data.startDate,
      assignedUser: this.usersStateService.getCurrentUser()
    }));
  }
  isCurrentDay(date): boolean {
    const today = new Date();
    return today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();
  }
  public getTasksCalendar() {
    this.generateWeek();
    const weekEnd = new Date(this.weekStart);
    weekEnd.setDate(this.weekStart.getDate() + 6);
    this.weekEnd = weekEnd;
    this.tasksService.getTasksCalendar(moment(this.days[0].date).format('YYYY-MM-DD'), 'WEEK', this.filter.techUser ? this.filter.techUser.id : null, this.filter.filter, this.filter.archived).subscribe((data: any) => {
      // this.populateTasksToDays(data.tasks);
      this.days.forEach(day => {
        let find = data.days.find(d => {
          const dDate = new Date(d.date);
          return dDate.getFullYear() === day.date.getFullYear() &&
            dDate.getMonth() === day.date.getMonth() &&
            dDate.getDate() === day.date.getDate();
        });
        if (find) day.tasks = find.tasks.map(t => new Task(t));
      });

      console.log("this.weekEnd", this.weekEnd);
      console.log("data", data);
      console.log("this.days", this.days);
      this.cd.detectChanges();
    });
  }
  isToday(day: Date): boolean {
    const now = new Date();
    return (
      day.getFullYear() === now.getFullYear() &&
      day.getMonth() === now.getMonth() &&
      day.getDate() === now.getDate()
    );
  }
  startTimelineUpdater() {
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => {
          this.currentTime = new Date();
          const hours = this.currentTime.getHours() + this.currentTime.getMinutes() / 60;
          this.timeLinePosition = hours * 48; // 1 hour = 60px
        });
      }, 60000); // update every minute
    });
    // initial position
    const hours = this.currentTime.getHours() + this.currentTime.getMinutes() / 60;
    this.timeLinePosition = hours * 48;
  }
  getAllDayEvents(): any[] {
    return this.days.filter(d => {
      return d.tasks.filter(ev => {
        // const isAllDay = ev.allDay === true;

        const multiDay = new Date(ev.endDate).getTime() - new Date(ev.startDate).getTime() >= 24 * 60 * 60 * 1000;

        return multiDay;
      }).length > 0;
    }).map(d => d.tasks);

  }

  getAllDayPositionedTasks(): any[] {
    let allDay = [];
    this.getAllDayEvents().forEach(arr => {
      allDay = allDay.concat(arr);
    })
    //  console.log("allDay", allDay);
    const positions: any[] = [];

    for (const ev of allDay) {
      // Clamp inside the week range
      const start = new Date(Math.max(new Date(ev.startDate).getTime(), this.weekStart.getTime()));
      let end = new Date(Math.min(new Date(ev.endDate).getTime(), this.addDays(this.weekStart, 7).getTime()));

      if (this.weekEnd.getTime() < end.getTime()) {
        end = this.weekEnd;
      }
      const startIndex = this.days.findIndex(
        d => d.date.toDateString() === start.toDateString()
      );

      const endIndex = this.days.findIndex(
        d => d.date.toDateString() === end.toDateString()
      );

      const colStart = startIndex >= 0 ? startIndex : 0;
      const colEnd = endIndex >= 0 ? endIndex : 7;
      positions.push({
        task: ev,
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
  ngOnDestroy() {
    clearInterval(this.timer);
    this.sub.unsubscribe();
  }
}
