import { Component, OnInit } from '@angular/core';
import { TicketChangeStatusComponent } from '../../ticket-edit-aside/ticket-change-status/ticket-change-status.component';

@Component({
  selector: 'ticket-detail-info-status',
  templateUrl: './ticket-detail-info-status.component.html',
  styleUrls: ['./ticket-detail-info-status.component.scss']
})
export class TicketDetailInfoStatusComponent extends TicketChangeStatusComponent {

}
