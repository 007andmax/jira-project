import { Component, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { Document } from '../../class/document';

@Component({
  selector: 'documents-templates-info',
  templateUrl: './documents-templates-info.component.html',
  styleUrls: ['./documents-templates-info.component.scss']
})
export class DocumentsTemplatesInfoComponent implements OnInit {
  openAside: boolean = false;
  showPreloader: boolean = true;
  document: Document;
  constructor(private documentsStateService: DocumentsStateService,
    private documentsService: DocumentsService) { }

  ngOnInit() {
    this.documentsStateService.onGetTemplate.subscribe(data => {
      this.openAside = true;
      this.showPreloader = true;
      this.documentsService.getDocument(data.id).subscribe(document => {
        this.document = new Document(document);
        this.showPreloader = false;
      })

    })
  }

}
