import { Component, EventEmitter, Output } from '@angular/core';
import { SupportItemComponent } from 'src/app/components/support/support-item/support-item.component';

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
