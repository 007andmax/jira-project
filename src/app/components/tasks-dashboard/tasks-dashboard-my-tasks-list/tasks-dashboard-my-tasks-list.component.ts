import { Component } from '@angular/core';
import { TasksListComponent } from '../../tasks/tasks-list/tasks-list.component';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-tasks-dashboard-my-tasks-list',
  templateUrl: './tasks-dashboard-my-tasks-list.component.html',
  styleUrls: ['./tasks-dashboard-my-tasks-list.component.scss'],
  providers: [TicketsListService]
})
export class TasksDashboardMyTasksListComponent extends TasksListComponent {



}
