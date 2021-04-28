import { Component, OnInit } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'app-documents-add-header',
  templateUrl: './documents-add-header.component.html',
  styleUrls: ['./documents-add-header.component.scss']
})
export class DocumentsAddHeaderComponent implements OnInit {
  hideleLeftPanel: boolean = false;
  constructor(private leftPanelStateService: LeftPanelStateService,) { }

  ngOnInit() {
  }
  onToggleLeftPanel() {
    this.hideleLeftPanel = !this.hideleLeftPanel;
    this.leftPanelStateService.hideLeftPanel(this.hideleLeftPanel);
  }
}
