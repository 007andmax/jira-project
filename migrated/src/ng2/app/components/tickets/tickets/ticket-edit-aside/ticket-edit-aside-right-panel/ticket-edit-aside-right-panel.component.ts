import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TicketProfile } from '../../class/ticket-profile';

@Component({
  selector: 'app-ticket-edit-aside-right-panel',
  templateUrl: './ticket-edit-aside-right-panel.component.html',
  styleUrls: ['./ticket-edit-aside-right-panel.component.scss']
})
export class TicketEditAsideRightPanelComponent implements OnInit {
  @Input() ticketProfile: TicketProfile;
  type: string = 'COMPANY_INFO';
  toggleRightPanel: boolean = false;
  constructor(public cd: ChangeDetectorRef, ) { }

  ngOnInit() {
  }
  public togglePanel(type = null) {
    console.log("type", type);
    if (this.toggleRightPanel && !type) {
      this.toggleRightPanel = false;
      console.log("1");
      return;
    }
    if (!this.toggleRightPanel && !type) {
      this.toggleRightPanel = true;
      this.type = 'COMPANY_INFO';
      console.log("2");
      return;
    }
    console.log("3");
    if (this.toggleRightPanel && this.type === type) {
      this.toggleRightPanel = false;
      this.type = 'COMPANY_INFO';
    } else if (this.toggleRightPanel && this.type !== type) {
      this.type = type;
    } else if (!this.toggleRightPanel) {
      this.toggleRightPanel = true;
      this.type = type;
    }
    this.cd.detectChanges();
  }
}
