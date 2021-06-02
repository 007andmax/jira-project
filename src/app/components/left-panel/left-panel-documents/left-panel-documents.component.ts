import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentsService } from 'src/app/services/documents/documents.service';
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
    })
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
    return (state === 'new-documents' || state === 'new-category-documents' || state === 'new-add-documents' || state === 'new-edit-documents')
  }
  public close() {
    this.open = false;
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  public goToState() {
    this.onChangeState.emit('new-documents');
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
