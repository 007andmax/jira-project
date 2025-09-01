import { Component } from '@angular/core';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';

@Component({
  selector: 'app-tasks-header',
  templateUrl: './tasks-header.component.html',
  styleUrls: ['./tasks-header.component.scss']
})
export class TasksHeaderComponent {

  constructor(private tasksStateService: TasksStateService,) { }
  showAsideForAdd() {
    this.tasksStateService.openAddAside();
  }
}
