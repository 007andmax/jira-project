import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { DocumentCategoryAdd } from '../../documents/documents-add/class/document-category-add';
import { CategoryDocument } from './class/category-document';

@Component({
  selector: 'app-left-panel-documents',
  templateUrl: './left-panel-documents.component.html',
  styleUrls: ['./left-panel-documents.component.scss']
})
export class LeftPanelDocumentsComponent implements OnInit, OnDestroy {
  open: boolean = false;
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  @Input() activePage: string = "";

  toggleAddCategory: boolean = false;
  addCategory: DocumentCategoryAdd = new DocumentCategoryAdd();
  categories: Array<CategoryDocument> = [];
  sub: Subscription = new Subscription();
  constructor(private documentsService: DocumentsService,
    private documentsStateService: DocumentsStateService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,) { }

  ngOnInit() {
    this.activePage = this.leftPanelStateService.activePage;
    let onDocumentsPage = this.leftPanelStateService.onDocumentsPage.subscribe(data => {
      this.activePage = data;
    })
    this.sub.add(onDocumentsPage);
    this.leftPanelStateService.onToggleLeftPanel.subscribe(data => {
      if (data) this.open = false;
    })
    this.leftPanelStateService.onChangeState.subscribe(state => {
      if (!this.isDocumentsState(state)) this.open = false;
    })
    this.leftPanelStateService.onFirstOpen.subscribe(data => {
      if (this.isDocumentsState(data)) this.open = true;
    })
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      this.cd.detectChanges();
    })
  }
  isShowDoucments() {
    let ids = ["72381bff-127c-4a63-9d2e-6e952350dcbd", "73221c72-f87c-4519-8235-c4b57ad1cc19"];
    return (this.companiesStateService.getCurrentCompany()) ? ids.find(id => id === this.companiesStateService.getCurrentCompany().id) : false;
  }
  onCheckNameCategory() {
    let find = this.categories.find(item => item.name === this.addCategory.categoryName);
    if (!find) this.addCategory.setValidate(true);
  }
  onAddCategory() {
    if (this.addCategory.categoryName.length > 0) {
      if (!this.addCategory.isValidate(this.categories.find(item => item.name === this.addCategory.categoryName))) return;
      this.documentsService.addCategories(this.addCategory.categoryName).subscribe(data => {
        this.toggleAddCategory = false;
        this.addCategory.categoryName = "";
        this.addCategory = new DocumentCategoryAdd();
      })
    } else {
      this.addCategory = new DocumentCategoryAdd();
      this.toggleAddCategory = false;
      this.addCategory.categoryName = "";
    }
  }
  toggleCategory() {
    this.toggleAddCategory = !this.toggleAddCategory;
    this.addCategory = new DocumentCategoryAdd();
  }
  isDocumentsState(state) {
    return (state === 'new-documents' ||
      state === 'new-category-documents' ||
      state === 'new-add-documents' ||
      state === 'new-edit-documents' ||
      state === 'new-template-documents')
  }
  public close() {
    this.open = false;
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  public goToState(state) {
    this.onChangeState.emit(state);
  }

  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
