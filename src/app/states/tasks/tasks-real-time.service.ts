import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TasksRealTimeService {

  public changeTasksArray: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public handleRealTimeChanges(newChange) {
    this.changeTasksArray.emit(newChange);
  }
}
