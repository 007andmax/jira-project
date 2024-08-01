import { Component, OnInit } from '@angular/core';
import { TicketDetailEditTagsComponent } from 'src/app/components/tickets/tickets/ticket-detail/ticket-detail-edit-tags/ticket-detail-edit-tags.component';
import { TicketsPermissionsService } from 'src/app/components/tickets/tickets/ticket-edit-aside/services/tickets-permissions.service';

@Component({
  selector: 'app-file-management-file-info-tags',
  templateUrl: './file-management-file-info-tags.component.html',
  styleUrls: ['./file-management-file-info-tags.component.scss'],
  providers: [TicketsPermissionsService]
})
export class FileManagementFileInfoTagsComponent extends TicketDetailEditTagsComponent {



}
