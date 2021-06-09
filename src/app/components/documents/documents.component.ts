import { ChangeDetectorRef, Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { DocumentFilter } from './class/document-filter';



@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {

  showPreloader: boolean = true;
  list: Array<Document> = [];
  filter: DocumentFilter = new DocumentFilter();
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private documentsStateService: DocumentsStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    private documentsService: DocumentsService) {

  }


  ngOnInit() {
    this.documentsStateService.onGetCategories.subscribe(data => {
      data.forEach(element => {
        let findIndex = this.list.findIndex(item => item.id === element.id);
        if (findIndex > -1) this.list[findIndex].categoryName = data.name;
      });
    })
    let onChangeDocument = this.documentsStateService.onChangeDocument.subscribe(data => {
      console.log("data", data);
      if (data.action === "DOCUMENT_SAVED" && !data.data.categoryId) this.list.push(new Document(data.data));
      if (data.action === "DOCUMENT_EDITED") {
        let findIndex = this.list.findIndex(item => item.id === data.data.id);
        if (findIndex > -1 && !data.data.categoryId) this.list[findIndex] = new Document(data.data);
        if (findIndex > -1 && data.data.categoryId) this.list.splice(findIndex, 1);
        console.log("findIndex", findIndex);
      }

      if (data.action === "DOCUMENT_REMOVED") {
        let findIndex = this.list.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.list.splice(findIndex, 1);
        console.log("findIndex", findIndex);
      }
      this.list.sort((a, b) => (this.getNameDocument(a).toLowerCase() > this.getNameDocument(b).toLowerCase()) ?
        1 : ((this.getNameDocument(b).toLowerCase() > this.getNameDocument(a).toLowerCase()) ? -1 : 0));
      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
    let filter = this.documentsStateService.filter.subscribe(data => {
      this.showPreloader = true;
      this.filter.setFilters(data);
      if (this.filter.isExistFilters()) {
        this.getFilterList();
      } else {
        this.getList();
      }
    })
    this.sub.add(filter);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_DOCUMENT) this.removeCategory(this.documentsStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_DOCUMENT) this.removeDocument(this.documentsStateService.getDocumentForRemove());

      }
    })
    this.sub.add(getConfirm);
    this.getList();
  }

  getList() {
    this.showPreloader = true;
    this.list = [];
    this.documentsService.getList().subscribe((data: any) => {

      data.categories.map(item => this.list.push(new Document({ categoryId: item.id, categoryName: item.name }, true)));
      data.documents.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (this.getNameDocument(a).toLowerCase() > this.getNameDocument(b).toLowerCase()) ?
        1 : ((this.getNameDocument(b).toLowerCase() > this.getNameDocument(a).toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }
  getFilterList() {
    this.showPreloader = true;
    this.list = [];
    this.documentsService.filterDocuments(this.filter.getDataForFilter()).subscribe((data: any) => {

      data.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.list, this.usersStateService.getAllUsers())
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
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
