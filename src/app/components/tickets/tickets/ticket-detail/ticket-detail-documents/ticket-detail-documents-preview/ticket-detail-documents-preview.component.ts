import { ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Document } from 'src/app/components/documents/class/document';
import { DocumentsService } from 'src/app/services/documents/documents.service';

@Component({
  selector: 'ticket-detail-documents-preview',
  templateUrl: './ticket-detail-documents-preview.component.html',
  styleUrls: ['./ticket-detail-documents-preview.component.scss']
})
export class TicketDetailDocumentsPreviewComponent implements OnInit {
  @Input() document: Document;
  showPreloader: boolean = false;
  constructor(private documentsService: DocumentsService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.showPreloader = true;
    this.documentsService.getDocument(this.document.id).subscribe(data => {
      this.document = new Document(data);
      console.log("this.document", this.document);
      this.elRef.nativeElement.querySelector(".documents-create-panel__content").insertAdjacentHTML('afterbegin', this.document.content);
      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }

}
