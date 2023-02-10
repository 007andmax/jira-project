import { Component, OnInit } from '@angular/core';
import { TicketProfileAttachmentsComponent } from '../../ticket-edit-aside/ticket-profile-attachments/ticket-profile-attachments.component';

@Component({
  selector: 'ticket-detail-attachments',
  templateUrl: './ticket-detail-attachments.component.html',
  styleUrls: ['./ticket-detail-attachments.component.scss']
})
export class TicketDetailAttachmentsComponent extends TicketProfileAttachmentsComponent {

}
