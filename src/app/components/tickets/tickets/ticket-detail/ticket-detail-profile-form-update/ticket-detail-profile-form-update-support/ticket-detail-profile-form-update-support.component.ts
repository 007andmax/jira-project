import { DynamicTooltipComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SupportItemComponent } from 'src/app/components/support/support-item/support-item.component';
@Component({
  standalone: true,
  imports: [DynamicTooltipComponent, CommonModule],
    selector: 'ticket-detail-profile-form-update-support',
    templateUrl: './ticket-detail-profile-form-update-support.component.html',
    styleUrls: ['./ticket-detail-profile-form-update-support.component.scss'],
    standalone: true
})
export class TicketDetailProfileFormUpdateSupportComponent extends SupportItemComponent {
    @Output() onCreateOneTimeRemoteSession = new EventEmitter();
    public create() {
        this.onCreateOneTimeRemoteSession.emit(null);
    }
}