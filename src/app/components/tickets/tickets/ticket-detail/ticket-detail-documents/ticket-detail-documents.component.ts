import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from 'src/app/components/documents/class/document';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';

@Component({
  selector: 'ticket-detail-documents',
  templateUrl: './ticket-detail-documents.component.html',
  styleUrls: ['./ticket-detail-documents.component.scss']
})
export class TicketDetailDocumentsComponent implements OnInit {
  @Output() onViewDocument = new EventEmitter<any>();
  toggleContainer: boolean = true;
  documents: Array<Document> = [];
  constructor(private ticketStateService: TicketStateService,) { }

  ngOnInit() {
    this.documents = this.ticketStateService.getDocuments();
    this.ticketStateService.onGetDocuments.subscribe(data => {
      this.documents = data;
    })

  }
  viewDocument(data) {
    this.onViewDocument.emit(data);
  }

}
