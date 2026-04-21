import { TasksCalendarComponent } from './';
import { TasksListComponent } from './';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  standalone: true,
  imports: [TasksCalendarComponent, TasksListComponent, CommonModule],
    selector: 'app-tasks-tabs',
    templateUrl: './tasks-tabs.component.html',
    styleUrls: ['./tasks-tabs.component.scss'],
    standalone: true
})
export class TasksTabsComponent {
  activeTab: string = "list";

  constructor(private leftPanelStateService: LeftPanelStateService) { }
  ngOnInit() {
    if (this.leftPanelStateService.activePage == "my-tasks-calendar") this.activeTab = "calendar";;
    this.leftPanelStateService.onChangeState.subscribe(res => {
      if (res == "my-tasks") this.activeTab = "list";
      if (res == "my-tasks-calendar") this.activeTab = "calendar";
    })
  }

  setTab(data) {
    this.activeTab = data['nextId'];
  }
}
