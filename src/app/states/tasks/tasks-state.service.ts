import { EventEmitter, Injectable } from '@angular/core';
import { TasksFilters } from 'src/app/components/tasks/class/tasks-filters';

@Injectable({
  providedIn: 'root'
})
export class TasksStateService {
  onOpenEditTasks: EventEmitter<any> = new EventEmitter();
  onOpenAddTasks: EventEmitter<any> = new EventEmitter();
  onOpenAddTasksFromShortVersion: EventEmitter<any> = new EventEmitter();
  onFilter: EventEmitter<any> = new EventEmitter();
  onToggleFilter: EventEmitter<any> = new EventEmitter();
  onFastRemove: EventEmitter<any> = new EventEmitter();
  filter: TasksFilters = new TasksFilters();
  constructor() { }
  public fastRemoveTask(data) {
    this.onFastRemove.emit(data);
  }
  public changeToggleFilter(data) {
    this.onToggleFilter.emit(data);
  }
  public setFilter(data) {
    this.filter = data;
  }
  public onInitFilter(data) {
    this.filter = data;
    this.onFilter.emit(data);
  }
  public openAddAsideFromShortVersion(data) {
    this.onOpenAddTasksFromShortVersion.next(data);
  }
  public openAddAside() {
    this.onOpenAddTasks.next(null);
  }
  public openEditAside(data) {
    this.onOpenEditTasks.next(data);
  }
}
