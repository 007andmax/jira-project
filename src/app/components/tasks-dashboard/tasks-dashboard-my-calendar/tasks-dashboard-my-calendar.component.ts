import { ChangeDetectorRef, Component, Input, NgZone } from '@angular/core';
import * as moment from "moment";
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Task } from '../../tasks/class/task';
import { Subscription } from 'rxjs';
import { CalendarWeek } from '../../tasks/class/calenadar-week';
import { TasksFilters } from '../../tasks/class/tasks-filters';
@Component({
  selector: 'app-tasks-dashboard-my-calendar',
  templateUrl: './tasks-dashboard-my-calendar.component.html',
  styleUrls: ['./tasks-dashboard-my-calendar.component.scss']
})
export class TasksDashboardMyCalendarComponent {
  @Input() filter: TasksFilters = new TasksFilters();
  dayTasks: CalendarWeek;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  currentDate: Date = new Date();
  timeLinePosition = 0;
  private timer!: any;
  currentTime = new Date();
  sub: Subscription = new Subscription();
  constructor(public tasksService: TasksService,
    public usersStateService: UsersStateService,
    public tasksStateService: TasksStateService,
    private zone: NgZone,
    public cd: ChangeDetectorRef,
    public tasksRealTimeService: TasksRealTimeService,
  ) { }
  ngOnInit() {
    this.getTasksCalendar();
    this.startTimelineUpdater();
    this.filter.techUser = this.usersStateService.currentUser;
    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {

      const taskDate = new Date(data.data.startDate);
      if (this.currentDate.getFullYear() === taskDate.getFullYear() &&
        this.currentDate.getMonth() === taskDate.getMonth() &&
        this.currentDate.getDate() === taskDate.getDate()) {
        console.log("data realtime", data);
        console.log("this.filter", this.filter);
        if (data.action === 'TASK_SAVED' && this.filter.checkFilterUse(new Task(data.data))) this.dayTasks.tasks.push(new Task(data.data));
        if (data.action === 'TASK_EDITED') {
          let index = this.dayTasks.tasks.findIndex(item => item.id == data.data.id);
          if (index > -1) {
            this.dayTasks.tasks[index] = new Task(data.data);
          }
        }
        if (data.action === 'TASK_DELETED') {
          let index = this.dayTasks.tasks.findIndex(item => item.id == data.data);
          if (index > -1) {
            this.dayTasks.tasks.splice(index, 1);
          }
        }
        if (data.action === 'TASK_ARCHIVED') {
          let index = this.dayTasks.tasks.findIndex(item => item.id == data.data);
          if (index > -1 && !this.filter.archived) {
            this.dayTasks.tasks.splice(index, 1);
          }
        }
      }

      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
  }
  prev() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 1);
    this.getTasksCalendar();
  }

  next() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + 1);
    this.getTasksCalendar();
  }
  parseCurrentDate() {
    return moment(this.currentDate).format('dddd, DD MMM YYYY')
  }
  public getTasksCalendar() {

    this.tasksService.getTasksCalendar(moment(this.currentDate).format('YYYY-MM-DD'), 'DAY', this.filter.techUser ? this.filter.techUser.id : null, null, false).subscribe((data: any) => {
      // this.populateTasksToDays(data.tasks);
      console.log("data", data);
      this.dayTasks = new CalendarWeek(new Date(data.days[0].date));
      this.dayTasks.tasks = data.days[0].tasks;
      //   this.tasksStateService.setTasksCalendarDays(data.days);
      /*  this.days.forEach(day => {
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
        console.log("this.days", this.days);*/
      this.cd.detectChanges();
    });
  }
  startTimelineUpdater() {
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => {
          this.currentTime = new Date();
          const hours = this.currentTime.getHours() + this.currentTime.getMinutes() / 60;
          this.timeLinePosition = hours * 68; // 1 hour = 60px
        });
      }, 60000); // update every minute
    });
    // initial position
    const hours = this.currentTime.getHours() + this.currentTime.getMinutes() / 60;
    this.timeLinePosition = hours * 68;
  }
  ngOnDestroy() {
    clearInterval(this.timer);
    this.sub.unsubscribe();
  }
}
