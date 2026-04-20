import { Component } from '@angular/core';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';

@Component({
    selector: 'app-tasks-dashboard-my-tasks',
    templateUrl: './tasks-dashboard-my-tasks.component.html',
    styleUrls: ['./tasks-dashboard-my-tasks.component.scss'],
    standalone: true
})
export class TasksDashboardMyTasksComponent {
  activeTab: string = "all";
  constructor(private tasksStateService: TasksStateService,) { }


  showAsideForAdd() {
    this.tasksStateService.openAddAside();
  }

  setTab(data) {
    this.activeTab = data['nextId'];
  }
}
