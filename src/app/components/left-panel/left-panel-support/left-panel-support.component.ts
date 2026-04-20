import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { SupportStateService } from 'src/app/states/support/support-state.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-left-panel-support',
    templateUrl: './left-panel-support.component.html',
    styleUrls: ['./left-panel-support.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class LeftPanelSupportComponent implements OnInit, OnDestroy {
  type: string = 'ALL';
  open: boolean = false;
  @Input() activePage: string = "";
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private supportStateService: SupportStateService,
    private leftPanelService: LeftPanelService,
    private leftPanelStateService: LeftPanelStateService,) { }


  ngOnInit() {
    let onToggleLeftPanel = this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.sub.add(onToggleLeftPanel);
    let onChangeState = this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.leftPanelService.isSupportPage(state)) this.open = false
    })
    this.sub.add(onChangeState);
    let onFirstOpen = this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.leftPanelService.isSupportPage(data)) this.open = true;
    })
    this.sub.add(onFirstOpen);
  }
  public close() {
    this.open = false;
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
  public onFilter(active) {
    this.supportStateService.onHandleFilter(active);
    this.type = active;
    this.goToState('new-quickSupport');
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
