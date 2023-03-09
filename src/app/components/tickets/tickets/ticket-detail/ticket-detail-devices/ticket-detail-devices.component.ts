import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-detail-devices',
  templateUrl: './ticket-detail-devices.component.html',
  styleUrls: ['./ticket-detail-devices.component.scss']
})
export class TicketDetailDevicesComponent implements OnInit {
  toggleContainer: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
