import { TasksDashboardMyCalendarComponent } from './';
import { TasksDashboardMyTasksComponent } from './';
import { TasksDashboardStatsComponent } from './';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [TasksDashboardMyCalendarComponent, TasksDashboardMyTasksComponent, TasksDashboardStatsComponent, CommonModule],
    selector: 'app-tasks-dashboard',
    templateUrl: './tasks-dashboard.component.html',
    styleUrls: ['./tasks-dashboard.component.scss'],
    standalone: true
})
export class TasksDashboardComponent {

}
