import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { Document } from '../class/document';
import * as moment from "moment";

@Component({
  selector: 'document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {
  showPreloader: boolean = true;
  document: Document;
  body: any;
  sub: Subscription = new Subscription();
  constructor(private documentsStateService: DocumentsStateService,
    private elRef: ElementRef,
    private permissionsService: PermissionsService,
    public activateRoute: ActivatedRoute,
    public cd: ChangeDetectorRef,
    private router: Router,
    private leftPanelStateService: LeftPanelStateService,
    private documentsService: DocumentsService) { }

  ngOnInit() {
    this.leftPanelStateService.hideLeftPanel(true);
    let id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      console.log("id", id);
      this.getDocument(id);
    });
    this.sub.add(subscription);
    this.leftPanelStateService.changeStateWithoutNavigate('new-preview-documents');

  }
  public goToDocumentsList() {
    this.leftPanelStateService.hideLeftPanel(false);
    this.leftPanelStateService.goToState('new-documents');
  }
  getDocument(id) {
    this.showPreloader = true;
    this.documentsService.getDocument(id).subscribe((document: any) => {

      this.document = new Document(document);
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(this.document.content, 'text/html');
      console.log("htmlDoc", htmlDoc);
      console.log("htmlDoc", htmlDoc.textContent);

      this.elRef.nativeElement.querySelector(".documents-create-panel__content").insertAdjacentHTML('afterbegin', this.document.content);

      this.showPreloader = false;
      this.cd.detectChanges();
    })
  }
  editDocument() {
    this.leftPanelStateService.hideLeftPanel(false);
    this.router.navigate(
      ['/ng2/documents/edit/', this.document.id]);
  }
  getLastEdit() {
    let date = new Date(this.document.updatedAt);
    return `Last edited on ${moment(date).format('MMM DD, YYYY')}`;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
