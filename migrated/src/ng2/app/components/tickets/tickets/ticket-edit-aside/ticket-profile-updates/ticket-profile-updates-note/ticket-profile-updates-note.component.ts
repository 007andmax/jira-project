import { Component, OnInit, Input } from '@angular/core';
import { TicketsListService } from '../../../services/tickets-list.service';
import { TicketProfileUpdate } from '../../../class/ticket-profile-update';

@Component({
  selector: 'app-ticket-profile-updates-note',
  templateUrl: './ticket-profile-updates-note.component.html',
  styleUrls: ['./ticket-profile-updates-note.component.scss']
})
export class TicketProfileUpdatesNoteComponent implements OnInit {
  @Input() update:TicketProfileUpdate;
  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
  }

}
