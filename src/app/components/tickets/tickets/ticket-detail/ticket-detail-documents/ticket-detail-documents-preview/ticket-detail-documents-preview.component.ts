import { ChangeDetectorRef, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Document } from 'src/app/components/documents/class/document';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketStateService } from '../../../ticket-edit-aside/services/ticket-state.service';

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
    public router: Router,
    public companiesStateService: CompaniesStateService,
    public ticketStateService: TicketStateService,
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
  close() {
    this.ticketStateService.setDocumentForPreview(null);

  }
  printPdf() {
    const url = `/documents/show/${this.document.id}/pdf`;
    let open = window.open(url, '_blank');
    open.print();
  }
  editDocument() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().name.replaceAll(' ', '')}/documents/edit/`, this.document.id]);
  }
  exportPdf() {
    const url = `/documents/export?id=${this.document.id}`;
    window.open(url, '_blank');
  }


}
