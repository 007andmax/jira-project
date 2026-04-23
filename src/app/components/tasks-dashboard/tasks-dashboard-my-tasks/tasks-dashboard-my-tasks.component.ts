
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { TasksDashboardMyTasksListComponent } from '../tasks-dashboard-my-tasks-list/tasks-dashboard-my-tasks-list.component';

@Component({
  standalone: true,
  imports: [TasksDashboardMyTasksListComponent, CommonModule],
  selector: 'app-tasks-dashboard-my-tasks',
  templateUrl: './tasks-dashboard-my-tasks.component.html',
  styleUrls: ['./tasks-dashboard-my-tasks.component.scss'],

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
