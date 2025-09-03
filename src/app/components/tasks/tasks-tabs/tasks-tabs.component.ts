import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks-tabs',
  templateUrl: './tasks-tabs.component.html',
  styleUrls: ['./tasks-tabs.component.scss']
})
export class TasksTabsComponent {
  activeTab: string = "list";


  setTab(data) {
    this.activeTab = data['nextId'];
  }
}
