import { TasksHeaderComponent } from './';
import { TasksTabsComponent } from './';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [TasksHeaderComponent, TasksTabsComponent, CommonModule],
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    standalone: true
})
export class TasksComponent {

}
