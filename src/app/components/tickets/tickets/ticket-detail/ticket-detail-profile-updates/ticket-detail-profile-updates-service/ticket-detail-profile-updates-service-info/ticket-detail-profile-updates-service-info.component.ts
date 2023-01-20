import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileUpdatesServiceInfoComponent } from '../../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-info/ticket-profile-updates-service-info.component';

@Component({
  selector: 'ticket-detail-profile-updates-service-info',
  templateUrl: './ticket-detail-profile-updates-service-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service-info.component.scss']
})
export class TicketDetailProfileUpdatesServiceInfoComponent extends TicketProfileUpdatesServiceInfoComponent {
  @Input() showCompleteLabel: boolean = false;
}
