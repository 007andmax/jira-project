import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-detail-contact',
  templateUrl: './ticket-detail-contact.component.html',
  styleUrls: ['./ticket-detail-contact.component.scss']
})
export class TicketDetailContactComponent implements OnInit {
  toggleContainer: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
