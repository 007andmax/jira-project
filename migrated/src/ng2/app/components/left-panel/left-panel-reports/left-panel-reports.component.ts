import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-left-panel-reports',
  templateUrl: './left-panel-reports.component.html',
  styleUrls: ['./left-panel-reports.component.scss']
})
export class LeftPanelReportsComponent implements OnInit {
  @Input() activePage: string = "";
  @Output() onChangeState = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  public goToState() {
    this.onChangeState.emit('new-reports');
  }
}
