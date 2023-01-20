import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileUpdatesProductInfoComponent } from '../../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-product/ticket-profile-updates-product-info/ticket-profile-updates-product-info.component';

@Component({
  selector: 'ticket-detail-profile-updates-product-info',
  templateUrl: './ticket-detail-profile-updates-product-info.component.html',
  styleUrls: ['./ticket-detail-profile-updates-product-info.component.scss']
})
export class TicketDetailProfileUpdatesProductInfoComponent extends TicketProfileUpdatesProductInfoComponent {

  @Input() showCompleteLabel: boolean = false;

}
