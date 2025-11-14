import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as moment from "moment";
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { CalendarWeek } from '../../class/calenadar-week';
import { Task } from '../../class/task';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { TaskAddCalendar } from '../../class/task-add-calendar';
import { TasksFilters } from '../../class/tasks-filters';
@Component({
  selector: 'app-tasks-calendar-week',
  templateUrl: './tasks-calendar-week.component.html',
  styleUrls: ['./tasks-calendar-week.component.scss']
})
export class TasksCalendarWeekComponent {
  @Input() filter: TasksFilters = new TasksFilters();
  days: CalendarWeek[] = [];
  weekStart!: Date;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  constructor(public tasksService: TasksService,
    public usersStateService: UsersStateService,
    public tasksStateService: TasksStateService,
    public cd: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    console.log("hours", this.hours);
    let currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // 0 = Sun
    this.weekStart = new Date(currentDate);
    this.weekStart.setDate(currentDate.getDate() - dayOfWeek);
    this.getTasksCalendar();
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
      console.log("data", data);
      console.log("this.days", this.days);
      this.cd.detectChanges();
    });
  }
}
