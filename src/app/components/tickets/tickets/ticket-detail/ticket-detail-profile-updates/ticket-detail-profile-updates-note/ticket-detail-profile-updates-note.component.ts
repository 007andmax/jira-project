import { Component, OnInit, ViewChildren } from '@angular/core';
import { TicketProfileUpdatesNoteComponent } from '../../../ticket-edit-aside/ticket-profile-updates/ticket-profile-updates-note/ticket-profile-updates-note.component';
import { TicketDetailProfileUpdatesNoteInfoComponent } from './ticket-detail-profile-updates-note-info/ticket-detail-profile-updates-note-info.component';
import { TicketDetailProfileUpdatesNoteItemComponent } from './ticket-detail-profile-updates-note-item/ticket-detail-profile-updates-note-item.component';

@Component({
  selector: 'ticket-detail-profile-updates-note',
  templateUrl: './ticket-detail-profile-updates-note.component.html',
  styleUrls: ['./ticket-detail-profile-updates-note.component.scss']
})
export class TicketDetailProfileUpdatesNoteComponent extends TicketProfileUpdatesNoteComponent {
  @ViewChildren("updatesNoteItem") updatesNoteItem: TicketDetailProfileUpdatesNoteItemComponent;

  public isIOSDevice() {
    return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  }
}
