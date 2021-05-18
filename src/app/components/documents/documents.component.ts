import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import FroalaEditor from 'froala-editor';
import { Subscription } from 'rxjs';
import { REMOVE_CATEGORY_DOCUMENT, REMOVE_DOCUMENT } from 'src/app/const/confirm';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { Document } from './class/document';



@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  showPreloader: boolean = true;
  list: Array<Document> = [];
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private documentsStateService: DocumentsStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private documentsService: DocumentsService) {

  }


  ngOnInit() {
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_DOCUMENT) this.removeCategory(this.documentsStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_DOCUMENT) this.removeDocument(this.documentsStateService.getDocumentForRemove());

      }
    })
    this.sub.add(getConfirm);
    this.documentsService.getList().subscribe((data: any) => {
      data.categories.map(item => this.list.push(new Document({ categoryId: item.id, categoryName: item.name })));
      data.documents.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (this.getNameDocument(a).toLowerCase() > this.getNameDocument(b).toLowerCase()) ?
        1 : ((this.getNameDocument(b).toLowerCase() > this.getNameDocument(a).toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }
  removeCategory(item) {
    this.documentsService.removeCategories(item.categoryId).subscribe(data => {

    })
  }
  removeDocument(item) {
    this.documentsService.removeDocument(item.id).subscribe(data => {

    })
  }
  getNameDocument(item: Document) {
    if (item.categoryId) return item.categoryName;
    return item.title;

  }
  onRemoveCategory(data) {
    this.confirmStateService.setConfirmAction(REMOVE_CATEGORY_DOCUMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete this category?`;
    this.documentsStateService.setCategoryForRemove(data);
  }
  onRemoveDocument(data) {
    this.confirmStateService.setConfirmAction(REMOVE_DOCUMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete this document?`;
    this.documentsStateService.setDocumentForRemove(data);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
