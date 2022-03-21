import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REMOVED_SUPPORT_CATEGORY } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { SupportPageCategoriesService } from '../services/support-page-categories/support-page-categories.service';
import { SupportPageAddCategoryComponent } from '../shared/support-page-add-category/support-page-add-category.component';
import { SupportPageAddSubCategoryComponent } from '../shared/support-page-add-sub-category/support-page-add-sub-category.component';
import { SupportPageEditCategoryComponent } from '../shared/support-page-edit-category/support-page-edit-category.component';
import { SupportPageCategoriesStateService } from '../state/support-page-categories/support-page-categories-state.service';
import { SupportPageCategory } from './class/support-page-category';

@Component({
  selector: 'left-panel-super-admin-categories',
  templateUrl: './left-panel-super-admin-categories.component.html',
  styleUrls: ['./left-panel-super-admin-categories.component.scss']
})
export class LeftPanelSuperAdminCategoriesComponent implements OnInit, OnDestroy {
  categories: Array<SupportPageCategory> = [];
  sub: Subscription = new Subscription();
  constructor(private modalService: NgbModal,
    private supportPageCategoriesService: SupportPageCategoriesService,
    private supportPageCategoriesStateService: SupportPageCategoriesStateService,
    private confirmStateService: ConfirmStateService,) { }


  ngOnInit() {
    this.supportPageCategoriesService.getCategories().subscribe((data: any) => {
      console.log("data", data);
      this.categories = data.map(item => new SupportPageCategory(item));
      console.log("this.categories", this.categories);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVED_SUPPORT_CATEGORY) {
          this.onRemoveCategory(this.supportPageCategoriesStateService.getCategoryForRemove().id);
        }

      }
    })
    this.sub.add(getConfirm);
  }
  add() {
    const modalRef = this.modalService.open(SupportPageAddCategoryComponent, { windowClass: 'xs-modal user-modal' });
  }
  editCategory(category) {
    const modalRef = this.modalService.open(SupportPageEditCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.category_id = category.id;
    modalRef.componentInstance.name = category.name;
  }
  addSubCategory(id) {
    const modalRef = this.modalService.open(SupportPageAddSubCategoryComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.parentSupportCategoryId = id;
  }
  onRemoveCategory(id) {
    this.supportPageCategoriesService.removeCategory(id).subscribe(data => {

    })
  }
  delete(category) {
    this.confirmStateService.setConfirmAction(REMOVED_SUPPORT_CATEGORY);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Do you want to delete the category?`;
    this.supportPageCategoriesStateService.setCategoryForRemove(category);
  }




  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
