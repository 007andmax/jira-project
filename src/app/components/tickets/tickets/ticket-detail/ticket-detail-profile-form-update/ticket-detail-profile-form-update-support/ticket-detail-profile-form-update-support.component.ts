import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SupportItemComponent } from 'src/app/components/support/support-item/support-item.component';
@Component({
    selector: 'ticket-detail-profile-form-update-support',
    templateUrl: './ticket-detail-profile-form-update-support.component.html',
    styleUrls: ['./ticket-detail-profile-form-update-support.component.scss']
})
export class TicketDetailProfileFormUpdateSupportComponent extends SupportItemComponent {
    @Output() onCreateOneTimeRemoteSession = new EventEmitter();
    public create() {
        this.onCreateOneTimeRemoteSession.emit(null);
    }
}