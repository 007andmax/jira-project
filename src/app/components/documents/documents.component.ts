
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { REMOVE_CATEGORY_DOCUMENT, REMOVE_DOCUMENT } from 'src/app/const/confirm';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { Document } from './class/document';
import { DocumentFilter } from './class/document-filter';
import { fadeInAnimation } from 'src/app/animations';
import { DocumentsEditCategoryComponent } from './documents-edit-category/documents-edit-category.component';
import { DocumentsHeaderComponent } from './documents-header/documents-header.component';
import { DocumentsTemplatesInfoComponent } from './documents-templates/documents-templates-info/documents-templates-info.component';
import { DocumentsTableComponent } from './documents-table/documents-table.component';


@Component({
  imports: [DocumentsEditCategoryComponent, DocumentsHeaderComponent, DocumentsTableComponent, DocumentsTemplatesInfoComponent, CommonModule],
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./documents.component.scss'],

})
export class DocumentsComponent implements OnInit, OnDestroy {
  @ViewChild('header', { static: true }) header: DocumentsHeaderComponent;
  showPreloader: boolean = true;
  list: Array<Document> = [];
  filter: DocumentFilter = new DocumentFilter();
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService,
    public documentsStateService: DocumentsStateService,
    public confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    public leftPanelStateService: LeftPanelStateService,
    public companiesStateService: CompaniesStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    public documentsService: DocumentsService) {
  }

  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.companiesStateService.setCompanyRoutingId(null);
    let onGetCategories = this.documentsStateService.onGetCategories.subscribe(data => {
      data.forEach(element => {
        let findIndex = this.list.findIndex(item => item.categoryId === element.id);
        if (findIndex > -1) {
          this.list[findIndex].categoryName = element.name;
          if (element.assignedToCompany !== undefined) this.list[findIndex].assignedToCompany = element.assignedToCompany;
        }
      });
      if (data.length < this.list.filter(item => item.isCategory).length) {
        this.list.forEach((item, index) => {
          if (item.isCategory) {
            let findIndex = data.findIndex(element => element.id === item.categoryId);
            if (findIndex == -1) this.list.splice(index, 1);
          }
        });
      }
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
      this.list = [];
      data.categories.map(item => this.list.push(new Document({ categoryId: item.id, categoryName: item.name, assignedToCompany: item.assignedToCompany }, true)));
      data.documents.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (this.getNameDocument(a).toLowerCase() > this.getNameDocument(b).toLowerCase()) ?
        1 : ((this.getNameDocument(b).toLowerCase() > this.getNameDocument(a).toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
  }
  getFilterList() {
    this.showPreloader = true;
    this.list = [];
    this.documentsService.filterDocuments(this.filter.getDataForFilter()).subscribe((data: any) => {
      this.list = [];
      data.map(item => this.list.push(new Document(item)));
      this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
  }
  public onFilter(field) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.filter.onFilter(field, this.list, this.usersStateService.getAllUsers())
    this.header.sortBy.sortDirection = this.filter.direction;
  }
  removeCategory(item) {
    this.documentsService.removeCategories(item.categoryId).subscribe(data => {
      this.confirmStateService.initRequest(false);
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  removeDocument(item) {
    this.documentsService.removeDocument(item.id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.toastrService.success("The document has been successfully removed");
      this.appStateService.changeDetectorRef();
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  getNameDocument(item: Document) {
    if (item.categoryId) return item.categoryName;
    return item.title;
  }

  onRemoveCategory(data) {
    this.confirmStateService.setConfirmAction(REMOVE_CATEGORY_DOCUMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Category`;
    modalRef.componentInstance.message = `Are you sure you want to delete this category?`;
    this.documentsStateService.setCategoryForRemove(data);
  }
  onRemoveDocument(data) {
    this.confirmStateService.setConfirmAction(REMOVE_DOCUMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Delete Document`;
    modalRef.componentInstance.message = `Are you sure you want to delete this document?`;
    this.documentsStateService.setDocumentForRemove(data);
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
