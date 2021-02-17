import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/ng2/app/states/left-panel/left-panel-state.service';
import { SupportStateService } from 'src/ng2/app/states/support/support-state.service';

@Component({
  selector: 'app-left-panel-support',
  templateUrl: './left-panel-support.component.html',
  styleUrls: ['./left-panel-support.component.scss']
})
export class LeftPanelSupportComponent implements OnInit {
  type: string = 'ALL';
  open: boolean = false;
  @Input() activePage: string = "";
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private supportStateService: SupportStateService,
    private leftPanelStateService: LeftPanelStateService,) { }

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
    return (state === 'new-quickSupport');
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  /**
   * Filter by password types
   * * @param state - state to go
   */
  public goToState(state) {
    this.onChangeState.emit(state);
  }
  onFilter(active) {
    this.supportStateService.onHandleFilter(active);
    this.type = active;
    this.goToState('new-quickSupport');
  }
}
