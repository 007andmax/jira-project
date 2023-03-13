import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Document } from 'src/app/components/documents/class/document';
import { DocumentFilter } from 'src/app/components/documents/class/document-filter';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { TicketProfile } from '../../../class/ticket-profile';

@Component({
  selector: 'ticket-detail-documents-details',
  templateUrl: './ticket-detail-documents-details.component.html',
  styleUrls: ['./ticket-detail-documents-details.component.scss']
})
export class TicketDetailDocumentsDetailsComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onClose = new EventEmitter<any>();
  @Output() onViewDocument = new EventEmitter<any>();
  showPreloader: boolean = false;
  documents: Array<Document> = [];
  documentsReq: Array<Document> = [];
  filter: DocumentFilter = new DocumentFilter();
  constructor(public documentsService: DocumentsService) { }

  ngOnInit() {
    this.showPreloader = true;
    this.filter.setCompanyId(this.ticketProfile.company.id);
    this.documentsService.filterDocuments(this.filter.getDataForFilter()).subscribe((data: any) => {
      data.map(item => this.documents.push(new Document(item)));
      data.map(item => this.documentsReq.push(new Document(item)));
      this.documents.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
  }
  viewDocument(data) {
    this.onViewDocument.emit(data);
  }
  search(event) {
    if (event.target.value.length > 0) {
      this.documents = this.documentsReq.filter(item => item.title.toLowerCase().includes(event.target.value.toLowerCase()));
    } else {
      this.documents = JSON.parse(JSON.stringify(this.documentsReq));
    }
  }
  close() {
    this.onClose.emit(null);
  }
}
