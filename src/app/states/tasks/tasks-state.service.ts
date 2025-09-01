import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksStateService {
  onOpenAddTasks: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public openAddAside() {
    this.onOpenAddTasks.next(null);
  }
}
