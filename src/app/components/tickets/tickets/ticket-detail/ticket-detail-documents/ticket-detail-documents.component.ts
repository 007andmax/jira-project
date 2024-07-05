import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from 'src/app/components/documents/class/document';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ticket-detail-documents',
  templateUrl: './ticket-detail-documents.component.html',
  styleUrls: ['./ticket-detail-documents.component.scss']
})
export class TicketDetailDocumentsComponent implements OnInit {
  @Output() onViewDocument = new EventEmitter<any>();
  @Output() onShowMore = new EventEmitter<any>();
  toggleContainer: boolean = true;
  documents: Array<Document> = [];
  sub: Subscription = new Subscription();
  constructor(public ticketStateService: TicketStateService,) { }

  ngOnInit() {
    this.documents = this.ticketStateService.getDocuments();
    let onGetDocuments = this.ticketStateService.onGetDocuments.subscribe(data => {
      this.documents = data;
    })
    this.sub.add(onGetDocuments);
  }
  viewDocument(data) {
    this.onViewDocument.emit(data);
  }
  showMore() {
    this.onShowMore.emit(null);
  }
  public trackByIndex(index, item) {
    return index;
  }
}
