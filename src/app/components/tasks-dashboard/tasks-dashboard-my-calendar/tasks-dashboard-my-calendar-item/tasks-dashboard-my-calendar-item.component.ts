import { Component } from '@angular/core';
import { TasksCalendarWeekItemHourComponent } from 'src/app/components/tasks/tasks-calendar/tasks-calendar-week/tasks-calendar-week-item-hour/tasks-calendar-week-item-hour.component';
import * as moment from "moment";

@Component({
  selector: 'app-tasks-dashboard-my-calendar-item',
  templateUrl: './tasks-dashboard-my-calendar-item.component.html',
  styleUrls: ['./tasks-dashboard-my-calendar-item.component.scss']
})
export class TasksDashboardMyCalendarItemComponent extends TasksCalendarWeekItemHourComponent {


  parseDate(item) {
    return moment(item.startDate).format('hh:mm A') + " - " + moment(item.endDate).format('DD MMM YYYY');
  }
}
