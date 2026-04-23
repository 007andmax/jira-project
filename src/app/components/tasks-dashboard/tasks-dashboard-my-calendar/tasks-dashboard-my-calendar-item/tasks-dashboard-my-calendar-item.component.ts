import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TasksCalendarWeekItemHourComponent } from 'src/app/components/tasks/tasks-calendar/tasks-calendar-week/tasks-calendar-week-item-hour/tasks-calendar-week-item-hour.component';
import * as moment from "moment";
import { Task } from 'src/app/components/tasks/class/task';


@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-tasks-dashboard-my-calendar-item',
  templateUrl: './tasks-dashboard-my-calendar-item.component.html',
  styleUrls: ['./tasks-dashboard-my-calendar-item.component.scss'],

})
export class TasksDashboardMyCalendarItemComponent extends TasksCalendarWeekItemHourComponent {


  parseDate(item) {
    const multiDay = new Date(item.endDate).getTime() - new Date(item.startDate).getTime() >= 24 * 60 * 60 * 1000;
    if (multiDay) return moment(item.startDate).format('hh:mm A') + " - " + moment(item.endDate).format('DD MMM YYYY hh:mm A');
    return moment(item.startDate).format('hh:mm A') + " - " + moment(item.endDate).format('hh:mm A');
  }
  getListStartOfHour() {
    return this.day ? this.day.tasks.filter(item => this.isStartOfHour(item.startDate, this.h)) : [];
  }
  parseStyle(item: Task, colIndex: number) {
    const startHour = new Date(item.startDate).getHours() + new Date(item.startDate).getMinutes() / 60;
    const endHour = new Date(item.endDate).getHours() + new Date(item.endDate).getMinutes() / 60;
    const multiDay = new Date(item.endDate).getTime() - new Date(item.startDate).getTime() >= 24 * 60 * 60 * 1000;
    let height = 0;
    if (multiDay) height = (24 - startHour) * (67 + 12);
    if (!multiDay) height = (endHour - startHour) * (67 + 12) < 20 ? 20 : (endHour - startHour) * (67 + 12)
    return {
      top: startHour * (67 + 12),
      height: height,
      left: (colIndex / this.getListStartOfHour().length) * 100,
      width: (1 / this.getListStartOfHour().length) * 100
    }
  }
}
