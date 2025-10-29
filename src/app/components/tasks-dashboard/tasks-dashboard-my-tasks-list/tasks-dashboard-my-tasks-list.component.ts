import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TasksListComponent } from '../../tasks/tasks-list/tasks-list.component';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';

@Component({
  selector: 'app-tasks-dashboard-my-tasks-list',
  templateUrl: './tasks-dashboard-my-tasks-list.component.html',
  styleUrls: ['./tasks-dashboard-my-tasks-list.component.scss'],
  providers: [TicketsListService]
})
export class TasksDashboardMyTasksListComponent extends TasksListComponent {

  @Input() filterType: string;

  public onScroll() {
    if (this.filterType == 'ARCHIVED') {
      this.filter.archived = true;
      this.filter.filter = null;
    }
    if (this.filterType != 'ARCHIVED') {
      this.filter.archived = false;
      this.filter.filter = this.filterType;
    }
    this.filter.techUser = this.tasksStateService.filter.techUser;
    this.infiniteScrollDisabled = true;
    this.getTickets();
  }
}
