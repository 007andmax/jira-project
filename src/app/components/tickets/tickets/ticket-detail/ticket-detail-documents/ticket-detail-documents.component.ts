import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ticket-detail-documents',
  templateUrl: './ticket-detail-documents.component.html',
  styleUrls: ['./ticket-detail-documents.component.scss']
})
export class TicketDetailDocumentsComponent implements OnInit {
  toggleContainer: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
