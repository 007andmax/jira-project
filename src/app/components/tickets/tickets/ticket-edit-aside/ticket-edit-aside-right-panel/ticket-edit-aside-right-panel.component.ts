import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
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
  constructor(public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,) { }

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
    this.opened = false;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
