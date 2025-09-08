import { EventEmitter, Injectable } from '@angular/core';
import { TasksFilters } from 'src/app/components/tasks/class/tasks-filters';

@Injectable({
  providedIn: 'root'
})
export class TasksStateService {
  onOpenEditTasks: EventEmitter<any> = new EventEmitter();
  onOpenAddTasks: EventEmitter<any> = new EventEmitter();
  onFilter: EventEmitter<any> = new EventEmitter();
  filter: TasksFilters = new TasksFilters();
  constructor() { }

  public onInitFilter(data) {
    this.filter = data;
    this.onFilter.emit(data);
  }
  public openAddAside() {
    this.onOpenAddTasks.next(null);
  }
  public openEditAside(data) {
    this.onOpenEditTasks.next(data);
  }
}
