import { Component, OnInit } from '@angular/core';
import { SupportStateService } from 'src/ng2/app/states/support/support-state.service';

@Component({
  selector: 'app-left-panel-support',
  templateUrl: './left-panel-support.component.html',
  styleUrls: ['./left-panel-support.component.scss']
})
export class LeftPanelSupportComponent implements OnInit {
  activePage: string = 'ALL';
  constructor(private supportStateService: SupportStateService) { }

  ngOnInit() {
  }
  onFilter(active) {
    this.supportStateService.onHandleFilter(active);
    this.activePage = active;
  }
}
