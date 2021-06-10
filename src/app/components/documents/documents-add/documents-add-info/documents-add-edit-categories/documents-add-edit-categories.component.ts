import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { CategoryDocument } from 'src/app/components/left-panel/left-panel-documents/class/category-document';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_ALL_CATEGORIES, REMOVE_CATEGORY_DOCUMENT } from 'src/app/const/confirm';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { DocumentsStateService } from 'src/app/states/documents/documents-state.service';
import { DocumentCategoryAdd } from '../../class/document-category-add';
import { DocumentCategoryEdit } from '../../class/document-category-edit';

@Component({
  selector: 'documents-add-edit-categories',
  templateUrl: './documents-add-edit-categories.component.html',
  styleUrls: ['./documents-add-edit-categories.component.scss']
})
export class DocumentsAddEditCategoriesComponent implements OnInit, OnDestroy {
  @Output() onClosed = new EventEmitter();
  categories: Array<CategoryDocument> = [];
  selectedCategories: Array<CategoryDocument> = [];
  editCategory: DocumentCategoryEdit = new DocumentCategoryEdit();
  addCategory: DocumentCategoryAdd = new DocumentCategoryAdd();
  toggleAddCategory: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private documentsStateService: DocumentsStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    private documentsService: DocumentsService,) { }

  ngOnInit() {
    this.categories = this.documentsStateService.getCategories();
    this.documentsStateService.onGetCategories.subscribe((data: any) => {
      this.categories = data;
      this.cd.detectChanges();
      console.log("this.categories", this.categories);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CATEGORY_DOCUMENT) this.removeCategory(this.documentsStateService.getCategoryForRemove());
        if (this.confirmStateService.getConfirmAction() === REMOVE_ALL_CATEGORIES) this.removeAllCategories();

      }
    })
    this.sub.add(getConfirm);
  }
  removeCategory(item) {
    this.documentsService.removeCategories(item.id).subscribe(data => {

    })
  }
  onSelectCategory(event, item) {
    if (event.target.checked) {
      this.selectedCategories.push(item);
    } else {
      let index = this.selectedCategories.findIndex(cat => cat.id === item.id);
      if (index > -1) this.selectedCategories.splice(index, 1);
    }
  }
  toggleEditCategory(item) {
    this.editCategory = new DocumentCategoryEdit(item.id, JSON.parse(JSON.stringify(item.name)), JSON.parse(JSON.stringify(item.name)));
  }
  toggleCategory() {
    this.toggleAddCategory = !this.toggleAddCategory;
    this.addCategory = new DocumentCategoryAdd();
  }
  removeAllCategories() {
    console.log("this.documentsStateService.getCategoriesForRemove()", this.documentsStateService.getCategoriesForRemove());
    forkJoin(this.documentsStateService.getCategoriesForRemove().map(item => this.documentsService.removeCategories(item.id)))
      .subscribe(
        () => {
          this.selectedCategories = [];
        },
        error => {

        }
      );
  }

  onRemoveAllCategories() {
    if (this.selectedCategories.length === 0) return;
    this.confirmStateService.setConfirmAction(REMOVE_ALL_CATEGORIES);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete selected categories?`;
    this.documentsStateService.setCategoriesForRemove(this.selectedCategories);
  }
  onCheckNameCategory() {
    let find = this.categories.find(item => item.name === this.addCategory.categoryName);
    if (!find) this.addCategory.setValidate(true);
  }
  onCheckNameCategoryForEdit() {
    let find = this.categories.find(item => item.name === this.editCategory.newName);
    if (!find) this.editCategory.setValidate(true);
  }
  onEditCategory() {
    console.log("onEditCategory");
    if (this.editCategory.name !== this.editCategory.newName) {
      if (!this.editCategory.isValidate(this.categories.find(item => item.name === this.editCategory.newName))) return;
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
    console.log("this.addCategory.categoryName", this.addCategory.categoryName);
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
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  close() {
    this.onClosed.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
