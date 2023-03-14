import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  isSearch: boolean = false;
  filter: DocumentFilter = new DocumentFilter();
  constructor(public documentsService: DocumentsService,
    private elRef: ElementRef,) { }

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
  clearSearch() {
    this.documents = JSON.parse(JSON.stringify(this.documentsReq));
    this.elRef.nativeElement.querySelector("#search-documents").value = '';
    this.isSearch = false;
  }
  viewDocument(data) {
    this.onViewDocument.emit(data);
  }
  search(event) {
    if (event.target.value.length > 0) {
      this.documents = this.documentsReq.filter(item => item.title.toLowerCase().includes(event.target.value.toLowerCase()));
      this.isSearch = true;
    } else {
      this.documents = JSON.parse(JSON.stringify(this.documentsReq));
      this.isSearch = false;
    }
  }
  close() {
    this.onClose.emit(null);
  }
}
