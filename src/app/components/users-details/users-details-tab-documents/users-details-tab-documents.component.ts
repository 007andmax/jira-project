import { Component, Input, OnInit } from '@angular/core';
import { DocumentsComponent } from '../../documents/documents.component';
import { User } from '../../users/class/user';
import { Document } from 'src/app/components/documents/class/document';
import { REMOVE_CATEGORY_DOCUMENT, REMOVE_DOCUMENT } from 'src/app/const/confirm';

@Component({
  selector: 'app-users-details-tab-documents',
  templateUrl: './users-details-tab-documents.component.html',
  styleUrls: ['./users-details-tab-documents.component.scss']
})
export class UsersDetailsTabDocumentsComponent extends DocumentsComponent {
  @Input() user: User;
  ngOnInit() {

    let onGetCategories = this.documentsStateService.onGetCategories.subscribe(data => {
      data.forEach(element => {
        let findIndex = this.list.findIndex(item => item.categoryId === element.id);
        if (findIndex > -1) this.list[findIndex].categoryName = element.name;
      });
      this.cd.detectChanges();
    })
    this.sub.add(onGetCategories);
    let onChangeDocument = this.documentsStateService.onChangeDocument.subscribe(data => {
      if (data.action === "DOCUMENT_SAVED" && !data.data.categoryId) this.list.push(new Document(data.data));
      if (data.action === "DOCUMENT_EDITED") {
        let findIndex = this.list.findIndex(item => item.id === data.data.id);
        if (findIndex > -1 && !data.data.categoryId) this.list[findIndex] = new Document(data.data);
        if (findIndex > -1 && data.data.categoryId) this.list.splice(findIndex, 1);
      }
      if (data.action === "DOCUMENT_REMOVED") {
        let findIndex = this.list.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.list.splice(findIndex, 1);
      }
      this.list.sort((a, b) => (this.getNameDocument(a).toLowerCase() > this.getNameDocument(b).toLowerCase()) ?
        1 : ((this.getNameDocument(b).toLowerCase() > this.getNameDocument(a).toLowerCase()) ? -1 : 0));
      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_DOCUMENT) this.removeCategory(this.documentsStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_DOCUMENT) this.removeDocument(this.documentsStateService.getDocumentForRemove());
      }
    })
    this.sub.add(getConfirm);
    this.filter.setUserId(this.user.id);
    this.getFilterList();
  }
  getFilterList() {
    this.showPreloader = true;
    this.list = [];
    this.documentsService.filterDocumentsForUserDetail(this.user.id).subscribe((data: any) => {
      this.list = [];
      data.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
  }

}