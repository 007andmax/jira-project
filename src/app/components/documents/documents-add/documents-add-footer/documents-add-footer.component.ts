import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
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
  checkAttachments() {
    if (this.documentEdit.content != this.documentEdit.newContent) {
      let oldAttachments = [];
      let newAttachments = [];
      let removedAttachments = [];
      var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
      this.documentEdit.content.replace(urlRegex, function (url) {
        var hyperlink = url;
        // console.log("hyperlink", hyperlink);
        oldAttachments.push(url.replace('\"', ''));
        return url;
      });
      this.documentEdit.newContent.replace(urlRegex, function (url) {
        var hyperlink = url;
        // console.log("hyperlink", hyperlink);
        newAttachments.push(url.replace('\"', ''));
        return url;
      });
      console.log("oldAttachments", oldAttachments);
      console.log("newAttachments", newAttachments);

      removedAttachments = this.diff(oldAttachments, newAttachments)

      /* if (oldAttachments.length === newAttachments.length) {
         oldAttachments.forEach(item => {
           if (!newAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
         })
       }
 
       if (oldAttachments.length !== newAttachments.length) {
         oldAttachments.forEach(item => {
           if (!newAttachments.find(newItem => newItem === item)) removedAttachments.push(item);
         })
       }*/

      console.log("removedAttachments", removedAttachments);
      let removedAttachmentsIds = removedAttachments.map(item => item.substring(item.indexOf("file/") + 5, item.length));
      console.log("removedAttachmentsIds", removedAttachmentsIds);
    }
  }
  diff(a1, a2) {
    return a1.filter(i => !a2.includes(i))
      .concat(a2.filter(i => !a1.includes(i)))
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
      this.checkAttachments();
      this.goToDocumentsList();
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
}
