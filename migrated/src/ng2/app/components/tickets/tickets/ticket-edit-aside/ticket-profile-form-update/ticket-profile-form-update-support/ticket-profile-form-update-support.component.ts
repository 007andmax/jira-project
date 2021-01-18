import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RemoteSession } from 'src/ng2/app/components/support/class/remote-sessions';
import { SupportItemComponent } from 'src/ng2/app/components/support/support-item/support-item.component';

@Component({
  selector: 'app-ticket-profile-form-update-support',
  templateUrl: './ticket-profile-form-update-support.component.html',
  styleUrls: ['./ticket-profile-form-update-support.component.scss']
})
export class TicketProfileFormUpdateSupportComponent extends SupportItemComponent {

  @Output() onCreateOneTimeRemoteSession = new EventEmitter();

  public create() {
    this.onCreateOneTimeRemoteSession.emit(null);
  }

}
