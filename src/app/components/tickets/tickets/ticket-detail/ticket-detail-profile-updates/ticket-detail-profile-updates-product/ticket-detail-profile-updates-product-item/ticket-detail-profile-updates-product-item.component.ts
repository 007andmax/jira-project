import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileUpdatesProductItemComponent } from '../../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-item/ticket-profile-updates-product-item.component';

@Component({
  selector: 'ticket-detail-profile-updates-product-item',
  templateUrl: './ticket-detail-profile-updates-product-item.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-item.component.scss']
})
export class TicketDetailProfileUpdatesProductItemComponent extends TicketProfileUpdatesProductItemComponent {
  @Input() showCompleteLabel: boolean = false;
  @Input() index: number;
}
