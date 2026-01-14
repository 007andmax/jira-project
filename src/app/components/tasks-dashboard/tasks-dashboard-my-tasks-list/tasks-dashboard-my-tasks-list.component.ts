import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TasksListComponent } from '../../tasks/tasks-list/tasks-list.component';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { TasksRealTimeService } from 'src/app/states/tasks/tasks-real-time.service';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { Task } from '../../tasks/class/task';

@Component({
  selector: 'app-tasks-dashboard-my-tasks-list',
  templateUrl: './tasks-dashboard-my-tasks-list.component.html',
  styleUrls: ['./tasks-dashboard-my-tasks-list.component.scss'],
  providers: [TicketsListService]
})
export class TasksDashboardMyTasksListComponent extends TasksListComponent {
  container = document.body.querySelector(".my-task-dashboard__my-task");
  @Input() filterType: string;
  offset: number = 20;
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
  public getTickets() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }

    if (this.page_number > 0) this.showPendingPreloader = true;
    this.tasksService.getTasks(this.page_number, this.filter.techUser ? this.filter.techUser.id : null, this.filter.filter, this.filter.archived, 20).subscribe((data: Array<Task>) => {
      this.list = [...this.list, ...data.map(item => new Task(item))];
      this.infiniteScrollDisabled = false;
      if (data.length < this.offset) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();
    })
  }
}
