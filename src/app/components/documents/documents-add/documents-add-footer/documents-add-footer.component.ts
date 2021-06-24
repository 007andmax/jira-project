import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { Document } from '../../class/document';
import { DocumentAdd } from '../class/document-add';
import { DocumentValidate } from '../class/document-validate';

@Component({
  selector: 'app-documents-add-footer',
  templateUrl: './documents-add-footer.component.html',
  styleUrls: ['./documents-add-footer.component.scss']
})
export class DocumentsAddFooterComponent implements OnInit {
  @Input() requiredCompanyType: boolean;
  @Input() documentAdd: DocumentAdd;
  @Input() documentEdit: Document;
  @Input() templateId: string;
  @Input() companyId: string;

  @Input() documentValidate: DocumentValidate = new DocumentValidate();
  constructor(private documentsService: DocumentsService,
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    private router: Router,) { }

  ngOnInit() {
  }
  add(documentType) {
    this.documentAdd.setDocumentType(documentType);
    if (!this.documentValidate.isValidate(this.documentAdd)) return;
    if (this.templateId) {
      this.documentsService.add(this.documentAdd.getDataForAdByTemplate(this.templateId, this.companyId)).subscribe(data => {
        this.goToDocumentsList();
      })
    } else {
      this.documentsService.add(this.documentAdd.getDataForAdd()).subscribe(data => {
        this.goToDocumentsList();
      })
    }
  }
  public goToDocumentsList() {
    if (this.companyId) {
      this.router.navigate(
        ['/ng2/company/', this.companyId, 'documents']);
    } else {
      this.leftPanelStateService.goToState('new-documents');
    }
  }
  edit() {
    if (!this.documentValidate.isValidate(this.documentEdit)) return;
    this.documentsService.edit(this.documentEdit.id, this.documentEdit.getDataForEdit()).subscribe(data => {
      this.goToDocumentsList();
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
