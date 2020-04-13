import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-edit-aside',
  templateUrl: './ticket-edit-aside.component.html',
  styleUrls: ['./ticket-edit-aside.component.scss']
})
export class TicketEditAsideComponent implements OnInit {

  opened = false;
  modeSubject = 'view';
  modeDescription = 'view';
  constructor() { }

  ngOnInit() {
  }

}
