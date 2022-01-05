import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-left-panel-devices',
  templateUrl: './left-panel-devices.component.html',
  styleUrls: ['./left-panel-devices.component.scss']
})
export class LeftPanelDevicesComponent implements OnInit {
  type: string = 'Dashboard';
  open: boolean = false;
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private leftPanelStateService: LeftPanelStateService,) { }

  ngOnInit() {
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isSupportPage(state)) this.open = false
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isSupportPage(data)) this.open = true;
    })
  }

  isSupportPage(state) {
    return (state === 'new-devices');
  }

  openPanel(){
    this.onOpenPanel.emit(null);
  }

  public goToState(state) {
    this.onChangeState.emit(state);
  }

  onFilter(active){
    this.type = active;
    this.goToState('new-devices');
  }

  public close() {
    this.open = false;
  }

}
