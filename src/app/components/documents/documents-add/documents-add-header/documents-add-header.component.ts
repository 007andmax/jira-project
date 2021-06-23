import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DocumentAdd } from '../class/document-add';
import { Document } from '../../class/document';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_DOCUMENT } from 'src/app/const/confirm';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documents-add-header',
  templateUrl: './documents-add-header.component.html',
  styleUrls: ['./documents-add-header.component.scss']
})
export class DocumentsAddHeaderComponent implements OnInit, OnDestroy {
  hideleLeftPanel: boolean = false;
  toggleFind: boolean = false;
  @Input() documentAdd: DocumentAdd;
  @Input() documentEdit: Document;
  sub: Subscription = new Subscription();
  constructor(private leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal,
    private documentsService: DocumentsService,
    public documentsStateService: DocumentsStateService,
    public confirmStateService: ConfirmStateService,
    private permissionsService: PermissionsService,) { }


  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_DOCUMENT) this.removeDocument(this.documentsStateService.getDocumentForRemove());

      }
    })
    this.sub.add(getConfirm);
  }
  removeDocument(item) {
    this.documentsService.removeDocument(item.id).subscribe(data => {

    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  onRemoveDocument() {
    this.confirmStateService.setConfirmAction(REMOVE_DOCUMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete this document?`;
    this.documentsStateService.setDocumentForRemove(this.documentEdit);
  }
  previewDocument() {

    const url = `/#/ng2/documents/preview/${this.documentEdit.id}`;
    console.log("url", url);
    window.open(url, '_blank');
  }
  onToggleLeftPanel() {
    this.hideleLeftPanel = !this.hideleLeftPanel;
    this.leftPanelStateService.hideLeftPanel(this.hideleLeftPanel);
  }
  exportPdf() {
    const url = `/documents/export?id=${this.documentEdit.id}`;
    console.log("url", url);
    window.open(url, '_blank');
  }
  printPdf() {
    const url = `/documents/show/${this.documentEdit.id}/pdf`;
    console.log("url", url);
    let open = window.open(url, '_blank');
    open.print();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
