import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../../../class/ticket-profile-update';

@Component({
  selector: 'app-ticket-profile-updates-note-info',
  templateUrl: './ticket-profile-updates-note-info.component.html',
  styleUrls: ['./ticket-profile-updates-note-info.component.scss']
})
export class TicketProfileUpdatesNoteInfoComponent implements OnInit {
  @Output() onEdit = new EventEmitter();
  @Input() update: TicketProfileUpdate;
  constructor() { }

  ngOnInit() {
  }
  edit() {
    this.onEdit.emit(null);
  }
}
