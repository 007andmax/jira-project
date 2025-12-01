import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as moment from "moment";
import { CalendarMonth } from '../../class/calenadar-month';
import { Task } from '../../class/task';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TaskAddCalendar } from '../../class/task-add-calendar';
import { TasksFilters } from '../../class/tasks-filters';
import { Subscription } from 'rxjs';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';

@Component({
  selector: 'app-tasks-calendar-month',
  templateUrl: './tasks-calendar-month.component.html',
  styleUrls: ['./tasks-calendar-month.component.scss']
})
export class TasksCalendarMonthComponent {
  @Input() filter: TasksFilters = new TasksFilters();
  daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weeks: CalendarMonth[][] = [];
  currentDate = new Date();
  sub: Subscription = new Subscription();
  constructor(public tasksService: TasksService,
    public tasksStateService: TasksStateService,
    public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    public tasksRealTimeService: TasksRealTimeService,
  ) { }
  ngOnInit() {
    this.getTasksCalendar();
    let getChangeCompanies = this.tasksRealTimeService.changeTasksArray.subscribe((data) => {
      this.weeks.forEach(week => {
        week.forEach(day => {
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
            console.log("2");
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
      });
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
  }
  prev() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.getTasksCalendar();
  }
  next() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.getTasksCalendar();
  }
  public getTasksCalendar() {
    this.generateCalendar(this.currentDate);
    this.tasksService.getTasksCalendar(moment(this.weeks[0][0].date).format('YYYY-MM-DD'), 'MONTH', this.filter.techUser ? this.filter.techUser.id : null, this.filter.filter, this.filter.archived).subscribe((data: any) => {
      // this.populateTasksToDays(data.tasks);
      this.weeks.forEach(week => {
        week.forEach(day => {
          let find = data.days.find(d => {
            const dDate = new Date(d.date);
            return dDate.getFullYear() === day.date.getFullYear() &&
              dDate.getMonth() === day.date.getMonth() &&
              dDate.getDate() === day.date.getDate();
          });
          if (find) day.tasks = find.tasks.map(t => new Task(t));
        });
      });
      console.log("data", data);
      console.log("this.weeks", this.weeks)
      this.cd.detectChanges();
    });
  }
  onAddTask(day) {
    this.tasksStateService.setTaskAddCalendar(new TaskAddCalendar({
      startDate: new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), 0, 0, 0),
      assignedUser: this.filter.techUser
    }));
  }
  generateCalendar(baseDate: Date) {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    // this.monthName = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay(); // Sunday = 0
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const days: CalendarMonth[] = [];

    // --- Previous month days ---
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      //const events = this.getEventsForDate(date);
      days.push({ date, inCurrentMonth: false, tasks: [] });
    }

    // --- Current month days ---
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const date = new Date(year, month, i);
      //  const events = this.getEventsForDate(date);
      days.push({ date, inCurrentMonth: true, tasks: [] });
    }

    // --- Next month days ---
    const totalCells = 42; // 6 weeks x 7 days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      //const events = this.getEventsForDate(date);
      days.push({ date, inCurrentMonth: false, tasks: [] });
    }

    // Split into weeks
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
