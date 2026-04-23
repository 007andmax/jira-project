
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';
import { TicketDetailProfileUpdatesNoteEditComponent } from '../ticket-detail-profile-updates-note-edit/ticket-detail-profile-updates-note-edit.component';
import { TicketDetailProfileUpdatesNoteInfoComponent } from '../ticket-detail-profile-updates-note-info/ticket-detail-profile-updates-note-info.component';

@Component({
  standalone: true,
  imports: [TicketDetailProfileUpdatesNoteEditComponent, TicketDetailProfileUpdatesNoteInfoComponent, CommonModule],
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
  public edit() {
    this.editMode = true;
  }
}
