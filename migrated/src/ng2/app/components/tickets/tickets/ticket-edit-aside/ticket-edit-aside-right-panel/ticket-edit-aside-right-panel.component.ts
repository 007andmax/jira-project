import { Component, OnInit, Input } from '@angular/core';
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
  constructor() { }

  ngOnInit() {
  }
  public togglePanel(type) {
    if (this.toggleRightPanel && this.type === type) {
      this.toggleRightPanel = false;
      this.type = 'COMPANY_INFO';
    } else if (this.toggleRightPanel && this.type !== type) {
      this.type = type;
    } else if (!this.toggleRightPanel) {
      this.toggleRightPanel = true;
      this.type = type;
    }

  }
}
