import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REMOVE_DOCUMENT } from 'src/app/const/confirm';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { Document } from '../class/document';
import { DocumentFilter } from '../class/document-filter';

@Component({
  selector: 'documents-category',
  templateUrl: './documents-category.component.html',
  styleUrls: ['./documents-category.component.css']
})
export class DocumentsCategoryComponent implements OnInit, OnDestroy {
  categoryId: string;
  showPreloader: boolean = true;
  list: Array<Document> = [];
  filter: DocumentFilter = new DocumentFilter();
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    private documentsStateService: DocumentsStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    public cd: ChangeDetectorRef,
    private leftPanelStateService: LeftPanelStateService,

    private documentsService: DocumentsService) {
    this.categoryId = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      this.categoryId = params['id'];
      this.filter.setCategoryId(this.categoryId);
      console.log("this.categoryId", this.categoryId);
      this.getList();
    });
    this.sub.add(subscription);
  }


  ngOnInit() {
    let onChangeDocument = this.documentsStateService.onChangeDocument.subscribe(data => {
      console.log("data", data);
      if (data.action === "DOCUMENT_SAVED" && this.categoryId === data.data.categoryId) this.list.push(new Document(data.data));
      if (data.action === "DOCUMENT_EDITED") {

        let findIndex = this.list.findIndex(item => item.id === data.data.id);
        if (findIndex > -1 && this.categoryId === data.data.categoryId) this.list[findIndex] = new Document(data.data);
        if (findIndex > -1 && this.categoryId !== data.data.categoryId) this.list.splice(findIndex, 1);
        console.log("findIndex", findIndex);
      }
      if (data.action === "DOCUMENT_REMOVED") {
        let findIndex = this.list.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.list.splice(findIndex, 1);
        console.log("findIndex", findIndex);
      }
      this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.cd.detectChanges();

    })
    this.sub.add(onChangeDocument);
    let filter = this.documentsStateService.filter.subscribe(data => {
      this.showPreloader = true;
      this.filter.setFilters(data);
      this.getList();
    })
    this.sub.add(filter);

    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_DOCUMENT) this.removeDocument(this.documentsStateService.getDocumentForRemove());

      }
    })
    this.sub.add(getConfirm);

    this.leftPanelStateService.changeStateWithoutNavigate("new-category-documents");
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.list, this.usersStateService.getAllUsers())
  }

  getList() {
    this.list = [];
    this.documentsService.filterDocuments(this.filter.getDataForFilter()).subscribe((data: any) => {

      data.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      console.log("this.list", this.list);
    })
  }

  removeDocument(item) {
    this.documentsService.removeDocument(item.id).subscribe(data => {

    })
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
