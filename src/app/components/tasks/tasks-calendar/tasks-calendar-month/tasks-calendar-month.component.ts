import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as moment from "moment";
import { CalendarMonth } from '../../class/calenadar-month';
import { Task } from '../../class/task';
import { TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-tasks-calendar-month',
  templateUrl: './tasks-calendar-month.component.html',
  styleUrls: ['./tasks-calendar-month.component.scss']
})
export class TasksCalendarMonthComponent {
  daysInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weeks: CalendarMonth[][] = [];
  currentDate = new Date();

  constructor(public tasksService: TasksService,
    public cd: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    this.getTasksCalendar();
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
    this.tasksService.getTasksCalendar(moment(this.weeks[0][0].date).format('YYYY-MM-DD'), 'MONTH').subscribe((data: any) => {
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
}
