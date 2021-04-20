import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-left-panel-documents',
  templateUrl: './left-panel-documents.component.html',
  styleUrls: ['./left-panel-documents.component.scss']
})
export class LeftPanelDocumentsComponent implements OnInit {

  @Output() onChangeState = new EventEmitter();
  @Input() activePage: string = "";

  constructor() { }

  ngOnInit() {
  }

  public goToState() {
    this.onChangeState.emit('new-documents');
  }
}
