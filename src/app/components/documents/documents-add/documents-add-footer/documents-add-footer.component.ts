import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { environment } from 'src/environments/environment';
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
  @Input() attachments = [];
  @Input() documentValidate: DocumentValidate = new DocumentValidate();
  constructor(private documentsService: DocumentsService,
    private leftPanelStateService: LeftPanelStateService,
    private permissionsService: PermissionsService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private router: Router,) { }

  ngOnInit() {
  }
  add(documentType) {
    this.documentAdd.setDocumentType(documentType);
    if (!this.documentValidate.isValidate(this.documentAdd)) return;
    if (this.templateId) {
      this.documentsService.add(this.documentAdd.getDataForAdByTemplate(this.templateId, this.companyId)).subscribe(data => {
        this.showNotificationAfterCreate(documentType);
        this.checkAttachments("", this.documentAdd.content);
        this.goToDocumentsList();
      })
    } else {
      this.documentsService.add(this.documentAdd.getDataForAdd()).subscribe(data => {
        this.showNotificationAfterCreate(documentType);
        this.checkAttachments("", this.documentAdd.content);
        this.goToDocumentsList();
      })
    }
  }
  showNotificationAfterCreate(documentType) {
    if (documentType === "DOCUMENT") {
      this.toastrService.success("The new document been successfully created");
      this.appStateService.changeDetectorRef();
    }
    if (documentType === "TEMPLATE") {
      this.toastrService.success("The new template been successfully created");
      this.appStateService.changeDetectorRef();
    }
  }
  checkAttachments(content, newContent) {
    let oldAttachments = this.attachments;
    let newAttachments = [];
    let removedAttachments = [];
    var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
    content.replace(urlRegex, function (url) {
      oldAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });
    newContent.replace(urlRegex, function (url) {
      newAttachments.push(url.replace('\"', '').replace('/attachment', ''));
      return url;
    });
    oldAttachments.forEach(item => {
      if (!newAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
    })
    let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));
    forkJoin(
      [...removedAttachmentsIds.map(item => this.documentsService.removeDocumentAttachment(item))]
    )
      .subscribe(res => {
      });
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
      if (this.documentEdit.isTemplateForEdit()) {
        this.toastrService.success("The template has been successfully updated");
        this.appStateService.changeDetectorRef();
      } else {
        this.toastrService.success("The document has been successfully updated");
        this.appStateService.changeDetectorRef();
      }
      this.checkAttachments(this.documentEdit.content, this.documentEdit.newContent);
      this.goToDocumentsList();
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
