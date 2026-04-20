import { Component } from '@angular/core';
import { TasksStateService } from 'src/app/states/tasks/tasks-state.service';
import { TasksFilters } from '../class/tasks-filters';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tasks-header',
    templateUrl: './tasks-header.component.html',
    styleUrls: ['./tasks-header.component.scss'],
    standalone: true
})
export class TasksHeaderComponent {
  toggleFilter: boolean = false;
  filter: TasksFilters = new TasksFilters();
  sub: Subscription = new Subscription();
  constructor(private tasksStateService: TasksStateService,

  ) { }
  ngOnInit() {
    let getOnInitFilter = this.tasksStateService.onFilter.subscribe(data => {
      this.filter.setFilter(data);

    })
    this.sub.add(getOnInitFilter);
    let onToggleFilter = this.tasksStateService.onToggleFilter.subscribe(data => {
      this.toggleFilter = data;
    })
    this.sub.add(onToggleFilter);
  }
  showAsideForAdd() {
    this.tasksStateService.openAddAside();
  }
  isExistFilters() {
    return this.filter.filter ||
      this.filter.techUser;
  }
  onToggleFilter(data) {
    this.toggleFilter = data;
    this.tasksStateService.changeToggleFilter(this.toggleFilter);
  }
}
