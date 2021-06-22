import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { Document } from '../../class/document';
declare var $: any;
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
    private elRef: ElementRef,
    private permissionsService: PermissionsService,
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
        //console.log("$('.documents-create-panel__body')", $('.documents-create-panel__body'));
        //$('.documents-create-panel__body').parseHTML(this.document.content);
        this.elRef.nativeElement.querySelector(".documents-create-panel__body").innerHTML = '';
        this.elRef.nativeElement.querySelector(".documents-create-panel__body").scrollTo(0, 0);
        this.elRef.nativeElement.querySelector(".documents-create-panel__body").insertAdjacentHTML('afterbegin', this.document.content);
        // this.body = htmlDoc.getRootNode();
        this.showPreloader = false;
      })

    })
    this.sub.add(onGetTemplate);
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
