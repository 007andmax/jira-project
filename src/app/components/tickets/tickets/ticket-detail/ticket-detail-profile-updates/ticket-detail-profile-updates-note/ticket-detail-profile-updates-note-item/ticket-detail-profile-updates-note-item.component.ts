import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

@Component({
  selector: 'ticket-detail-profile-updates-note-item',
  templateUrl: './ticket-detail-profile-updates-note-item.component.html',
  styleUrls: ['./ticket-detail-profile-updates-note-item.component.scss']
})
export class TicketDetailProfileUpdatesNoteItemComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  @Input() idTicket: string;
  @Input() isBlockChange: boolean;
  editMode: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
