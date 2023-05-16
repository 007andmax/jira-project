import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TerminalStateService {
  onGetCmdCategoryRead: EventEmitter<any> = new EventEmitter();
  constructor() { }

  public initGetCmdCategoryRead() {
    this.onGetCmdCategoryRead.emit(null);
  }
}
