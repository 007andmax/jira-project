import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_CATEGORY_DOCUMENT } from 'src/app/const/confirm';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { DocumentCategoryEdit } from '../../class/document-category-edit';

@Component({
  selector: 'documents-add-edit-categories',
  templateUrl: './documents-add-edit-categories.component.html',
  styleUrls: ['./documents-add-edit-categories.component.scss']
})
export class DocumentsAddEditCategoriesComponent implements OnInit, OnDestroy {
  @Output() onClosed = new EventEmitter();
  categories: Array<CategoryDocument> = [];
  editCategory: DocumentCategoryEdit = new DocumentCategoryEdit();
  toggleAddCategory: boolean = false;
  categoryName: string = "";
  sub: Subscription = new Subscription();
  constructor(private documentsStateService: DocumentsStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private documentsService: DocumentsService,) { }

  ngOnInit() {
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      console.log("this.categories", this.categories);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_DOCUMENT) this.removeCategory(this.documentsStateService.getCategoryForRemove());

      }
    })
    this.sub.add(getConfirm);
  }
  removeCategory(item) {
    this.documentsService.removeCategories(item.id).subscribe(data => {

    })
  }
  toggleEditCategory(item) {
    this.editCategory = new DocumentCategoryEdit(item.id, JSON.parse(JSON.stringify(item.name)), JSON.parse(JSON.stringify(item.name)));
  }
  toggleCategory() {
    this.toggleAddCategory = !this.toggleAddCategory;
    this.categoryName = "";
  }
  onEditCategory() {
    if (this.editCategory.name !== this.editCategory.newName) {
      this.documentsService.editNameCategory(this.editCategory.id, this.editCategory.newName).subscribe(data => {
        this.editCategory = new DocumentCategoryEdit();
      })
    } else {
      this.editCategory = new DocumentCategoryEdit();
    }
  }
  onRemoveCategory(data) {
    this.confirmStateService.setConfirmAction(REMOVE_CATEGORY_DOCUMENT);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete this category?`;
    this.documentsStateService.setCategoryForRemove(data);
  }
  onAddCategory() {
    if (this.categoryName.length > 0) {
      this.documentsService.addCategories(this.categoryName).subscribe(data => {
        this.toggleAddCategory = false;
        this.categoryName = "";
      })
    } else {
      this.toggleAddCategory = false;
      this.categoryName = "";
    }
  }
  close() {
    this.onClosed.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
