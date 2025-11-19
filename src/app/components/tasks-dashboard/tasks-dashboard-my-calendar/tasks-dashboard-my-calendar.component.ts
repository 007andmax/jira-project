import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import * as moment from "moment";
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Task } from '../../tasks/class/task';
import { Subscription } from 'rxjs';
import { CalendarWeek } from '../../tasks/class/calenadar-week';
@Component({
  selector: 'app-tasks-dashboard-my-calendar',
  templateUrl: './tasks-dashboard-my-calendar.component.html',
  styleUrls: ['./tasks-dashboard-my-calendar.component.scss']
})
export class TasksDashboardMyCalendarComponent {
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

    this.tasksService.getTasksCalendar(moment(this.currentDate).format('YYYY-MM-DD'), 'DAY', null, null, false).subscribe((data: any) => {
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
          this.timeLinePosition = hours * 48; // 1 hour = 60px
        });
      }, 60000); // update every minute
    });
    // initial position
    const hours = this.currentTime.getHours() + this.currentTime.getMinutes() / 60;
    this.timeLinePosition = hours * 48;
  }
  ngOnDestroy() {
    clearInterval(this.timer);
    this.sub.unsubscribe();
  }
}
