import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileUpdatesServiceItemComponent } from '../../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-service/ticket-profile-updates-service-item/ticket-profile-updates-service-item.component';

@Component({
  selector: 'ticket-detail-profile-updates-service-item',
  templateUrl: './ticket-detail-profile-updates-service-item.component.html',
  styleUrls: ['./ticket-detail-profile-updates-service-item.component.scss']
})
export class TicketDetailProfileUpdatesServiceItemComponent extends TicketProfileUpdatesServiceItemComponent {
  @Input() showCompleteLabel: boolean = false;
  @Input() index: number;
}
