import { Component, OnInit, Input } from '@angular/core';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';

@Component({
  selector: 'app-ticket-profile-updates',
  templateUrl: './ticket-profile-updates.component.html',
  styleUrls: ['./ticket-profile-updates.component.scss']
})
export class TicketProfileUpdatesComponent implements OnInit {
 @Input() updates: Array<TicketProfileUpdate>;
  constructor() { }

  ngOnInit() {
  }

}
