import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

@Component({
  selector: 'app-ticket-profile-updates-note-item',
  templateUrl: './ticket-profile-updates-note-item.component.html',
  styleUrls: ['./ticket-profile-updates-note-item.component.scss']
})
export class TicketProfileUpdatesNoteItemComponent implements OnInit {
  @Input() update: TicketProfileUpdate;
  @Input() idTicket: string;
  @Input() isBlockChange: boolean;
  editMode: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
