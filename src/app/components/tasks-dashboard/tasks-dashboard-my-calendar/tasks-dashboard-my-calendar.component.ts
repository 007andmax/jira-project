import { ChangeDetectorRef, Component, ElementRef, Input, NgZone } from '@angular/core';
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
  isScroll: boolean = false;
  sub: Subscription = new Subscription();
  constructor(public tasksService: TasksService,
    public usersStateService: UsersStateService,
    public tasksStateService: TasksStateService,
    private zone: NgZone,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    public tasksRealTimeService: TasksRealTimeService,
  ) { }
  ngOnInit() {
    this.filter.techUser = this.usersStateService.currentUser;
    if (this.filter.techUser) this.getTasksCalendar();
    this.startTimelineUpdater();

    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {

      const taskDate = new Date(data.data.startDate);
      if (this.currentDate.getFullYear() === taskDate.getFullYear() &&
        this.currentDate.getMonth() === taskDate.getMonth() &&
        this.currentDate.getDate() === taskDate.getDate()) {
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
    let geLefttFilter = this.tasksStateService.onFilter.subscribe((data) => {
      this.filter.setFilterData(data);
      this.getTasksCalendar();
      this.cd.detectChanges();
    });
    this.sub.add(geLefttFilter);
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
      this.dayTasks = new CalendarWeek(new Date(data.days[0].date));
      this.dayTasks.tasks = data.days[0].tasks;
      if (!this.isScroll) this.elRef.nativeElement.querySelector(".page-my-tasks").scrollTo(0, this.timeLinePosition - ((this.elRef.nativeElement.querySelector(".page-my-tasks").clientHeight - 100) / 2));
      this.isScroll = true;
      this.cd.detectChanges();
    });
  }
  getDayLabel(date: Date): string {
    const today = new Date();
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffMs = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays > 0) {
      return diffDays === 1 ? 'In 1 day' : `In ${diffDays} days`;
    } else {
      const abs = Math.abs(diffDays);
      return abs === 1 ? '1 day ago' : `${abs} days ago`;
    }
  }
  startTimelineUpdater() {
    this.zone.runOutsideAngular(() => {
      this.timer = setInterval(() => {
        this.zone.run(() => {
          this.currentTime = new Date();
          const hours = this.currentTime.getHours() + this.currentTime.getMinutes() / 60;
          this.timeLinePosition = hours * (67 + 12); // 1 hour = 60px
        });
      }, 60000); // update every minute
    });
    // initial position
    const hours = this.currentTime.getHours() + this.currentTime.getMinutes() / 60;
    this.timeLinePosition = hours * (67 + 12);


  }
  ngOnDestroy() {
    clearInterval(this.timer);
    this.sub.unsubscribe();
  }
}
