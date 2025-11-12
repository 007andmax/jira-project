import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as moment from "moment";
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { CalendarWeek } from '../../class/calenadar-week';
import { Task } from '../../class/task';
@Component({
  selector: 'app-tasks-calendar-week',
  templateUrl: './tasks-calendar-week.component.html',
  styleUrls: ['./tasks-calendar-week.component.scss']
})
export class TasksCalendarWeekComponent {
  days: CalendarWeek[] = [];
  weekStart!: Date;
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  @Input() currentDate = new Date();
  constructor(public tasksService: TasksService,
    public cd: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    console.log("hours", this.hours);
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
  public getTasksCalendar() {
    const dayOfWeek = this.currentDate.getDay(); // 0 = Sun
    this.weekStart = new Date(this.currentDate);
    this.weekStart.setDate(this.currentDate.getDate() - dayOfWeek);
    this.generateWeek();

    this.tasksService.getTasksCalendar(moment(this.days[0].date).format('YYYY-MM-DD'), 'WEEK').subscribe((data: any) => {
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
