import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-detail-passwords',
  templateUrl: './ticket-detail-passwords.component.html',
  styleUrls: ['./ticket-detail-passwords.component.scss']
})
export class TicketDetailPasswordsComponent implements OnInit {
  toggleContainer: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
