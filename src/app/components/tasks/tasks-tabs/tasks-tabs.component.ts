
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { TasksCalendarComponent } from '../tasks-calendar/tasks-calendar.component';
import { TasksListComponent } from '../tasks-list/tasks-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  imports: [TasksCalendarComponent, TasksListComponent, CommonModule, NgbModule],
  selector: 'app-tasks-tabs',
  templateUrl: './tasks-tabs.component.html',
  styleUrls: ['./tasks-tabs.component.scss'],

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
