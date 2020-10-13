import { Injectable, EventEmitter } from '@angular/core';
import { ShellRealTimeService } from './shell-real-time.service';

@Injectable({
  providedIn: 'root'
})
export class ShellStateService {
  cmdOutput:Object = {};
  onChangeCmdOutput: EventEmitter<any> = new EventEmitter();
  onGetCmdOutput: EventEmitter<any> = new EventEmitter();

  constructor(
    private shellRealTimeService: ShellRealTimeService
  ) { }

  public onInit() {

    this.shellRealTimeService.changeShellOutput.subscribe(newChange => {
      if (newChange.action === "CMD_SHELL_OUTPUT") {
        this.onGetCmdOutput.emit(newChange);
      }
    })
  }
  public getCmdOutput() {
    return this.onGetCmdOutput;
  }
}
