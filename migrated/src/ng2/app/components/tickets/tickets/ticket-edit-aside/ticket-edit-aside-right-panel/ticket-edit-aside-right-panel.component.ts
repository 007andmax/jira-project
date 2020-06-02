import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TicketProfile } from '../../class/ticket-profile';

@Component({
  selector: 'app-ticket-edit-aside-right-panel',
  templateUrl: './ticket-edit-aside-right-panel.component.html',
  styleUrls: ['./ticket-edit-aside-right-panel.component.scss']
})
export class TicketEditAsideRightPanelComponent implements OnInit {
  @Input() ticketProfile: TicketProfile;
  type: string = '';
  toggleRightPanel: boolean = false;
  opened: boolean = false;
  constructor(public cd: ChangeDetectorRef, ) { }

  ngOnInit() {
  }
  public togglePanel() {
    this.opened = !this.opened;
    if (!this.opened) {
      this.close();
    } else {
      this.type = 'COMPANY_INFO';
      this.toggleRightPanel = true;
    }
  }

  public toggleTypeOnPanel(type = null) {
    console.log("type", type);
  
    console.log("3");
    if (this.toggleRightPanel && this.type === type) {
      this.toggleRightPanel = false;
      this.type = 'COMPANY_INFO';
    } else if (this.toggleRightPanel && this.type !== type) {
      this.type = type;
    } else if (!this.toggleRightPanel) {
      this.toggleRightPanel = true;
      this.type = type;
      this.opened = true;
    }
    this.cd.detectChanges();
  }
  public close() {
    this.type = '';
    this.toggleRightPanel = false;
    this.opened  =false;
  }
}
