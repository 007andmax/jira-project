import { TicketDetailProfileUpdatesNoteEditComponent } from './';
import { TicketDetailProfileUpdatesNoteInfoComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

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
