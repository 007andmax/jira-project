import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { Document } from '../../class/document';

@Component({
  selector: 'documents-templates-info',
  templateUrl: './documents-templates-info.component.html',
  styleUrls: ['./documents-templates-info.component.scss']
})
export class DocumentsTemplatesInfoComponent implements OnInit, OnDestroy {
  openAside: boolean = false;
  showPreloader: boolean = true;
  document: Document;
  body: any;
  sub: Subscription = new Subscription();
  constructor(private documentsStateService: DocumentsStateService,
    private documentsService: DocumentsService) { }


  ngOnInit() {
    let onGetTemplate = this.documentsStateService.onGetTemplate.subscribe(data => {
      this.openAside = true;
      this.showPreloader = true;
      this.documentsService.getDocument(data.id).subscribe(document => {

        this.document = new Document(document);
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(this.document.content, 'text/html');
        console.log("htmlDoc", htmlDoc);
        console.log("htmlDoc", htmlDoc.textContent);
        this.body = htmlDoc.body;
        this.showPreloader = false;
      })

    })
    this.sub.add(onGetTemplate);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
