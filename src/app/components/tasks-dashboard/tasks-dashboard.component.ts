
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TasksDashboardMyCalendarComponent } from './tasks-dashboard-my-calendar/tasks-dashboard-my-calendar.component';
import { TasksDashboardMyTasksComponent } from './tasks-dashboard-my-tasks/tasks-dashboard-my-tasks.component';
import { TasksDashboardStatsComponent } from './tasks-dashboard-stats/tasks-dashboard-stats.component';

@Component({
  standalone: true,
  imports: [TasksDashboardMyCalendarComponent, TasksDashboardMyTasksComponent, TasksDashboardStatsComponent, CommonModule],
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss'],

})
export class TasksDashboardComponent {

}
