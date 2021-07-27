import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { REMOVE_DOCUMENT } from 'src/app/const/confirm';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { Document } from '../class/document';
import { DocumentTemplateFilter } from '../class/document-template-filter';
import { DocumentsTemplatesHeaderComponent } from './documents-templates-header/documents-templates-header.component';

@Component({
  selector: 'documents-templates',
  templateUrl: './documents-templates.component.html',
  styleUrls: ['./documents-templates.component.scss']
})
export class DocumentsTemplatesComponent implements OnInit, OnDestroy {
  companyId: string;
  openCategories: boolean = false;
  showPreloader: boolean = true;
  tab = 'MY_TEMPLATES';
  @ViewChild('header') header: DocumentsTemplatesHeaderComponent;
  list: Array<Document> = [];
  reqList: Array<Document> = [];
  filter: DocumentTemplateFilter = new DocumentTemplateFilter();
  sub: Subscription = new Subscription();
  constructor(private documentsService: DocumentsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    public activateRoute: ActivatedRoute,
    private router: Router,
    public leftPanelStateService: LeftPanelStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    private documentsStateService: DocumentsStateService) { }

  ngOnInit() {
    this.leftPanelStateService.changeStateWithoutNavigate('new-template-documents');
    let queryParams = this.activateRoute.queryParams.subscribe(
      (queryParam: any) => {
        if (queryParam['companyId']) this.companyId = queryParam['companyId'];
      }
    );
    this.sub.add(queryParams);
    this.filter.setDocumentType("TEMPLATE");
    let filterTemplate = this.documentsStateService.filterTemplate.subscribe(data => {
      this.filter.setFilters(data);
      this.getFilterList();
    })
    this.sub.add(filterTemplate);
    this.getListCategories();
    this.getFilterList();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_DOCUMENT) this.removeDocument(this.documentsStateService.getDocumentForRemove());
      }
    })
    this.sub.add(getConfirm);
    let onChangeDocument = this.documentsStateService.onChangeDocument.subscribe(data => {
      if (data.action === "DOCUMENT_SAVED" && this.tab === 'MY_TEMPLATES' && this.filter.isMatchIheFilter(data.data)) this.list.push(new Document(data.data));
      if (data.action === "DOCUMENT_EDITED") {
        let findIndex = this.list.findIndex(item => item.id === data.data.id);
        this.list[findIndex] = new Document(data.data);
      }
      if (data.action === "DOCUMENT_REMOVED") {
        let findIndex = this.list.findIndex(item => item.id === data.data);
        if (findIndex > -1) this.list.splice(findIndex, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(onChangeDocument);
  }
  removeDocument(item) {
    this.documentsService.removeDocument(item.id).subscribe(data => {
      this.toastrService.success("The template has been successfully removed");
      this.appStateService.changeDetectorRef();
    })
  }
  public goToDocumentsList() {
    if (this.companyId) {
      this.router.navigate(
        ['/ng2/company/', this.companyId, 'documents']);
    } else {
      this.leftPanelStateService.goToState('new-documents');
    }
  }
  onSearch(data) {
    this.filter.setSearch(data);
    this.list = this.filter.getFilterList(this.reqList);
  }
  getListCategories() {
    this.documentsService.getTemplateCategories((this.tab === 'TEMPLATE_GALLERY')).subscribe(data => {
      this.documentsStateService.setCategoriesTemplate(data);
    })
  }
  getFilterList() {
    this.showPreloader = true;
    this.list = [];
    this.reqList = [];
    this.filter.setIsDefaultTemplate((this.tab === 'TEMPLATE_GALLERY'));
    this.documentsService.filterDocuments(this.filter.getDataForFilter()).subscribe((data: any) => {
      data.map(item => this.list.push(new Document(item)));
      data.map(item => this.reqList.push(new Document(item)));
      this.list = this.filter.getFilterList(this.reqList);
      this.list.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.reqList.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ?
        1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
    })
  }
  onRemoveDocument(data) {
    this.confirmStateService.setConfirmAction(REMOVE_DOCUMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete this template?`;
    this.documentsStateService.setDocumentForRemove(data);
  }
  onChangeTemplate(data) {
    this.tab = data;
    this.header.filter.onClearAll();
    this.getListCategories();
  }
  toggleOpenCategories() {
    this.openCategories = !this.openCategories;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
