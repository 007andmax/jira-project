
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TasksHeaderComponent } from './tasks-header/tasks-header.component';
import { TasksTabsComponent } from './tasks-tabs/tasks-tabs.component';

@Component({
  standalone: true,
  imports: [TasksHeaderComponent, TasksTabsComponent, CommonModule],
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],

})
export class TasksComponent {

}
