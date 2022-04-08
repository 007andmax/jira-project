import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVED_SUPPORT_CATEGORY } from 'src/app/const/confirm';
import { SupportPageCategory } from '../../left-panel-super-admin-categories/class/support-page-category';
import { SupportPageCategoriesService } from '../../services/support-page-categories/support-page-categories.service';
import { SupportPageEditCategoryComponent } from '../../shared/support-page-edit-category/support-page-edit-category.component';
import { SupportPageCategoriesStateService } from '../../state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategoryContent } from '../class/support-page-category-content';

@Component({
  selector: 'support-page-header',
  templateUrl: './support-page-header.component.html',
  styleUrls: ['./support-page-header.component.scss']
})
export class SupportPageHeaderComponent implements OnInit {
  @Input() selectedCategory: SupportPageCategory;
  @Input() supportPageCategoryContent: SupportPageCategoryContent;
  @Output() onPreview = new EventEmitter();
  @Output() onCheckAddAttachments = new EventEmitter();
  @Output() onCheckEditAttachments = new EventEmitter();
  isPreview: boolean = false;
  constructor(private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private modalService: NgbModal,
    private supportPageCategoriesService: SupportPageCategoriesService,
    private confirmStateService: ConfirmStateService,) { }

  ngOnInit() {

  }
  public setPreview(data) {
    this.isPreview = data;
    this.onPreview.emit(data);
  }
  public toglePreview() {
    this.isPreview = !this.isPreview;
    this.onPreview.emit(this.isPreview);
  }
  editCategoryName() {
    const modalRef = this.modalService.open(SupportPageEditCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.category_id = this.selectedCategory.id;
    modalRef.componentInstance.name = this.selectedCategory.name;
  }

  saveContent(type) {
    this.supportPageCategoryContent.setType(type);
    this.supportPageCategoriesService.saveContent(this.selectedCategory.id, this.supportPageCategoryContent.getData(), (type === "DRAFT") ? "Draft Saved Successfully" : "Document published successfully").subscribe(data => {
      if (!this.supportPageCategoryContent.isEditMode) this.onCheckAddAttachments.emit(null);
      if (this.supportPageCategoryContent.isEditMode) this.onCheckEditAttachments.emit(null);
    })
  }
  removeCategory() {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_CATEGORY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete the category?`;
    this.supportPageCategoriesStateService.setCategoryForRemove(this.selectedCategory);
  }
}
